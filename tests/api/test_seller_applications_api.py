import pytest


@pytest.mark.django_db
def test_anyone_can_submit_seller_application(api_client, community):
    resp = api_client.post("/api/v1/seller-applications/", {
        "full_name": "Sipho Nxumalo", "community": community.id, "district": "Lubombo",
        "phone_number": "+26876111111", "email": "sipho@example.com",
        "business_type": "Sole Trader", "products_to_sell": "Honey",
        "business_description": "Local honey producer.",
    })
    assert resp.status_code == 201


@pytest.mark.django_db
def test_review_requires_admin(api_client, community):
    from seller_applications.models import SellerApplication
    application = SellerApplication.objects.create(
        full_name="Sipho Nxumalo", community=community, district="Lubombo",
        phone_number="+26876111111", email="sipho@example.com",
        business_type="Sole Trader", products_to_sell="Honey",
        business_description="Local honey producer.",
    )
    resp = api_client.post(f"/api/v1/seller-applications/{application.id}/review/", {"action": "approve"})
    assert resp.status_code in (401, 403)
