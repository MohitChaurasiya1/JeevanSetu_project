from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import AuditLog
from .serializers import AuditLogSerializer


class IsAdminOrStaff(permissions.BasePermission):
    """
    Allows access to admin users (role in ['ADMIN', 'SUPER_ADMIN'], is_staff, is_superuser).
    """
    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and (
                user.is_staff
                or user.is_superuser
                or getattr(user, 'role', None) in ['ADMIN', 'SUPER_ADMIN']
            )
        )


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Admin API endpoint to retrieve, filter, and summarize audit logs.
    Supports filtering by ?action=LOGIN/REGISTER, ?status=SUCCESS/FAILED, ?username=..., ?search=...
    """
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdminOrStaff]

    def get_queryset(self):
        queryset = AuditLog.objects.all().select_related('user').order_by('-created_at')

        action_param = self.request.query_params.get('action')
        if action_param:
            queryset = queryset.filter(action__iexact=action_param.strip())

        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status__iexact=status_param.strip())

        module_param = self.request.query_params.get('module')
        if module_param:
            queryset = queryset.filter(module__iexact=module_param.strip())

        user_id_param = self.request.query_params.get('user_id')
        if user_id_param:
            queryset = queryset.filter(user_id=user_id_param.strip())

        username_param = self.request.query_params.get('username')
        if username_param:
            queryset = queryset.filter(
                Q(username__icontains=username_param.strip())
                | Q(user__username__icontains=username_param.strip())
            )

        search_param = self.request.query_params.get('search')
        if search_param:
            search = search_param.strip()
            queryset = queryset.filter(
                Q(username__icontains=search)
                | Q(user__username__icontains=search)
                | Q(description__icontains=search)
                | Q(ip_address__icontains=search)
                | Q(action__icontains=search)
            )

        return queryset

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """
        Returns aggregate statistics:
        - total_logs
        - total_registrations
        - total_logins
        - total_successful_logins
        - total_failed_logins
        """
        total_logs = AuditLog.objects.count()
        total_registrations = AuditLog.objects.filter(action='REGISTER', status='SUCCESS').count()
        total_successful_logins = AuditLog.objects.filter(action='LOGIN', status='SUCCESS').count()
        total_failed_logins = AuditLog.objects.filter(action='LOGIN', status='FAILED').count()
        total_logins = total_successful_logins + total_failed_logins

        return Response({
            'total_logs': total_logs,
            'total_registrations': total_registrations,
            'total_logins': total_logins,
            'total_successful_logins': total_successful_logins,
            'total_failed_logins': total_failed_logins,
        }, status=status.HTTP_200_OK)
