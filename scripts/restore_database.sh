#!/bin/bash
echo "Restoring PostgreSQL database..."
cat backup.sql | docker exec -i jeevansetu_postgres psql -U jeevansetu_user -d jeevansetu_db
