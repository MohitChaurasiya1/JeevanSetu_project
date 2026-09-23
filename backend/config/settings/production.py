import os
import dj_database_url
from .base import *

DEBUG = os.getenv('DEBUG', 'False').lower() in {'1', 'true', 'yes', 'on'}

# Allowed hosts for Render, Docker, and custom domains
allowed_hosts_env = os.getenv('ALLOWED_HOSTS', '')
if allowed_hosts_env.strip():
    ALLOWED_HOSTS = [host.strip() for host in allowed_hosts_env.split(',') if host.strip()]
else:
    ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'backend', 'frontend', '.onrender.com']

# Database: PostgreSQL only (via DATABASE_URL environment variable)
# Render automatically provides DATABASE_URL when a PostgreSQL database is attached.
db_ssl = os.getenv('DB_SSL_REQUIRE', 'True').lower() in {'1', 'true', 'yes', 'on'}
DATABASES = {
    'default': dj_database_url.config(
        default=os.getenv('DATABASE_URL', ''),
        conn_max_age=600,
        ssl_require=db_ssl,
    )
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
