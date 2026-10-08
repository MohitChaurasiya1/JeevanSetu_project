from rest_framework import viewsets, permissions, generics, status, serializers
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.db.models import Q, Count

from .models import User
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    CustomTokenObtainPairSerializer,
)
from .permissions import IsSelfOrAdmin
from core.permissions import IsAdminRole
from audit_logs.services import log_audit_event


class RegisterAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        log_audit_event(
            user=user,
            username=user.username,
            action='REGISTER',
            status='SUCCESS',
            module='AUTH',
            record_id=str(user.id),
            description=f"User registered with role {user.role} ({user.email})",
            request=self.request,
        )


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    JWT Login view supporting both username and email authentication.
    Safely records successful and failed login attempts without storing credentials.
    """
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        username_or_email = (request.data.get('username') or '').strip()
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except Exception as exc:
            user = None
            if username_or_email:
                user = User.objects.filter(
                    Q(username__iexact=username_or_email) | Q(email__iexact=username_or_email)
                ).first()

            log_audit_event(
                user=user,
                username=user.username if user else username_or_email,
                action='LOGIN',
                status='FAILED',
                module='AUTH',
                record_id=str(user.id) if user else None,
                description=f"Failed login attempt for identifier '{username_or_email}'",
                request=request,
            )
            raise exc

        user = serializer.user
        log_audit_event(
            user=user,
            username=user.username,
            action='LOGIN',
            status='SUCCESS',
            module='AUTH',
            record_id=str(user.id),
            description=f"User '{user.username}' ({user.role}) logged in successfully",
            request=request,
        )

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ModelViewSet):
    """
    User management ViewSet.
    - Admins get full CRUD access, filtering (?search=, ?role=, ?is_active=) and pagination.
    - Annotates prediction_count per user to eliminate N+1 queries.
    - Blocks admin from deleting or deactivating their own account.
    - Blocks deletion of a SUPER_ADMIN unless requester is SUPER_ADMIN.
    - Non-admins can only retrieve their own record.
    """
    queryset = User.objects.annotate(prediction_count=Count('predictions')).order_by('-created_at')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['list', 'create', 'update', 'partial_update', 'destroy']:
            return [IsAdminRole()]
        if self.action == 'retrieve':
            return [permissions.IsAuthenticated(), IsSelfOrAdmin()]
        return [IsAdminRole()]

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return User.objects.none()

        is_admin = bool(
            user.is_staff
            or user.is_superuser
            or getattr(user, 'role', None) in ['ADMIN', 'SUPER_ADMIN']
        )

        if is_admin:
            queryset = User.objects.annotate(prediction_count=Count('predictions')).order_by('-created_at')

            search = self.request.query_params.get('search')
            if search:
                search = search.strip()
                queryset = queryset.filter(
                    Q(username__icontains=search)
                    | Q(full_name__icontains=search)
                    | Q(email__icontains=search)
                )

            role = self.request.query_params.get('role')
            if role:
                queryset = queryset.filter(role__iexact=role.strip())

            is_active = self.request.query_params.get('is_active')
            if is_active is not None and is_active != '':
                if is_active.lower() in ['true', '1']:
                    queryset = queryset.filter(is_active=True)
                elif is_active.lower() in ['false', '0']:
                    queryset = queryset.filter(is_active=False)

            return queryset

        return User.objects.filter(id=user.id).annotate(prediction_count=Count('predictions'))

    def perform_update(self, serializer):
        instance = serializer.instance
        requester = self.request.user

        # Prevent admin from deactivating their own account
        if instance.id == requester.id:
            new_is_active = serializer.validated_data.get('is_active')
            if new_is_active is False:
                raise serializers.ValidationError({"is_active": "You cannot deactivate your own account."})

        user = serializer.save()
        log_audit_event(
            user=requester,
            username=requester.username,
            action='PROFILE_UPDATE',
            status='SUCCESS',
            module='USERS',
            record_id=str(user.id),
            description=f"User '{user.username}' updated by '{requester.username}'",
            request=self.request,
        )

    def perform_destroy(self, instance):
        requester = self.request.user

        # Prevent self-deletion
        if instance.id == requester.id:
            raise serializers.ValidationError({"detail": "You cannot delete your own account."})

        # Prevent deleting a SUPER_ADMIN unless requester is SUPER_ADMIN
        is_target_super_admin = bool(instance.is_superuser or instance.role == 'SUPER_ADMIN')
        is_requester_super_admin = bool(requester.is_superuser or requester.role == 'SUPER_ADMIN')

        if is_target_super_admin and not is_requester_super_admin:
            raise serializers.ValidationError({"detail": "Only Super Admins can delete a Super Admin account."})

        username = instance.username
        record_id = str(instance.id)
        instance.delete()

        log_audit_event(
            user=requester,
            username=requester.username,
            action='OTHER',
            status='SUCCESS',
            module='USERS',
            record_id=record_id,
            description=f"User '{username}' deleted by '{requester.username}'",
            request=self.request,
        )


class MeAPIView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class LogoutAPIView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        log_audit_event(
            user=user,
            username=user.username,
            action='LOGOUT',
            status='SUCCESS',
            module='AUTH',
            record_id=str(user.id),
            description=f"User '{user.username}' ({user.role}) logged out",
            request=request,
        )
        return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)