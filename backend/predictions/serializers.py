from rest_framework import serializers
from .models import Prediction

class PredictionInputSerializer(serializers.Serializer):
    disease = serializers.CharField(required=False, default='Diabetes')

    # Diabetes fields
    glucose = serializers.FloatField(required=False, default=None)
    blood_pressure = serializers.FloatField(required=False, default=None)
    skin_thickness = serializers.FloatField(required=False, default=None)
    insulin = serializers.FloatField(required=False, default=None)
    bmi = serializers.FloatField(required=False, default=None)
    pregnancies = serializers.FloatField(required=False, default=0.0)
    dpf = serializers.FloatField(required=False, default=0.5)
    diabetes_pedigree_function = serializers.FloatField(required=False, allow_null=True, default=None)

    # Common / Demographics
    age = serializers.FloatField(required=False, default=45.0)
    gender = serializers.FloatField(required=False, default=1.0)  # 1: Male, 0: Female

    # Heart Disease fields (Symptoms & Clinical Factors)
    chest_pain = serializers.FloatField(required=False, default=0.0)
    shortness_of_breath = serializers.FloatField(required=False, default=0.0)
    fatigue = serializers.FloatField(required=False, default=0.0)
    palpitations = serializers.FloatField(required=False, default=0.0)
    dizziness = serializers.FloatField(required=False, default=0.0)
    swelling = serializers.FloatField(required=False, default=0.0)
    pain_arms_jaw_back = serializers.FloatField(required=False, default=0.0)
    cold_sweats_nausea = serializers.FloatField(required=False, default=0.0)
    high_bp = serializers.FloatField(required=False, default=0.0)
    high_cholesterol = serializers.FloatField(required=False, default=0.0)
    diabetes = serializers.FloatField(required=False, default=0.0)
    smoking = serializers.FloatField(required=False, default=0.0)
    obesity = serializers.FloatField(required=False, default=0.0)
    sedentary_lifestyle = serializers.FloatField(required=False, default=0.0)
    family_history = serializers.FloatField(required=False, default=0.0)
    chronic_stress = serializers.FloatField(required=False, default=0.0)

    def validate(self, data):
        disease_type = (data.get('disease') or 'Diabetes').strip().lower()

        # If Heart Disease requested or heart features provided without diabetes glucose
        if 'heart' in disease_type or (data.get('glucose') is None and 'chest_pain' in self.initial_data):
            data['disease'] = 'Heart Disease'
            return data

        # Otherwise validate Diabetes required fields
        data['disease'] = 'Diabetes'
        required_diabetes = ['glucose', 'blood_pressure', 'skin_thickness', 'insulin', 'bmi']
        missing = [f for f in required_diabetes if data.get(f) is None]
        if missing:
            raise serializers.ValidationError(
                {field: f"This field is required for Diabetes risk assessment." for field in missing}
            )

        dpf_val = data.get('dpf')
        alt_val = data.get('diabetes_pedigree_function')
        if alt_val is not None:
            data['dpf'] = alt_val
        elif dpf_val is None:
            data['dpf'] = 0.5
        data.pop('diabetes_pedigree_function', None)
        return data


class PredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prediction
        fields = '__all__'
        read_only_fields = ['id', 'created_at']
