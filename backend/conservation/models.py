from django.conf import settings
from django.db import models

from core.models import TimeStampedModel


class ConservationProject(TimeStampedModel):
    class Category(models.TextChoices):
        RESTORATION = "restoration", "Restoration Activity"
        CAMPAIGN = "campaign", "Environmental Campaign"
        COMMUNITY = "community", "Community Success Story"

    class Status(models.TextChoices):
        PLANNED = "planned", "Planned"
        IN_PROGRESS = "in_progress", "In Progress"
        COMPLETED = "completed", "Completed"

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=210, unique=True)
    community = models.ForeignKey("communities.Community", on_delete=models.PROTECT, related_name="conservation_projects")
    category = models.CharField(max_length=15, choices=Category.choices, default=Category.RESTORATION)
    description = models.TextField()
    status = models.CharField(max_length=15, choices=Status.choices, default=Status.PLANNED)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    impact_summary = models.CharField(max_length=250, blank=True)
    cover_image = models.ImageField(upload_to="conservation/", null=True, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="conservation_projects"
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class ProjectGallery(TimeStampedModel):
    project = models.ForeignKey(ConservationProject, related_name="gallery", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="conservation/gallery/")
    caption = models.CharField(max_length=200, blank=True)


class ProjectUpdate(TimeStampedModel):
    project = models.ForeignKey(ConservationProject, related_name="updates", on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()

    class Meta:
        ordering = ["-created_at"]
