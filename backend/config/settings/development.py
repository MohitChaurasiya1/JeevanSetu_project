from .base import *

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

CORS_ALLOW_ALL_ORIGINS = True