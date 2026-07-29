# CommuniConserve

Conserve. Connect. Prosper.

A platform for community-led conservation, local commerce, and eco-tourism in
the Lubombo Corridor, Eswatini,  connecting communities, verified producers,
tourists, NGOs, and conservation officers in one secure digital ecosystem.

## Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui,
  Axios, React Hook Form + Zod, TanStack Query, Recharts, Framer Motion
- **Backend:** Django, Django REST Framework, SimpleJWT, django-filter, Pillow,
  django-cors-headers
- **Database:** PostgreSQL

## Project structure

```
communiconserve/
├── backend/        # Django project (config/) + one app per domain
├── frontend/        # Next.js app router: (public), admin, auth
├── database/         # schema.sql / seed.sql references
├── docs/            # README, install/deploy guides, API + DB docs
├── tests/           # unit, integration, api, manual test cases
├── docker/           # Dockerfiles for backend/frontend
└── docker-compose.yml
```

## Getting started

### 1. Database

```bash
docker compose up -d db
```

### 2. Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # edit SECRET_KEY / DATABASE_URL as needed
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_demo_data   # populates realistic demo data (WIP)
python manage.py runserver
```

API base URL: `http://localhost:8000/api/v1/`

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App: `http://localhost:3000`

### 4. Everything via Docker (optional)

```bash
docker compose up --build
```

## Roles

- **Public:** Visitor, Customer, Tourist - browse/search the marketplace and
  tourism listings, purchase, book, apply to become a seller, manage their
  own profile/orders/bookings.
- **Administrator:** NGO Coordinator, Conservation Officer, manage users,
  seller applications, the marketplace, tourism, conservation content,
  communities, notifications, reports, analytics, and audit logs via
  `/admin` (redirected there after login).

## Documentation

See [docs/](./docs/README.md) for the installation guide, deployment guide,
API reference, database documentation, and UML/architecture diagrams.

## Status

Fully implemented: all 12 backend apps (models, serializers, viewsets,
permissions, JWT auth, audit logging), the `seed_demo_data` command
(15 communities, 20 verified sellers, 65 products, 21 destinations, 30
conservation projects, 45 bookings, 55 orders, 35 notifications, 160 audit
logs), a pytest suite, and all 26 frontend routes for  every public page,
auth flow, and admin module  wired to the live API with real forms,
tables, and charts.

Not built in this pass: payment gateway integration, email/SMS delivery
for notifications, and a settings-persistence backend (the Settings page
UI exists but doesn't yet call an API). This sandbox has no network
access, so nothing here has been run against a live Postgres instance or
`npm install`ed — review the code and run it locally before deploying.
