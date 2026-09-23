from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.db.models import Q

from .models import User
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    CustomTokenObtainPairSerializer,
)
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
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class MeAPIView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user