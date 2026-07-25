from rest_framework import viewsets, permissions
from .models import Disease, Symptom
from .serializers import DiseaseSerializer, SymptomSerializer

class DiseaseViewSet(viewsets.ModelViewSet):
    queryset = Disease.objects.filter(is_active=True)
    serializer_class = DiseaseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class SymptomViewSet(viewsets.ModelViewSet):
    queryset = Symptom.objects.filter(is_active=True)
    serializer_class = SymptomSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
