from django.conf import settings
from django.db import models

from core.models import TimeStampedModel


class SellerApplication(TimeStampedModel):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    applicant = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL,
        related_name="seller_applications",
    )
    full_name = models.CharField(max_length=150)
    organization_name = models.CharField(max_length=150, blank=True)
    community = models.ForeignKey("communities.Community", on_delete=models.PROTECT, related_name="seller_applications")
    district = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20)
    email = models.EmailField()
    business_type = models.CharField(max_length=100)
    products_to_sell = models.TextField()
    business_description = models.TextField()
    supporting_document = models.FileField(upload_to="seller_applications/documents/", null=True, blank=True)

    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL,
        related_name="reviewed_applications",
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.full_name} ({self.status})"
