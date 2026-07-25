from django.test import TestCase
from accounts.models import User

class UserModelTest(TestCase):
    def test_create_user(self):
        user = User.objects.create(username="testuser", email="test@example.com", full_name="Test User")
        self.assertEqual(user.username, "testuser")
