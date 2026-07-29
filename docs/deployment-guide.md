# Deployment Guide

## Option A: Docker Compose (single host)
```bash
docker compose up --build -d
```
This starts PostgreSQL, the Django backend (Gunicorn), and the Next.js frontend.
Set real values for `backend/.env` and `frontend/.env` before deploying —
never use the `.env.example` defaults in production.

Before first boot in production:
```bash
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py collectstatic --noinput
docker compose exec backend python manage.py createsuperuser
```

## Option B: Managed platforms
- **Backend**: any container host (Render, Railway, Fly.io, ECS). Point
  `DATABASE_URL` at a managed PostgreSQL instance. Serve static files via
  WhiteNoise (already wired into `requirements.txt`) or an object store.
- **Frontend**: Vercel or any Node host. Set `NEXT_PUBLIC_API_URL` to the
  deployed backend URL.
- **Media/uploads**: move `MEDIA_ROOT` to S3-compatible storage
  (e.g. django-storages) once traffic outgrows local disk.

## Environment checklist
- `SECRET_KEY` — unique, random, never committed
- `DEBUG=False`
- `ALLOWED_HOSTS` — your real domain(s)
- `CORS_ALLOWED_ORIGINS` — the deployed frontend origin only
- `DATABASE_URL` — managed Postgres connection string
- TLS/HTTPS terminated at the load balancer or platform edge

## Zero-downtime releases
1. Run `python manage.py migrate` before swapping traffic to the new backend version.
2. Keep migrations backward-compatible with the previous frontend build during rollout.
3. Roll back by redeploying the previous image; only run backward migrations if a
   forward migration is confirmed broken.
