from rest_framework import viewsets, permissions, filters

from accounts.permissions import IsAdministrator
from .models import ConservationProject
from .serializers import ConservationProjectDetailSerializer, ConservationProjectListSerializer


class ConservationProjectViewSet(viewsets.ModelViewSet):
    queryset = ConservationProject.objects.select_related("community").prefetch_related("gallery", "updates")
    lookup_field = "slug"
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "description"]
    filterset_fields = ["community", "category", "status"]

    def get_serializer_class(self):
        return ConservationProjectListSerializer if self.action == "list" else ConservationProjectDetailSerializer

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return [IsAdministrator()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
