# Installation Guide

## Prerequisites
- Python 3.12+
- Node.js 20+
- PostgreSQL 16+ (or Docker)

## 1. Clone and configure
```bash
git clone <repo-url> communiconserve
cd communiconserve
```

## 2. Database
Using Docker (recommended):
```bash
docker compose up -d db
```
Or install PostgreSQL locally and create a `communiconserve` database.

## 3. Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # edit SECRET_KEY / DATABASE_URL
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_demo_data
python manage.py runserver
```
API available at `http://localhost:8000/api/v1/`.
Django admin at `http://localhost:8000/admin/`.

## 4. Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
App available at `http://localhost:3000`.

## 5. Run tests
```bash
cd backend
pytest ../tests
```

## Demo accounts (after `seed_demo_data`)
| Role | Username | Password |
|---|---|---|
| NGO Coordinator | ngo_coordinator_1 | Password123! |
| Conservation Officer | conservation_officer_1 | Password123! |
| Customer | customer_1 | Password123! |
| Tourist | tourist_1 | Password123! |
