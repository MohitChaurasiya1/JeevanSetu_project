# System Architecture

- Frontend: React Single Page Application (Vite + Tailwind CSS + Nginx)
- Backend API: Django REST Framework (Python + Gunicorn + WhiteNoise)
- Database: SQLite (Persistent `db.sqlite3` in Docker volume `sqlite_data`)
- ML Engine: Scikit-Learn Random Forest Pipeline