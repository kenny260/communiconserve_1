from rest_framework import viewsets, permissions, filters

from accounts.permissions import IsAdministrator
from .models import Booking
from .serializers import BookingSerializer


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.select_related("destination", "customer").all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["visit_date", "created_at"]
    filterset_fields = ["status", "destination"]

    def get_queryset(self):
        qs = super().get_queryset()
        if not self.request.user.is_administrator:
            qs = qs.filter(customer=self.request.user)
        return qs

