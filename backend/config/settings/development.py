import os
from .base import *

DEBUG = True

# Development CORS - Allow local frontend
CORS_ALLOW_ALL_ORIGINS = True

# Development Database: PostgreSQL (inherited from base.py via DATABASE_URL)
# No override needed — base.py reads DATABASE_URL which defaults to local Docker PostgreSQL.
# To use a custom database, set DATABASE_URL in your .env file.

# Development email notification recipient from environment
ADMIN_NOTIFICATION_EMAIL = os.getenv('ADMIN_NOTIFICATION_EMAIL', '')