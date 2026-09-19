# JeevanSetu – Cloud-Based Disease Prediction System Using Machine Learning

JeevanSetu is a cloud-based disease prediction platform designed to assess patient health risks using machine learning algorithms.

## Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router DOM, Axios, Framer Motion, Recharts, Nginx
- **Backend**: Python, Django, Django REST Framework, Simple JWT, Gunicorn, WhiteNoise
- **Database**: SQLite (persistent `db.sqlite3` in Docker volume `sqlite_data`)
- **Machine Learning**: pandas, NumPy, scikit-learn, Joblib, Random Forest Classifier
- **DevOps**: Docker, Docker Compose, Git

## Folder Structure Overview

```text
JeevanSetu/
├── frontend/             # React SPA with Tailwind CSS & Nginx
├── backend/              # Django REST Framework API & ML Engine
├── machine_learning/     # Data pipelines, training scripts & Jupyter notebooks
├── docs/                 # System design & API documentation
├── scripts/              # Setup, dev, and backup utility scripts
├── docker-compose.yml    # Container deployment configuration (Frontend + Backend + SQLite)
├── .env.example          # Template environment variables
├── .gitignore
├── README.md
└── LICENSE
```

## Quickstart with Docker Compose

To start the entire application (React/Nginx frontend + Django/Gunicorn backend + persistent SQLite):

```bash
docker compose up --build -d
docker compose ps
```

- **Frontend Web App**: http://localhost (or http://localhost:5173)
- **Django API Base**: http://localhost:8000/api
- **Django Admin Portal**: http://localhost:8000/admin

## Running Locally Without Docker

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
python -m venv venv
# On Windows: venv\Scripts\activate
# On Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python scripts/seed_initial_data.py
python manage.py runserver 127.0.0.1:8000
```

## Key API Endpoints
- `/api/auth/` - Authentication & Token management (Register, Login, Me, Token Refresh)
- `/api/diseases/` - Disease directory & details
- `/api/symptoms/` - Symptom catalog
- `/api/predictions/` - Disease risk prediction engine & user history
- `/api/contact/` - Public visitor inquiries & notifications
- `/api/feedback/` - User feedback submission
- `/api/admin-panel/` - Admin overview & metrics
- `/api/audit-logs/` - Activity audit trail
- `/api/ml-models/` - Model version management
