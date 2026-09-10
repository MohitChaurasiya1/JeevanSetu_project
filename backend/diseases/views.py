from rest_framework import viewsets, permissions
from .models import Disease, Symptom
from .serializers import DiseaseSerializer, SymptomSerializer
from core.authentication import OptionalJWTAuthentication


class DiseaseViewSet(viewsets.ModelViewSet):
    """
    Public read-only catalog of diseases.
    Uses OptionalJWTAuthentication so that stale/expired browser tokens do not
    block unauthenticated GET requests (list & retrieve). Writes still require
    a valid authenticated token via IsAuthenticatedOrReadOnly.
    """
    queryset = Disease.objects.filter(is_active=True)
    serializer_class = DiseaseSerializer
    authentication_classes = [OptionalJWTAuthentication]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class SymptomViewSet(viewsets.ModelViewSet):
    """
    Public read-only catalog of symptoms.
    Same authentication strategy as DiseaseViewSet.
    """
    queryset = Symptom.objects.filter(is_active=True)
    serializer_class = SymptomSerializer
    authentication_classes = [OptionalJWTAuthentication]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

