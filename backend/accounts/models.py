import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user with role-based access for CommuniConserve."""

    class Role(models.TextChoices):
        VISITOR = "visitor", "Visitor / Customer / Tourist"
        NGO_COORDINATOR = "ngo_coordinator", "NGO Coordinator"
        CONSERVATION_OFFICER = "conservation_officer", "Conservation Officer"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=30, choices=Role.choices, default=Role.VISITOR)
    phone_number = models.CharField(max_length=20, blank=True)
    community = models.ForeignKey(
        "communities.Community", null=True, blank=True, on_delete=models.SET_NULL, related_name="members"
    )
    profile_image = models.ImageField(upload_to="profiles/", null=True, blank=True)
    is_verified_seller = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def is_administrator(self) -> bool:
        return self.role in (self.Role.NGO_COORDINATOR, self.Role.CONSERVATION_OFFICER)

    def __str__(self) -> str:
        return self.username
