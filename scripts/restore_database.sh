#!/bin/bash
if [ ! -f "./backup_db.sqlite3" ]; then
    echo "Error: ./backup_db.sqlite3 not found!"
    exit 1
fi
echo "Restoring SQLite database to Docker container..."
docker cp ./backup_db.sqlite3 jeevansetu_backend:/app/data/db.sqlite3
echo "SQLite database restored successfully."
