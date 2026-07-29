from rest_framework import serializers

from core.models_audit import AuditLog


class AuditLogSerializer(serializers.ModelSerializer):
    actor_name = serializers.CharField(source="actor.username", read_only=True, default=None)

    class Meta:
        model = AuditLog
        fields = ("id", "actor", "actor_name", "action", "target_type", "target_id", "metadata", "created_at")
