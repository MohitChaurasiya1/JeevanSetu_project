from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from predictions.models import Prediction
from diseases.models import Disease

User = get_user_model()


class AdminPredictionApiTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.patient = User.objects.create_user(
            username='patient_one',
            email='patient1@example.com',
            password='password123',
            role='PATIENT',
            full_name='Patient One',
        )

        self.admin = User.objects.create_user(
            username='admin_one',
            email='admin1@example.com',
            password='password123',
            role='ADMIN',
            full_name='Admin One',
        )

        self.disease = Disease.objects.create(
            name='Diabetes Mellitus',
            description='A chronic metabolic disease',
        )

        self.pred1 = Prediction.objects.create(
            user=self.patient,
            disease=self.disease,
            input_data={'glucose': 140, 'bmi': 30.5},
            prediction_result='High Risk of Diabetes',
            probability=0.88,
            risk_level='HIGH',
            model_version='1.0.0',
        )

        self.pred2 = Prediction.objects.create(
            user=self.patient,
            disease=self.disease,
            input_data={'glucose': 90, 'bmi': 22.0},
            prediction_result='Low Risk',
            probability=0.12,
            risk_level='LOW',
            model_version='1.0.0',
        )

    def test_patient_access_forbidden(self):
        self.client.force_authenticate(user=self.patient)
        response = self.client.get('/api/admin-panel/predictions/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_list_predictions(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get('/api/admin-panel/predictions/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertEqual(response.data['count'], 2)

    def test_admin_filter_risk_level(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get('/api/admin-panel/predictions/?risk_level=HIGH')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['risk_level'], 'HIGH')

    def test_admin_filter_search(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get('/api/admin-panel/predictions/?search=patient1')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

    def test_admin_retrieve_prediction_detail(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(f'/api/admin-panel/predictions/{self.pred1.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['probability'], 0.88)
        self.assertIn('glucose', response.data['input_data'])

    def test_admin_delete_prediction(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(f'/api/admin-panel/predictions/{self.pred1.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Prediction.objects.filter(id=self.pred1.id).exists())
