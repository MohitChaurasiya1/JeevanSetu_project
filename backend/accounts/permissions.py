from rest_framework.permissions import BasePermission


class IsSelfOrAdmin(BasePermission):
    """
    Object-level permission allowing admins or the owner of the object to access it.
    """
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        is_admin = bool(
            user.is_staff
            or user.is_superuser
            or getattr(user, 'role', None) in ['ADMIN', 'SUPER_ADMIN']
        )
        return is_admin or obj.id == user.id
