#!/bin/bash
echo "Backing up SQLite database from Docker container..."
docker cp jeevansetu_backend:/app/data/db.sqlite3 ./backup_db.sqlite3
echo "SQLite database backup saved to ./backup_db.sqlite3"
