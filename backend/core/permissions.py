from rest_framework.permissions import BasePermission


class IsAdminRole(BasePermission):
    """
    Allows access only to authenticated admin users:
    - user.is_staff
    - user.is_superuser
    - user.role in ['ADMIN', 'SUPER_ADMIN']
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


# Backward compatibility alias
IsAdminUserRole = IsAdminRole
