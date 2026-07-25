#!/bin/bash
set -e

echo "Waiting for PostgreSQL database..."
python scripts/wait_for_db.py

echo "Applying Database Migrations..."
python manage.py migrate --noinput

echo "Collecting Static Files..."
python manage.py collectstatic --noinput

exec "$@"
