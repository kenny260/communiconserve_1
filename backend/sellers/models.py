from django.conf import settings
from django.db import models

from core.models import TimeStampedModel


class VerifiedSeller(TimeStampedModel):
    application = models.OneToOneField(
        "seller_applications.SellerApplication", on_delete=models.PROTECT, related_name="verified_seller"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="seller_profile"
    )
    business_name = models.CharField(max_length=150)
    community = models.ForeignKey("communities.Community", on_delete=models.PROTECT, related_name="sellers")
    district = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20)
    email = models.EmailField()
    business_type = models.CharField(max_length=100)
    business_description = models.TextField(blank=True)
    logo = models.ImageField(upload_to="sellers/logos/", null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["business_name"]

    def __str__(self):
        return self.business_name
