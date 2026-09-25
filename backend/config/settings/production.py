
import os

import dj_database_url

from .base import *


# ============================================================
# Production / Debug
# ============================================================

DEBUG = os.getenv("DEBUG", "False").lower() in {
    "1",
    "true",
    "yes",
    "on",
}


# ============================================================
# Allowed Hosts
# ============================================================

allowed_hosts_env = os.getenv("ALLOWED_HOSTS", "").strip()

if allowed_hosts_env:
    ALLOWED_HOSTS = [
        host.strip()
        for host in allowed_hosts_env.split(",")
        if host.strip()
    ]
else:
    ALLOWED_HOSTS = [
        "localhost",
        "127.0.0.1",
        "backend",
        "frontend",
        ".onrender.com",
    ]


# ============================================================
# Database
# ============================================================

db_ssl = os.getenv("DB_SSL_REQUIRE", "True").lower() in {
    "1",
    "true",
    "yes",
    "on",
}

DATABASES = {
    "default": dj_database_url.config(
        default=os.getenv("DATABASE_URL", ""),
        conn_max_age=600,
        ssl_require=db_ssl,
    )
}


# ============================================================
# CORS
# ============================================================

# Netlify production frontend
CORS_ALLOWED_ORIGINS = [
    "https://jeevansetu-web.netlify.app",
]

CORS_ALLOW_ALL_ORIGINS = False


# ============================================================
# CSRF
# ============================================================

CSRF_TRUSTED_ORIGINS = [
    "https://jeevansetu-web.netlify.app",
]


# ============================================================
# Security
# ============================================================

if not DEBUG:
    SECURE_PROXY_SSL_HEADER = (
        "HTTP_X_FORWARDED_PROTO",
        "https",
    )

    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True


# ============================================================
# Email Configuration
# ============================================================

EMAIL_BACKEND = os.getenv(
    "EMAIL_BACKEND",
    "django.core.mail.backends.smtp.EmailBackend",
)

EMAIL_HOST = os.getenv(
    "EMAIL_HOST",
    "smtp.gmail.com",
)

EMAIL_PORT = int(
    os.getenv("EMAIL_PORT", "587")
)

EMAIL_USE_TLS = os.getenv(
    "EMAIL_USE_TLS",
    "True",
).lower() in {
    "1",
    "true",
    "yes",
    "on",
}

EMAIL_HOST_USER = os.getenv(
    "EMAIL_HOST_USER",
    "",
)

EMAIL_HOST_PASSWORD = os.getenv(
    "EMAIL_HOST_PASSWORD",
    "",
)

DEFAULT_FROM_EMAIL = os.getenv(
    "DEFAULT_FROM_EMAIL",
    "JeevanSetu <noreply@jeevansetu.com>",
)

ADMIN_NOTIFICATION_EMAIL = os.getenv(
    "ADMIN_NOTIFICATION_EMAIL",
    "",
)

