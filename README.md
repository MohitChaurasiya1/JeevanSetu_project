# 🏥 JeevanSetu – Cloud-Based Disease Prediction System Using Machine Learning

[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Django](https://img.shields.io/badge/Backend-Django%20%7C%20DRF-092E20?logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Machine Learning](https://img.shields.io/badge/ML-Scikit--Learn-F7931E?logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Docker](https://img.shields.io/badge/Container-Docker%20Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**JeevanSetu** is an intelligent, cloud-based healthcare platform designed to deliver rapid, accurate, and explainable disease risk predictions using machine learning algorithms. It empowers patients and clinicians with clinical risk stratification, AI symptom analysis, printable PDF health assessments, and real-time medical insights.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Directory Structure](#-directory-structure)
- [Environment Configuration](#-environment-configuration)
- [How to Run the Website](#-how-to-run-the-website)
  - [Mode 1: Docker Compose Mode (Automated / Recommended)](#mode-1-docker-compose-mode-containerized--automated)
  - [Mode 2: Local Manual Development Mode (Native / Without Docker)](#mode-2-local-manual-development-mode-native--without-docker)
- [One-Click Utility Scripts](#-one-click-utility-scripts)
- [Default Admin Credentials](#-default-admin-credentials)
- [Key API Endpoints](#-key-api-endpoints)
- [Troubleshooting & FAQ](#-troubleshooting--faq)
- [License](#-license)

---

## ✨ Features

- 🔬 **Multi-Disease AI Assessment**: Risk evaluation for Diabetes, Cardiovascular disease, Kidney disorders, and more.
- 📊 **Interactive Risk Visualizations**: Dynamic radar charts, probability gauges, and metric breakdowns.
- 📄 **Exportable Health Reports**: Downloadable clinical summary PDFs with diagnostic disclaimers.
- 🔐 **Secure JWT Authentication**: Role-based access control (Patients, Doctors, Super Administrators).
- 🛡️ **Audit Logging & Activity Tracking**: Enterprise-grade compliance logging.
- 📱 **Fully Responsive UI**: Modern, accessible interface optimized for mobile, tablet, and desktop viewports.

---

## 🛠️ Tech Stack

| Domain | Technologies & Libraries |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Recharts, Axios, React Router DOM, React Icons |
| **Backend** | Python 3.10+, Django 5.x, Django REST Framework (DRF), Simple JWT, Gunicorn, WhiteNoise |
| **Machine Learning** | scikit-learn, Joblib, pandas, NumPy (Random Forest, Gradient Boosting, Ensembles) |
| **Database** | PostgreSQL (`DATABASE_URL` with persistent Docker volume support) |
| **DevOps & Tools** | Docker, Docker Compose, Nginx, Git, PowerShell / Bash Automation |

---

## 📂 Directory Structure

```text
JeevanSetu_project/
├── frontend/                # React SPA (Vite + Tailwind CSS + Axios)
│   ├── src/                 # Components, pages, context, and API services
│   ├── public/              # Static assets & icons
│   ├── Dockerfile           # Multi-stage production Nginx container
│   └── package.json         # Frontend dependencies
├── backend/                 # Django REST Framework API & ML Engine
│   ├── accounts/            # User models, authentication & JWT
│   ├── predictions/         # ML inference & disease prediction logic
│   ├── diseases/            # Disease and symptom catalog models
│   ├── ml_engine/           # Pre-trained models, encoders, and pipelines
│   ├── feedback/            # User reviews & feedback
│   ├── audit_logs/          # Compliance & audit trail logs
│   ├── scripts/             # Data seeding & superuser creation utilities
│   ├── Dockerfile           # Python Gunicorn container
│   └── requirements.txt     # Python dependencies
├── machine_learning/        # Training datasets, exploration notebooks, and model exports
├── scripts/                 # Cross-platform setup, start, stop, and backup scripts
├── docker-compose.yml       # Production/development container orchestration
├── .env.example             # Master environment configuration template
├── README.md                # Project documentation
└── LICENSE                  # MIT License
```

---

## ⚙️ Environment Configuration

Before running the application in either mode, prepare your environment configuration:

1. Copy the example environment file to `.env`:
   ```bash
   cp .env.example .env
   ```
   *(On Windows PowerShell: `Copy-Item .env.example .env`)*

2. Review or update `.env` variables if needed:
   ```env
   # Core Django Settings
   DJANGO_SECRET_KEY=your-secure-secret-key
   DEBUG=True
   DJANGO_SETTINGS_MODULE=config.settings.development
   ALLOWED_HOSTS=localhost,127.0.0.1,backend,frontend

   # Database
   DATABASE_URL=postgres://jeevansetu_dev:jeevansetu_pass@localhost:5432/jeevansetu

   # Frontend API Base URL
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_APP_NAME=JeevanSetu
   ```

---

## 🚀 How to Run the Website

You can run JeevanSetu using either of the following two modes:

---

### Mode 1: Docker Compose Mode (Containerized / Automated)

> **Best for:** Instant setup, testing production-like environments, or running with zero manual dependency installations.

#### Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop/) and [Docker Compose](https://docs.docker.com/compose/) installed and running.

#### Step 1: Start All Services
Open a terminal in the project root directory and run:

```bash
docker compose up --build
```
*(Add the `-d` flag to run in detached/background mode: `docker compose up --build -d`)*

#### Step 2: Access the Application
Once containers are built and healthy:
- 🌐 **Frontend Application**: [http://localhost:5173](http://localhost:5173) or [http://localhost](http://localhost)
- 🔌 **Backend REST API**: [http://localhost:8000/api](http://localhost:8000/api)
- 🛡️ **Django Admin Portal**: [http://localhost:8000/admin](http://localhost:8000/admin)

#### Step 3: Stop Docker Services
To stop and clean up containers:
```bash
docker compose down
```

---

### Mode 2: Local Manual Development Mode (Native / Without Docker)

> **Best for:** Active feature development, step-by-step debugging, live code reloading, and frontend styling tweaks.

#### Prerequisites
- **Python**: Version `3.10` or higher ([python.org](https://www.python.org/))
- **Node.js**: Version `18.x` or higher and **npm** ([nodejs.org](https://nodejs.org/))

---

#### 🔹 Part A: Start the Backend Server (Terminal 1)

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate a Python virtual environment**:
   - **On Windows (PowerShell)**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - **On Windows (CMD)**:
     ```cmd
     python -m venv venv
     venv\Scripts\activate.bat
     ```
   - **On macOS / Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Apply database migrations**:
   ```bash
   python manage.py migrate
   ```

5. **Seed initial diseases & symptoms catalog**:
   ```bash
   python scripts/seed_initial_data.py
   ```

6. **Create an Admin / Superuser** (Choose one option):
   - *Option 1 (Automated default)*:
     ```bash
     python scripts/create_superuser.py
     ```
   - *Option 2 (Interactive custom prompt)*:
     ```bash
     python manage.py createsuperuser
     ```

7. **Start the Django development server**:
   ```bash
   python manage.py runserver 127.0.0.1:8000
   ```
   > 🟢 Backend will be running at: **`http://127.0.0.1:8000`** (API at `http://127.0.0.1:8000/api`)

---

#### 🔹 Part B: Start the Frontend Application (Terminal 2)

1. **Open a new terminal window** and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Verify/Create `.env` inside `frontend/`** (Optional, fallback defaults to `http://localhost:8000/api`):
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000/api
   ```

4. **Start the Vite dev server**:
   ```bash
   npm run dev
   ```
   > 🟢 Frontend will be accessible at: **`http://localhost:5173`**

---

## ⚡ One-Click Utility Scripts

For faster operations, helper scripts are available in the [`scripts/`](file:///c:/Users/mohit/Desktop/my-projects/JeevanSetu_project/scripts) directory:

### 🪟 Windows (PowerShell)
| Task | Command |
| :--- | :--- |
| **Full Setup (Frontend + Backend deps)** | `.\scripts\setup_project.ps1` |
| **Start Docker Services** | `.\scripts\start_development.ps1` |
| **Stop Docker Services** | `.\scripts\stop_services.ps1` |

### 🐧 Linux / macOS (Bash)
| Task | Command |
| :--- | :--- |
| **Full Setup (Frontend + Backend deps)** | `bash ./scripts/setup_project.sh` |
| **Start Docker Services** | `bash ./scripts/start_development.sh` |
| **Stop Docker Services** | `bash ./scripts/stop_services.sh` |
| **Backup PostgreSQL Database** | `bash ./scripts/backup_database.sh` |
| **Restore PostgreSQL Database** | `bash ./scripts/restore_database.sh` |

---

## 🔑 Default Admin Credentials

If you seeded using `python scripts/create_superuser.py`:

- **Admin Portal URL**: `http://localhost:8000/admin` (or `http://127.0.0.1:8000/admin`)
- **Email / Username**: `mohitkumarchaurasiya2005@gmail.com` / `admin`
- **Password**: `Admin@12345`

> ⚠️ *Note: Remember to update the superuser password before deploying to any production server!*

---

## 📡 Key API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/register/` | `POST` | Register a new user account |
| `/api/auth/login/` | `POST` | Authenticate user & obtain JWT tokens |
| `/api/auth/me/` | `GET`, `PATCH` | Fetch or update user profile |
| `/api/diseases/` | `GET` | Retrieve list of cataloged diseases |
| `/api/symptoms/` | `GET` | Retrieve list of symptoms & categories |
| `/api/predictions/predict/` | `POST` | Execute ML risk inference for patient metrics |
| `/api/predictions/history/` | `GET` | View prediction history for authenticated user |
| `/api/feedback/` | `GET`, `POST` | Submit or review user testimonials |
| `/api/contact/` | `POST` | Public inquiry contact form |
| `/api/admin-panel/stats/` | `GET` | Admin dashboard analytics & system counts |
| `/api/audit-logs/` | `GET` | Security audit trail logs |

---

## ❓ Troubleshooting & FAQ

### 1. Port 8000 or 5173 is already in use
- Check running processes on Windows:
  ```powershell
  netstat -ano | findstr :8000
  netstat -ano | findstr :5173
  ```
- Terminate conflicting process or change the port (`python manage.py runserver 127.0.0.1:8001`).

### 2. CORS or Network Request Errors
- Verify that your backend `CORS_ALLOWED_ORIGINS` in `.env` includes `http://localhost:5173` and `http://127.0.0.1:5173`.
- Verify `VITE_API_BASE_URL` in `frontend/.env` points to the active backend address (e.g., `http://127.0.0.1:8000/api`).

### 3. Missing ML Models or Prediction Errors
- Ensure all models and encoders exist in `backend/ml_engine/models/`.
- If missing, train and export models using scripts in `machine_learning/`.

### 4. Database Reset Needed
- Run:
  ```bash
  python manage.py migrate
  python scripts/seed_initial_data.py
  python scripts/create_superuser.py
  ```

---

## 📜 License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.
