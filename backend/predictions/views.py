from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Prediction
from .serializers import PredictionSerializer, PredictionInputSerializer

from ml_engine.predictor import DiseasePredictor
from diseases.models import Disease

from core.authentication import OptionalJWTAuthentication


from audit_logs.services import log_audit_event


class PredictionViewSet(viewsets.ModelViewSet):
    serializer_class = PredictionSerializer
    authentication_classes = [OptionalJWTAuthentication]

    def get_permissions(self):
        # Allow public users to get a prediction.
        # Other prediction APIs require authentication.
        if self.action == 'predict':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        # Authenticated users can only access their own prediction history.
        return Prediction.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'], url_path='predict')
    def predict(self, request):
        # Validate prediction input
        serializer = PredictionInputSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        features = serializer.validated_data

        # Run ML prediction
        try:
            target_disease = features.get('disease', 'Diabetes')
            result = DiseasePredictor.predict(features, disease=target_disease)

        except Exception as e:
            return Response(
                {
                    "error": f"Prediction engine error: {str(e)}"
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Save prediction for authenticated users
        if request.user and request.user.is_authenticated:
            disease_name = result.get("disease", "Diabetes")
            disease_obj = Disease.objects.filter(name__iexact=disease_name).first()
            if not disease_obj:
                disease_obj = Disease.objects.filter(
                    name__icontains="Heart" if "heart" in disease_name.lower() else "Diabetes"
                ).first()

            prediction = Prediction.objects.create(
                user=request.user,
                disease=disease_obj,
                input_data=features,
                prediction_result=result.get("risk"),
                probability=result.get("probability", 0.0),
                risk_level=result.get("risk_level", "LOW"),
                model_version="2.0.0"
            )

            # Log audit event
            log_audit_event(
                user=request.user,
                username=request.user.username,
                action='OTHER',
                status='SUCCESS',
                module='PREDICTIONS',
                record_id=str(prediction.id),
                description=f"Prediction generated: {result.get('risk', 'Unknown')} (Risk: {result.get('risk_level', 'LOW')})",
                request=request,
            )

            # Return the database ID so frontend can
            # open the exact prediction later.
            result["prediction_id"] = prediction.id

        return Response(
            result,
            status=status.HTTP_200_OK
        )