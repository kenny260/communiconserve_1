from django.db import models

from core.models import TimeStampedModel


class Community(TimeStampedModel):
    name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=160, unique=True)
    district = models.CharField(max_length=100)
    overview = models.TextField()
    conservation_initiatives = models.TextField(blank=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    cover_image = models.ImageField(upload_to="communities/", null=True, blank=True)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "communities"

    def __str__(self):
        return self.name


class CommunityImage(TimeStampedModel):
    community = models.ForeignKey(Community, related_name="gallery", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="communities/gallery/")
    caption = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.community.name} gallery image"
