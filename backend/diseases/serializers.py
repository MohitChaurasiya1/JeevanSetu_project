from rest_framework import serializers
from .models import Disease, Symptom


class DiseaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disease
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_symptoms(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError('symptoms must be a list of strings.')
        return value

    def validate_risk_factors(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError('risk_factors must be a list.')
        return value

    def validate_causes(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError('causes must be a list of strings.')
        return value

    def validate_prevention(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError('prevention must be a list of strings.')
        return value

    def validate_treatment(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError('treatment must be a list of strings.')
        return value


class SymptomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Symptom
        fields = '__all__'
