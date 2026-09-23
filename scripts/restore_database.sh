#!/bin/bash
# Restore PostgreSQL database to Docker container
BACKUP_FILE="${1:-./backup_jeevansetu.sql}"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file '$BACKUP_FILE' not found!"
    echo "Usage: ./restore_database.sh [path_to_backup.sql]"
    exit 1
fi

echo "Restoring PostgreSQL database from '$BACKUP_FILE' to Docker container 'jeevansetu_db'..."
cat "$BACKUP_FILE" | docker exec -i jeevansetu_db psql -U jeevansetu_dev -d jeevansetu

if [ $? -eq 0 ]; then
    echo "PostgreSQL database restored successfully."
else
    echo "Error: Failed to restore PostgreSQL database."
    exit 1
fi
