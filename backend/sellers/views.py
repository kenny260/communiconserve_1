from rest_framework import viewsets, permissions, filters

from accounts.permissions import IsAdministrator
from .models import VerifiedSeller
from .serializers import VerifiedSellerSerializer


class VerifiedSellerViewSet(viewsets.ModelViewSet):
    queryset = VerifiedSeller.objects.select_related("community").all()
    serializer_class = VerifiedSellerSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["business_name", "email", "district"]
    filterset_fields = ["community", "is_active"]

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [IsAdministrator()]
