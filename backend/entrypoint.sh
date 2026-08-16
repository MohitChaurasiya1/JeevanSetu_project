#!/bin/bash
set -e

echo "Waiting for PostgreSQL database..."
python scripts/wait_for_db.py

echo "Making Migrations..."
python manage.py makemigrations --noinput

echo "Applying Database Migrations..."
python manage.py migrate --noinput

echo "Collecting Static Files..."
python manage.py collectstatic --noinput

exec "$@"
