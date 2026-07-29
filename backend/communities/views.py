from rest_framework import viewsets, permissions, filters

from accounts.permissions import IsAdministrator
from .models import Community
from .serializers import CommunityListSerializer, CommunitySerializer


class CommunityViewSet(viewsets.ModelViewSet):
    queryset = Community.objects.all().prefetch_related("gallery")
    lookup_field = "slug"
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "district", "overview"]
    ordering_fields = ["name", "created_at"]

    def get_serializer_class(self):
        return CommunityListSerializer if self.action == "list" else CommunitySerializer

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return [IsAdministrator()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        qs = super().get_queryset()
        if self.action == "list" and not (self.request.user.is_authenticated and self.request.user.is_administrator):
            qs = qs.filter(is_published=True)
        return qs
