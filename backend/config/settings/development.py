from .base import *

DEBUG = True

CORS_ALLOW_ALL_ORIGINS = True

if os.getenv('USE_SQLITE', 'True').lower() in {'1', 'true', 'yes', 'on'}:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('POSTGRES_DB', 'jeevansetu_db'),
            'USER': os.getenv('POSTGRES_USER', 'jeevansetu_user'),
            'PASSWORD': os.getenv('POSTGRES_PASSWORD', 'jeevansetu_password'),
            'HOST': os.getenv('POSTGRES_HOST', 'postgres'),
            'PORT': os.getenv('POSTGRES_PORT', '5432'),
        }
    }

# Development email notification recipient
ADMIN_NOTIFICATION_EMAIL = os.getenv('ADMIN_NOTIFICATION_EMAIL', 'mohitkumarchaurasiya2005@gmail.com')