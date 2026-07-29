from datetime import timedelta

from django.db.models import Sum
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsAdministrator
from bookings.models import Booking
from communities.models import Community
from conservation.models import ConservationProject
from marketplace.models import Product
from orders.models import Order
from sellers.models import VerifiedSeller

try:
    from accounts.models import User
except Exception:  # pragma: no cover
    User = None


class DashboardAnalyticsView(APIView):
    """Powers the admin dashboard stat cards + charts (spec section 13)."""

    permission_classes = [IsAdministrator]

    def get(self, request):
        since = timezone.now() - timedelta(days=30)

        data = {
            "totals": {
                "users": User.objects.count() if User else 0,
                "verified_sellers": VerifiedSeller.objects.filter(is_active=True).count(),
                "products": Product.objects.count(),
                "bookings": Booking.objects.count(),
                "orders": Order.objects.count(),
                "revenue": str(Order.objects.aggregate(total=Sum("total_amount"))["total"] or 0),
                "conservation_projects": ConservationProject.objects.count(),
                "communities": Community.objects.count(),
            },
            "recent_30_days": {
                "new_users": User.objects.filter(created_at__gte=since).count() if User else 0,
                "new_orders": Order.objects.filter(created_at__gte=since).count(),
                "new_bookings": Booking.objects.filter(created_at__gte=since).count(),
            },
            "top_communities": list(
                Community.objects.annotate(product_total=Sum("products__id")).values("name")[:5]
            ),
        }
        return Response(data)


class TopProductsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        products = (
            Product.objects.filter(status="published")
            .order_by("-average_rating", "-ratings_count")[:10]
            .values("name", "average_rating", "ratings_count", "price")
        )
        return Response(list(products))
