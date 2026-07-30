#!/usr/bin/env bash
set -euo pipefail

# Simple start script for Railway/Heroku-style environments.
# Installs requirements, optionally runs migrations and collectstatic, then starts Gunicorn.

# Use the existing Python environment on the platform. If a virtualenv is required,
# the platform environment will usually provide one.

echo "Installing Python dependencies..."
python -m pip install --upgrade pip
pip install -r requirements.txt

# Allow skipping migrations/collectstatic by setting environment variables:
#   SKIP_MIGRATE=true        (skip running `manage.py migrate`)
#   SKIP_COLLECTSTATIC=true  (skip running `manage.py collectstatic`)

SKIP_MIGRATE=${SKIP_MIGRATE:-false}
SKIP_COLLECTSTATIC=${SKIP_COLLECTSTATIC:-false}

if [ "$SKIP_MIGRATE" != "true" ]; then
  echo "Running database migrations..."
  python manage.py migrate --noinput
else
  echo "Skipping migrations (SKIP_MIGRATE=true)"
fi

if [ "$SKIP_COLLECTSTATIC" != "true" ]; then
  echo "Collecting static files..."
  python manage.py collectstatic --noinput
else
  echo "Skipping collectstatic (SKIP_COLLECTSTATIC=true)"
fi

echo "Starting Gunicorn..."
# Bind to the port provided by the platform
exec gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers ${WEB_CONCURRENCY:-2}
