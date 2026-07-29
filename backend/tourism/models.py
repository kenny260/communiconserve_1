from django.db import models

from core.models import TimeStampedModel


class TourismDestination(TimeStampedModel):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=210, unique=True)
    description = models.TextField()
    community = models.ForeignKey("communities.Community", on_delete=models.PROTECT, related_name="destinations")
    location = models.CharField(max_length=150)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    facilities = models.TextField(help_text="Comma-separated facilities")
    price_per_person = models.DecimalField(max_digits=10, decimal_places=2)
    opening_hours = models.CharField(max_length=150)
    contact_info = models.CharField(max_length=150)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.DRAFT)
    cover_image = models.ImageField(upload_to="tourism/", null=True, blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class DestinationImage(TimeStampedModel):
    destination = models.ForeignKey(TourismDestination, related_name="gallery", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="tourism/gallery/")
    caption = models.CharField(max_length=200, blank=True)
