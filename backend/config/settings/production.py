import os
from pathlib import Path
import dj_database_url
from .base import *

DEBUG = os.getenv('DEBUG', 'False').lower() in {'1', 'true', 'yes', 'on'}

# Allowed hosts for Render, Docker, and custom domains
allowed_hosts_env = os.getenv('ALLOWED_HOSTS', '')
if allowed_hosts_env.strip():
    ALLOWED_HOSTS = [host.strip() for host in allowed_hosts_env.split(',') if host.strip()]
else:
    ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'backend', 'frontend', '.onrender.com']

# Database: Use Render PostgreSQL when DATABASE_URL is provided, fallback to SQLite
database_url = os.getenv('DATABASE_URL')
if database_url and database_url.strip():
    DATABASES = {
        'default': dj_database_url.config(
            default=database_url.strip(),
            conn_max_age=600,
            ssl_require=True,
        )
    }
else:
    sqlite_path_env = os.getenv('SQLITE_DB_PATH')
    if sqlite_path_env:
        sqlite_path = Path(sqlite_path_env)
        sqlite_db_path = sqlite_path if sqlite_path.is_absolute() else BASE_DIR / sqlite_path
    else:
        sqlite_db_path = BASE_DIR / 'db.sqlite3'

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': sqlite_db_path,
        }
    }

# CORS Configuration (Strict for production)
cors_origins_env = os.getenv('CORS_ALLOWED_ORIGINS', '')
if cors_origins_env.strip():
    CORS_ALLOWED_ORIGINS = [origin.strip() for origin in cors_origins_env.split(',') if origin.strip()]
    CORS_ALLOW_ALL_ORIGINS = False
else:
    CORS_ALLOWED_ORIGINS = []
    CORS_ALLOW_ALL_ORIGINS = False

# CSRF Trusted Origins
csrf_origins_env = os.getenv('CSRF_TRUSTED_ORIGINS', '')
if csrf_origins_env.strip():
    CSRF_TRUSTED_ORIGINS = [origin.strip() for origin in csrf_origins_env.split(',') if origin.strip()]
else:
    CSRF_TRUSTED_ORIGINS = []

# Security headers for HTTPS in production
if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
