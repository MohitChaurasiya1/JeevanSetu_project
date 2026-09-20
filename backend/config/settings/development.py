import os
from pathlib import Path
from .base import *

DEBUG = True

# Development CORS - Allow local frontend
CORS_ALLOW_ALL_ORIGINS = True

# Local Development Database: Always SQLite using existing project db.sqlite3
sqlite_path_env = os.getenv('SQLITE_DB_PATH')
if sqlite_path_env:
    sqlite_path = Path(sqlite_path_env)
    SQLITE_DB_PATH = sqlite_path if sqlite_path.is_absolute() else BASE_DIR / sqlite_path
else:
    SQLITE_DB_PATH = BASE_DIR / 'db.sqlite3'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': SQLITE_DB_PATH,
    }
}

# Development email notification recipient from environment
ADMIN_NOTIFICATION_EMAIL = os.getenv('ADMIN_NOTIFICATION_EMAIL', '')