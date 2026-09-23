import os
import sys
from pathlib import Path

# Add backend directory to sys.path so config is importable
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', os.getenv('DJANGO_SETTINGS_MODULE', 'config.settings.development'))
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

email = os.getenv('DJANGO_SUPERUSER_EMAIL', '').strip()
password = os.getenv('DJANGO_SUPERUSER_PASSWORD', '').strip()
username = os.getenv('DJANGO_SUPERUSER_USERNAME', '').strip()
if not username and email:
    username = email.split('@')[0]
full_name = os.getenv('DJANGO_SUPERUSER_FULL_NAME', 'Admin User').strip()

if email and password and username:
    if not User.objects.filter(email=email).exists() and not User.objects.filter(username=username).exists():
        user = User.objects.create_superuser(
            username=username,
            email=email,
            password=password,
            full_name=full_name,
            role='SUPER_ADMIN',
            is_staff=True,
            is_superuser=True,
            is_email_verified=True,
        )
        print(f"Superuser '{username}' ({email}) created successfully.")
    else:
        print(f"Superuser '{username}' / '{email}' already exists. Skipping creation.")
else:
    print("DJANGO_SUPERUSER_EMAIL / DJANGO_SUPERUSER_PASSWORD not provided. Skipping auto superuser creation.")
