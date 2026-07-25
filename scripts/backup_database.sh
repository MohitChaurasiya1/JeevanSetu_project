#!/bin/bash
echo "Backing up PostgreSQL database..."
docker exec -t jeevansetu_postgres pg_dump -U jeevansetu_user jeevansetu_db > backup.sql
