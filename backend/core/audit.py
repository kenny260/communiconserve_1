"""Shared helper for writing to the audit trail (spec sections 13/20)."""
from django.contrib.contenttypes.models import ContentType


def log_action(actor, action: str, target=None, metadata: dict | None = None):
    from core.models_audit import AuditLog  # local import avoids circular imports

    AuditLog.objects.create(
        actor=actor if getattr(actor, "is_authenticated", False) else None,
        action=action,
        target_type=ContentType.objects.get_for_model(target).model if target is not None else "",
        target_id=str(getattr(target, "id", "")) if target is not None else "",
        metadata=metadata or {},
    )
