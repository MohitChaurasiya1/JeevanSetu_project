#!/bin/bash
set -e

echo "==> Preparing local storage directories..."
mkdir -p /app/data /app/staticfiles /app/media

echo "==> Waiting for database connection..."
python scripts/wait_for_db.py

echo "==> Applying database migrations..."
python manage.py migrate --noinput

echo "==> Seeding initial reference data..."
python scripts/seed_initial_data.py

echo "==> Checking superuser creation..."
python scripts/create_superuser.py

echo "==> Collecting static files..."
python manage.py collectstatic --noinput

echo "==> Backend ready. Starting server..."
exec "$@"
