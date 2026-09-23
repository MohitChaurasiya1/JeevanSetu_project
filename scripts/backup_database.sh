#!/bin/bash
# Backup PostgreSQL database from Docker container
BACKUP_FILE="./backup_jeevansetu_$(date +%Y%m%d_%H%M%S).sql"

echo "Backing up PostgreSQL database from Docker container 'jeevansetu_db'..."
docker exec -t jeevansetu_db pg_dump -U jeevansetu_dev -d jeevansetu > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "PostgreSQL database backup successfully created: $BACKUP_FILE"
else
    echo "Error: Failed to backup PostgreSQL database."
    exit 1
fi
