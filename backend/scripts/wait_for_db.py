import os
import sys
import time
from pathlib import Path

# Add backend directory to sys.path so config is importable
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', os.getenv('DJANGO_SETTINGS_MODULE', 'config.settings.production'))
django.setup()

from django.db import connections
from django.db.utils import OperationalError


def wait_for_db(timeout=60, interval=2):
    """
    Waits for Django's default database connection to become available.
    Supports both SQLite and PostgreSQL without hardcoded credentials.
    """
    db_conn = connections['default']
    engine = db_conn.settings_dict.get('ENGINE', 'unknown')
    vendor = db_conn.vendor or engine.split('.')[-1]

    print(f"==> Waiting for database connection (engine: {vendor})...")
    start_time = time.time()
    attempts = 0

    while time.time() - start_time < timeout:
        attempts += 1
        try:
            db_conn.ensure_connection()
            with db_conn.cursor() as cursor:
                cursor.execute("SELECT 1;")
            elapsed = round(time.time() - start_time, 2)
            print(f"==> Database connection successful! (vendor: {vendor}, elapsed: {elapsed}s, attempts: {attempts})")
            return True
        except OperationalError:
            elapsed = int(time.time() - start_time)
            print(f"    Database unavailable ({elapsed}s/{timeout}s)... retrying in {interval}s")
            time.sleep(interval)
        except Exception as e:
            elapsed = int(time.time() - start_time)
            print(f"    Database check encountered error ({elapsed}s/{timeout}s): {e}... retrying in {interval}s")
            time.sleep(interval)

    print(f"==> ERROR: Database connection timed out after {timeout} seconds.", file=sys.stderr)
    sys.exit(1)


if __name__ == "__main__":
    wait_for_db()
