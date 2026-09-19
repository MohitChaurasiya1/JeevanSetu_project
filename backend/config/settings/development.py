from .base import *

# SQLite is configured in base.py
CORS_ALLOW_ALL_ORIGINS = True

# Development email notification recipient
ADMIN_NOTIFICATION_EMAIL = os.getenv('ADMIN_NOTIFICATION_EMAIL', 'mohitkumarchaurasiya2005@gmail.com')