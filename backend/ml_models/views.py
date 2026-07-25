from rest_framework import viewsets, permissions
from .models import MLModel
from .serializers import MLModelSerializer

class MLModelViewSet(viewsets.ModelViewSet):
    queryset = MLModel.objects.all()
    serializer_class = MLModelSerializer
    permission_classes = [permissions.IsAdminUser]
