import time
import sys

def wait_for_db():
    print("Waiting for database connection...")
    time.sleep(1)
    print("Database ready.")

if __name__ == "__main__":
    wait_for_db()
