from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Prediction
from .serializers import PredictionSerializer, PredictionInputSerializer
from ml_engine.predictor import DiseasePredictor
from diseases.models import Disease

from core.authentication import OptionalJWTAuthentication

class PredictionViewSet(viewsets.ModelViewSet):
    serializer_class = PredictionSerializer
    authentication_classes = [OptionalJWTAuthentication]

    def get_permissions(self):
        # Allow any user (including guest/public) to test symptoms and get a risk prediction
        if self.action == 'predict':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        return Prediction.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'], url_path='predict')
    def predict(self, request):
        serializer = PredictionInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        features = serializer.validated_data

        try:
            result = DiseasePredictor.predict(features)
        except Exception as e:
            return Response(
                {"error": f"Prediction engine error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # If user is authenticated, save record to history
        if request.user and request.user.is_authenticated:
            disease_obj = Disease.objects.filter(name__iexact='Diabetes').first()
            Prediction.objects.create(
                user=request.user,
                disease=disease_obj,
                input_data=features,
                prediction_result=result.get("risk"),
                probability=result.get("probability", 0.0),
                risk_level=result.get("risk_level", "LOW"),
                model_version="1.0.0"
            )

        return Response(result, status=status.HTTP_200_OK)
