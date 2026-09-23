# JeevanSetu Backend API

Django REST Framework backend providing RESTful endpoints, JWT authentication, PostgreSQL database, and machine learning inference.

## Quickstart (Local)
```bash
python -m venv venv
# Activate virtual environment
pip install -r requirements.txt

# Start PostgreSQL service via Docker (or ensure local PostgreSQL is running)
docker compose up db -d

python manage.py migrate
python scripts/seed_initial_data.py
python scripts/create_superuser.py
python manage.py runserver 127.0.0.1:8000
```

## Docker Deployment
```bash
# Starts backend, frontend, and PostgreSQL database
docker compose up -d
```
