from rest_framework import serializers
from .models import Prediction

class PredictionInputSerializer(serializers.Serializer):
    pregnancies = serializers.FloatField(required=False, default=0.0)
    glucose = serializers.FloatField(required=True)
    blood_pressure = serializers.FloatField(required=True)
    skin_thickness = serializers.FloatField(required=True)
    insulin = serializers.FloatField(required=True)
    bmi = serializers.FloatField(required=True)
    dpf = serializers.FloatField(required=False, default=0.5)
    diabetes_pedigree_function = serializers.FloatField(required=False, allow_null=True, default=None)
    age = serializers.FloatField(required=False, default=30.0)

    def validate(self, data):
        # Allow either 'dpf' or 'diabetes_pedigree_function'
        dpf_val = data.get('dpf')
        alt_val = data.get('diabetes_pedigree_function')
        if alt_val is not None:
            data['dpf'] = alt_val
        elif dpf_val is None:
            data['dpf'] = 0.5

        # Remove the extra key so it doesn't cause conflicting lookups
        data.pop('diabetes_pedigree_function', None)
        return data

class PredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prediction
        fields = '__all__'
        read_only_fields = ['id', 'created_at']
