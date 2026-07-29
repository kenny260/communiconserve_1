from rest_framework import viewsets

from accounts.permissions import IsAdministrator
from core.models_audit import AuditLog
from core.serializers import AuditLogSerializer


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.select_related("actor").all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdministrator]
    filterset_fields = ["action", "actor"]
