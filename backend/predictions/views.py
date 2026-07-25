from rest_framework import viewsets, permissions
from .models import Prediction
from .serializers import PredictionSerializer

class PredictionViewSet(viewsets.ModelViewSet):
    serializer_class = PredictionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Prediction.objects.filter(user=self.request.user)
