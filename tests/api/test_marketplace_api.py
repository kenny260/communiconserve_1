import pytest


@pytest.mark.django_db
def test_public_can_list_categories(api_client):
    resp = api_client.get("/api/v1/marketplace/categories/")
    assert resp.status_code == 200


@pytest.mark.django_db
def test_non_admin_cannot_create_category(api_client):
    resp = api_client.post("/api/v1/marketplace/categories/", {"name": "Test", "slug": "test"})
    assert resp.status_code in (401, 403)


@pytest.mark.django_db
def test_admin_can_create_category(api_client, admin_user):
    api_client.force_authenticate(user=admin_user)
    resp = api_client.post("/api/v1/marketplace/categories/", {"name": "Honey", "slug": "honey"})
    assert resp.status_code == 201
