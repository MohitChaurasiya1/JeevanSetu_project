import os
import dj_database_url
from .base import *

DEBUG = True

# Development CORS - Allow local frontend
CORS_ALLOW_ALL_ORIGINS = True

# Development Database:
# If DATABASE_URL is set (e.g. in Docker or local PostgreSQL), use it.
# Otherwise, fallback gracefully to SQLite for instant local development.
DATABASE_URL = os.getenv('DATABASE_URL')
if DATABASE_URL:
    DATABASES = {
        'default': dj_database_url.parse(DATABASE_URL, conn_max_age=600)
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Development email notification recipient from environment
ADMIN_NOTIFICATION_EMAIL = os.getenv('ADMIN_NOTIFICATION_EMAIL', '')