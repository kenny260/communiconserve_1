#!/usr/bin/env bash
set -euo pipefail

# Simple start script for Railway/Heroku-style environments.
# Installs requirements, runs migrations, collects static files, then starts Gunicorn.

# Use the existing Python environment on the platform. If a virtualenv is required,
# the Rail environment will usually provide one.

echo "Installing Python dependencies..."
python -m pip install --upgrade pip
pip install -r requirements.txt

echo "Running database migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting Gunicorn..."
# Bind to the port provided by the platform
exec gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers ${WEB_CONCURRENCY:-2}
