from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from feedback.models import ContactMessage

User = get_user_model()


class ContactMessageAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Regular Patient user
        self.patient_user = User.objects.create_user(
            username='patient_test',
            email='patient_test@example.com',
            password='testpassword123',
            full_name='Test Patient',
            role='PATIENT',
        )

        # Admin user
        self.admin_user = User.objects.create_user(
            username='admin_test',
            email='admin_test@example.com',
            password='testpassword123',
            full_name='Test Admin',
            role='ADMIN',
            is_staff=True,
        )

        self.valid_payload = {
            'full_name': 'John Doe',
            'email': 'john@example.com',
            'phone': '+91 9876543210',
            'message': 'Hello, I have a question about JeevanSetu disease predictions.',
        }

    def test_anonymous_user_can_submit_contact_message(self):
        """Anonymous visitors can successfully submit a contact message."""
        response = self.client.post('/api/contact/', self.valid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual(ContactMessage.objects.count(), 1)
        contact = ContactMessage.objects.first()
        self.assertEqual(contact.full_name, 'John Doe')
        self.assertEqual(contact.email, 'john@example.com')
        self.assertEqual(contact.phone, '+91 9876543210')
        self.assertEqual(contact.status, 'NEW')
        self.assertIsNone(contact.admin_response)

    def test_submission_without_phone_succeeds(self):
        """Phone number is optional."""
        payload = {
            'full_name': 'Jane Doe',
            'email': 'jane@example.com',
            'message': 'This is another message that is at least 10 characters long.',
        }
        response = self.client.post('/api/contact/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ContactMessage.objects.count(), 1)

    def test_submission_invalid_email_fails(self):
        """Invalid email returns 400 Bad Request."""
        payload = self.valid_payload.copy()
        payload['email'] = 'not-a-valid-email'
        response = self.client.post('/api/contact/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_submission_missing_name_fails(self):
        """Missing or too short full_name returns 400."""
        payload = self.valid_payload.copy()
        payload['full_name'] = 'A'
        response = self.client.post('/api/contact/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('full_name', response.data)

    def test_submission_missing_message_fails(self):
        """Missing or too short message returns 400."""
        payload = self.valid_payload.copy()
        payload['message'] = 'Too short'
        response = self.client.post('/api/contact/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('message', response.data)

    def test_submission_invalid_phone_fails(self):
        """Invalid phone format returns 400."""
        payload = self.valid_payload.copy()
        payload['phone'] = '123'
        response = self.client.post('/api/contact/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('phone', response.data)

    def test_submission_tamper_read_only_fields_ignored(self):
        """Public submissions cannot manipulate status or admin_response."""
        payload = self.valid_payload.copy()
        payload['status'] = 'RESOLVED'
        payload['admin_response'] = 'Injected response'
        response = self.client.post('/api/contact/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        contact = ContactMessage.objects.first()
        self.assertEqual(contact.status, 'NEW')
        self.assertIsNone(contact.admin_response)

    def test_anonymous_user_cannot_read_contact_messages(self):
        """Anonymous visitors cannot list contact messages."""
        response = self.client.get('/api/contact/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_regular_patient_user_cannot_read_contact_messages(self):
        """Non-admin users cannot list contact messages."""
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get('/api/contact/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_user_can_list_contact_messages(self):
        """Admin users can list contact messages."""
        ContactMessage.objects.create(
            full_name='User One',
            email='user1@example.com',
            message='Message 1 with sufficient length',
            status='NEW',
        )
        ContactMessage.objects.create(
            full_name='User Two',
            email='user2@example.com',
            message='Message 2 with sufficient length',
            status='READ',
        )

        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/contact/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check pagination or results
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 2)

    def test_admin_can_filter_by_status(self):
        """Admin can filter contact messages by status."""
        ContactMessage.objects.create(
            full_name='User New',
            email='new@example.com',
            message='This message is new and long enough',
            status='NEW',
        )
        ContactMessage.objects.create(
            full_name='User Resolved',
            email='resolved@example.com',
            message='This message is resolved and long enough',
            status='RESOLVED',
        )

        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/contact/?status=NEW')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['status'], 'NEW')

    def test_admin_can_retrieve_single_message(self):
        """Admin can retrieve a single contact message by ID."""
        contact = ContactMessage.objects.create(
            full_name='User Detail',
            email='detail@example.com',
            phone='9876543210',
            message='Detailed inquiry about health services.',
            status='NEW',
        )

        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(f'/api/contact/{contact.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['full_name'], 'User Detail')
        self.assertEqual(response.data['email'], 'detail@example.com')

    def test_admin_can_update_status_and_response(self):
        """Admin can update status and admin_response."""
        contact = ContactMessage.objects.create(
            full_name='User Update',
            email='update@example.com',
            message='Message waiting for reply from admin.',
            status='NEW',
        )

        self.client.force_authenticate(user=self.admin_user)
        patch_data = {
            'status': 'RESOLVED',
            'admin_response': 'We have reviewed and resolved your inquiry.',
            'send_email': False,  # disable actual email in test
        }
        response = self.client.patch(f'/api/contact/{contact.id}/', patch_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        contact.refresh_from_db()
        self.assertEqual(contact.status, 'RESOLVED')
        self.assertEqual(contact.admin_response, 'We have reviewed and resolved your inquiry.')
