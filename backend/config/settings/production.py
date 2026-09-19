import os
from pathlib import Path
from .base import *

DEBUG = os.getenv('DEBUG', 'False') == 'True'

# Allowed hosts for Render, Docker, and custom domains
allowed_hosts_env = os.getenv('ALLOWED_HOSTS', '')
if allowed_hosts_env.strip():
    ALLOWED_HOSTS = [host.strip() for host in allowed_hosts_env.split(',') if host.strip()]
else:
    ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'backend', 'frontend', '.onrender.com', '*']

# Database: SQLite ONLY (persistent db.sqlite3)
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

# CORS Configuration
cors_origins_env = os.getenv('CORS_ALLOWED_ORIGINS', '')
if cors_origins_env.strip() and cors_origins_env.strip() != '*':
    CORS_ALLOWED_ORIGINS = [origin.strip() for origin in cors_origins_env.split(',') if origin.strip()]
    CORS_ALLOW_ALL_ORIGINS = False
else:
    CORS_ALLOW_ALL_ORIGINS = True

# CSRF Trusted Origins
csrf_origins_env = os.getenv('CSRF_TRUSTED_ORIGINS', 'https://*.onrender.com,https://*.netlify.app,http://localhost,http://localhost:5173,http://localhost:80')
CSRF_TRUSTED_ORIGINS = [origin.strip() for origin in csrf_origins_env.split(',') if origin.strip()]

# Security headers for HTTPS in production
if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
