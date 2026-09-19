# JeevanSetu Backend API

Django REST Framework backend providing RESTful endpoints, JWT authentication, persistent SQLite database, and machine learning inference.

## Quickstart (Local)
```bash
python -m venv venv
# Activate virtual environment
pip install -r requirements.txt
python manage.py migrate
python scripts/seed_initial_data.py
python manage.py runserver 127.0.0.1:8000
```

## Docker Deployment
```bash
# Starts backend with Gunicorn and persistent SQLite volume
docker compose up -d
```
