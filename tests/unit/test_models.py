import pytest


@pytest.mark.django_db
def test_community_str(community):
    assert str(community) == "Shewula"


@pytest.mark.django_db
def test_verified_seller_created_on_application_approval(community, admin_user):
    from seller_applications.models import SellerApplication
    from sellers.models import VerifiedSeller

    application = SellerApplication.objects.create(
        full_name="Thandi Dlamini", community=community, district="Lubombo",
        phone_number="+26876000000", email="thandi@example.com",
        business_type="Cooperative", products_to_sell="Honey",
        business_description="Local honey producer.",
        status=SellerApplication.Status.APPROVED,
        reviewed_by=admin_user,
    )
    seller = VerifiedSeller.objects.create(
        application=application, business_name="Dlamini Honey", community=community,
        district="Lubombo", phone_number="+26876000000", email="thandi@example.com",
        business_type="Cooperative",
    )
    assert seller.application == application
    assert application.verified_seller == seller
