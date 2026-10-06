from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()


class UserViewSetPermissionsTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.patient = User.objects.create_user(
            username='patient_test',
            email='patient@example.com',
            password='password123',
            role='PATIENT',
            full_name='Patient Test',
        )

        self.admin = User.objects.create_user(
            username='admin_test',
            email='admin@example.com',
            password='password123',
            role='ADMIN',
            full_name='Admin Test',
        )

    def test_patient_cannot_list_users(self):
        self.client.force_authenticate(user=self.patient)
        response = self.client.get('/api/auth/users/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_list_users(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get('/api/auth/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should be paginated results
        self.assertIn('results', response.data)

    def test_patient_can_retrieve_own_record(self):
        self.client.force_authenticate(user=self.patient)
        response = self.client.get(f'/api/auth/users/{self.patient.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'patient_test')

    def test_patient_cannot_retrieve_other_user_record(self):
        self.client.force_authenticate(user=self.patient)
        response = self.client.get(f'/api/auth/users/{self.admin.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_admin_user_filtering(self):
        self.client.force_authenticate(user=self.admin)

        # Filter by search
        response = self.client.get('/api/auth/users/?search=Patient')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['username'], 'patient_test')

        # Filter by role
        response = self.client.get('/api/auth/users/?role=ADMIN')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['username'], 'admin_test')

        # Filter by is_active
        response = self.client.get('/api/auth/users/?is_active=true')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
