from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from diseases.models import Disease
from predictions.models import Prediction

User = get_user_model()

class PredictionApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testpatient',
            email='patient@example.com',
            password='password123',
            role='PATIENT'
        )
        self.diabetes_disease = Disease.objects.create(
            name='Diabetes',
            description='Chronic metabolic condition'
        )
        self.heart_disease = Disease.objects.create(
            name='Heart Disease',
            description='Cardiovascular condition'
        )

    def test_predict_heart_disease_high_risk(self):
        """Test Heart Disease prediction for high-risk clinical inputs."""
        payload = {
            'disease': 'Heart Disease',
            'chest_pain': 1.0,
            'shortness_of_breath': 1.0,
            'fatigue': 1.0,
            'palpitations': 1.0,
            'dizziness': 1.0,
            'swelling': 1.0,
            'pain_arms_jaw_back': 1.0,
            'cold_sweats_nausea': 1.0,
            'high_bp': 1.0,
            'high_cholesterol': 1.0,
            'diabetes': 1.0,
            'smoking': 1.0,
            'obesity': 1.0,
            'sedentary_lifestyle': 1.0,
            'family_history': 1.0,
            'chronic_stress': 1.0,
            'gender': 1.0,
            'age': 65.0
        }
        response = self.client.post('/api/predictions/predict/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['prediction'], 1)
        self.assertEqual(response.data['risk_level'], 'HIGH')
        self.assertEqual(response.data['disease'], 'Heart Disease')
        self.assertGreater(response.data['probability'], 0.65)
        self.assertIn('Chest Pain', response.data['contributing_factors'])
        self.assertTrue(len(response.data['recommendations']) > 0)

    def test_predict_heart_disease_low_risk(self):
        """Test Heart Disease prediction for healthy asymptomatic inputs."""
        payload = {
            'disease': 'Heart Disease',
            'chest_pain': 0.0,
            'shortness_of_breath': 0.0,
            'fatigue': 0.0,
            'palpitations': 0.0,
            'dizziness': 0.0,
            'swelling': 0.0,
            'pain_arms_jaw_back': 0.0,
            'cold_sweats_nausea': 0.0,
            'high_bp': 0.0,
            'high_cholesterol': 0.0,
            'diabetes': 0.0,
            'smoking': 0.0,
            'obesity': 0.0,
            'sedentary_lifestyle': 0.0,
            'family_history': 0.0,
            'chronic_stress': 0.0,
            'gender': 0.0,
            'age': 25.0
        }
        response = self.client.post('/api/predictions/predict/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['prediction'], 0)
        self.assertEqual(response.data['risk_level'], 'LOW')
        self.assertEqual(response.data['disease'], 'Heart Disease')
        self.assertLess(response.data['probability'], 0.35)

    def test_predict_diabetes_success(self):
        """Test Diabetes prediction with valid clinical parameters."""
        payload = {
            'disease': 'Diabetes',
            'pregnancies': 1.0,
            'glucose': 180.0,
            'blood_pressure': 85.0,
            'skin_thickness': 30.0,
            'insulin': 150.0,
            'bmi': 33.0,
            'dpf': 0.7,
            'age': 45.0
        }
        response = self.client.post('/api/predictions/predict/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['disease'], 'Diabetes')
        self.assertIn('prediction', response.data)
        self.assertIn('probability', response.data)

    def test_predict_diabetes_missing_required_field(self):
        """Test Diabetes validation rejects requests missing required biomarkers."""
        payload = {
            'disease': 'Diabetes',
            'glucose': 120.0
            # missing blood_pressure, skin_thickness, insulin, bmi
        }
        response = self.client.post('/api/predictions/predict/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('blood_pressure', response.data)

    def test_authenticated_prediction_saves_history(self):
        """Test that authenticated users have predictions persisted to database."""
        self.client.force_authenticate(user=self.user)
        payload = {
            'disease': 'Heart Disease',
            'chest_pain': 1.0,
            'high_bp': 1.0,
            'age': 60.0
        }
        response = self.client.post('/api/predictions/predict/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('prediction_id', response.data)

        # Verify DB record
        pred = Prediction.objects.get(id=response.data['prediction_id'])
        self.assertEqual(pred.user, self.user)
        self.assertEqual(pred.disease, self.heart_disease)
        self.assertEqual(pred.model_version, '2.0.0')
