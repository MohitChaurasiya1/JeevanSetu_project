from rest_framework import viewsets, permissions
from .models import Disease, Symptom
from .serializers import DiseaseSerializer, SymptomSerializer
from core.authentication import OptionalJWTAuthentication
from core.permissions import IsAdminRole


class DiseaseViewSet(viewsets.ModelViewSet):
    """
    Catalog of diseases.
    - Public read (list & retrieve) sees active records only.
    - Admin users see all records (including inactive) and can create/update/delete.
    """
    queryset = Disease.objects.all()
    serializer_class = DiseaseSerializer
    authentication_classes = [OptionalJWTAuthentication]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsAdminRole()]

    def get_queryset(self):
        user = self.request.user
        is_admin = bool(
            user
            and user.is_authenticated
            and (
                user.is_staff
                or user.is_superuser
                or getattr(user, 'role', None) in ['ADMIN', 'SUPER_ADMIN']
            )
        )
        if is_admin:
            return Disease.objects.all().order_by('name')
        return Disease.objects.filter(is_active=True).order_by('name')


class SymptomViewSet(viewsets.ModelViewSet):
    """
    Catalog of symptoms.
    - Public read (list & retrieve) sees active records only.
    - Admin users see all records (including inactive) and can create/update/delete.
    """
    queryset = Symptom.objects.all()
    serializer_class = SymptomSerializer
    authentication_classes = [OptionalJWTAuthentication]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsAdminRole()]

    def get_queryset(self):
        user = self.request.user
        is_admin = bool(
            user
            and user.is_authenticated
            and (
                user.is_staff
                or user.is_superuser
                or getattr(user, 'role', None) in ['ADMIN', 'SUPER_ADMIN']
            )
        )
        if is_admin:
            return Symptom.objects.all().order_by('name')
        return Symptom.objects.filter(is_active=True).order_by('name')
