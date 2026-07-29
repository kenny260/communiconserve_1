import pytest


@pytest.mark.django_db
def test_register_and_login(api_client):
    resp = api_client.post("/api/v1/auth/register/", {
        "username": "newuser", "email": "new@example.com", "password": "Password123!",
    })
    assert resp.status_code == 201

    resp = api_client.post("/api/v1/auth/login/", {
        "username": "newuser", "password": "Password123!",
    })
    assert resp.status_code == 200
    assert "access" in resp.data


@pytest.mark.django_db
def test_me_requires_authentication(api_client):
    resp = api_client.get("/api/v1/auth/me/")
    assert resp.status_code == 401
