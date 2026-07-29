import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django  # noqa: E402
django.setup()

import pytest  # noqa: E402


@pytest.fixture
def api_client():
    from rest_framework.test import APIClient
    return APIClient()


@pytest.fixture
def community(db):
    from communities.models import Community
    return Community.objects.create(
        name="Shewula", slug="shewula", district="Lubombo", overview="Test community",
    )


@pytest.fixture
def admin_user(db):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    return User.objects.create_user(
        username="admin1", password="Password123!", role=User.Role.NGO_COORDINATOR,
    )
