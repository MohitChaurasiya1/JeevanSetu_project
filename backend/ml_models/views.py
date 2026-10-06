from rest_framework import viewsets
from .models import MLModel
from .serializers import MLModelSerializer
from core.permissions import IsAdminRole


class MLModelViewSet(viewsets.ModelViewSet):
    queryset = MLModel.objects.all()
    serializer_class = MLModelSerializer
    permission_classes = [IsAdminRole]
