from django.conf import settings
from django.db import models

from core.models import TimeStampedModel


class Notification(TimeStampedModel):
    class Type(models.TextChoices):
        SELLER_APPLICATION = "seller_application", "Seller Application"
        ORDER = "order", "Order"
        BOOKING = "booking", "Booking"
        CONSERVATION = "conservation", "Conservation"
        SYSTEM = "system", "System"

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.CASCADE, related_name="notifications",
        help_text="Null = broadcast to all administrators",
    )
    type = models.CharField(max_length=25, choices=Type.choices, default=Type.SYSTEM)
    title = models.CharField(max_length=150)
    message = models.TextField()
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
