# JeevanSetu – Cloud-Based Disease Prediction System Using Machine Learning

JeevanSetu is a cloud-based disease prediction platform designed to assess patient health risks using machine learning algorithms.

## Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router DOM, Axios, React Hook Form, Framer Motion, Recharts
- **Backend**: Python, Django, Django REST Framework, Simple JWT, PostgreSQL
- **Machine Learning**: pandas, NumPy, scikit-learn, Joblib, Random Forest Classifier
- **DevOps**: Docker, Docker Compose, Git

## Folder Structure Overview

```text
JeevanSetu/
├── frontend/             # React SPA with Tailwind CSS
├── backend/              # Django REST Framework API & ML Engine
├── machine_learning/     # Data pipelines, training scripts & Jupyter notebooks
├── docs/                 # System design & API documentation
├── scripts/              # Setup, dev, and backup utility scripts
├── docker-compose.yml    # Container deployment configuration
├── .env.example          # Template environment variables
├── .gitignore
├── README.md
└── LICENSE
```

## Quickstart Setup Commands

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL (v14+)
- Docker & Docker Compose (Optional)

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
python manage.py runserver
```

### Machine Learning Workspace Setup
```bash
cd machine_learning
pip install -r requirements.txt
jupyter notebook
```

### Docker Quickstart
```bash
docker-compose up --build
```

## Development URLs
- Frontend UI: http://localhost:5173
- Django API Base: http://localhost:8000/api
- Django Admin Portal: http://localhost:8000/admin

## Key API Endpoints
- `/api/auth/` - Authentication & Token management
- `/api/diseases/` - Disease directory & details
- `/api/symptoms/` - Symptom catalog
- `/api/predictions/` - Disease risk prediction engine
- `/api/feedback/` - User feedback submission
- `/api/admin-panel/` - Admin overview & OTP verification
- `/api/audit-logs/` - Activity audit trail
- `/api/ml-models/` - Model version management

## Future Roadmap
1. Complete ML model training with validated clinical datasets.
2. Integrate real-time notification service (email / SMS OTP).
3. Connect disease prediction models with interactive dynamic frontend components.
