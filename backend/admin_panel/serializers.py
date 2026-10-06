from rest_framework import serializers
from django.contrib.auth import get_user_model
from predictions.models import Prediction
from .models import AdminOTP

User = get_user_model()


class AdminOTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminOTP
        fields = '__all__'


class AdminPredictionUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'email']


class AdminPredictionSerializer(serializers.ModelSerializer):
    user = AdminPredictionUserSerializer(read_only=True)
    disease_name = serializers.SerializerMethodField()

    class Meta:
        model = Prediction
        fields = [
            'id',
            'user',
            'disease',
            'disease_name',
            'prediction_result',
            'probability',
            'risk_level',
            'model_version',
            'input_data',
            'created_at',
        ]

    def get_disease_name(self, obj):
        if obj.disease and obj.disease.name:
            return obj.disease.name
        return 'Diabetes'
