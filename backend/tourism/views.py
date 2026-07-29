from rest_framework import viewsets, permissions, filters

from accounts.permissions import IsAdministrator
from .models import TourismDestination
from .serializers import TourismDestinationDetailSerializer, TourismDestinationListSerializer


class TourismDestinationViewSet(viewsets.ModelViewSet):
    queryset = TourismDestination.objects.select_related("community").prefetch_related("gallery")
    lookup_field = "slug"
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "location", "description"]
    ordering_fields = ["price_per_person", "created_at"]
    filterset_fields = ["community", "status"]

    def get_serializer_class(self):
        return TourismDestinationListSerializer if self.action == "list" else TourismDestinationDetailSerializer

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return [IsAdministrator()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        qs = super().get_queryset()
        if self.action == "list" and not (self.request.user.is_authenticated and self.request.user.is_administrator):
            qs = qs.filter(status=TourismDestination.Status.PUBLISHED)
        return qs
