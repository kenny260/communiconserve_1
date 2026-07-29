from rest_framework import viewsets, permissions

from .models import Order
from .serializers import OrderSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.prefetch_related("items__product").all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["status"]

    def get_queryset(self):
        qs = super().get_queryset()
        if not self.request.user.is_administrator:
            qs = qs.filter(customer=self.request.user)
        return qs
