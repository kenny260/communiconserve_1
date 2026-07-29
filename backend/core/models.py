import uuid

from django.db import models


class TimeStampedModel(models.Model):
    """Abstract base with UUID pk and created/updated timestamps."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


from core.models_audit import AuditLog  # noqa: E402,F401  (re-exported for migrations)
