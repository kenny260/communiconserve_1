import random
import string

from django.conf import settings
from django.db import models

from core.models import TimeStampedModel


def generate_reference():
    return "BK-" + "".join(random.choices(string.digits, k=4))


class Booking(TimeStampedModel):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        CANCELLED = "cancelled", "Cancelled"
        COMPLETED = "completed", "Completed"

    reference = models.CharField(max_length=12, unique=True, default=generate_reference)
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="bookings")
    destination = models.ForeignKey("tourism.TourismDestination", on_delete=models.PROTECT, related_name="bookings")
    visit_date = models.DateField()
    visit_time = models.TimeField(null=True, blank=True)
    adults = models.PositiveSmallIntegerField(default=1)
    children = models.PositiveSmallIntegerField(default=0)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.reference

    def save(self, *args, **kwargs):
        if not self.total_price:
            self.total_price = self.destination.price_per_person * (self.adults + self.children)
        super().save(*args, **kwargs)
