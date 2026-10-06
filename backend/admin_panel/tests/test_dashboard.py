from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from predictions.models import Prediction
from audit_logs.models import AuditLog

User = get_user_model()


class AdminDashboardApiTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.patient = User.objects.create_user(
            username='patient_user',
            email='patient@example.com',
            password='password123',
            role='PATIENT',
        )

        self.admin = User.objects.create_user(
            username='admin_user',
            email='admin@example.com',
            password='password123',
            role='ADMIN',
        )

        # Create test prediction
        Prediction.objects.create(
            user=self.patient,
            input_data={'age': 45},
            prediction_result='High Risk',
            probability=0.85,
            risk_level='HIGH',
        )

        # Create test audit log
        AuditLog.objects.create(
            user=self.admin,
            username='admin_user',
            action='LOGIN',
            status='SUCCESS',
            module='AUTH',
            description='Admin logged in',
        )

    def test_patient_access_forbidden(self):
        self.client.force_authenticate(user=self.patient)
        response = self.client.get('/api/admin-panel/dashboard/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_access_allowed(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get('/api/admin-panel/dashboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data
        self.assertIn('totals', data)
        self.assertIn('prediction_trend', data)
        self.assertIn('risk_distribution', data)
        self.assertIn('recent_activity', data)

        self.assertEqual(data['totals']['users'], 2)
        self.assertEqual(data['totals']['predictions'], 1)
        self.assertEqual(data['totals']['high_risk'], 1)
        self.assertEqual(data['totals']['medium_risk'], 0)
        self.assertEqual(data['totals']['low_risk'], 0)

        self.assertEqual(len(data['prediction_trend']), 30)
        self.assertEqual(len(data['recent_activity']), 1)
        self.assertEqual(data['recent_activity'][0]['username'], 'admin_user')
