from django.db.models import Count, Sum
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import IsAdministrator
from bookings.models import Booking
from orders.models import Order
from .models import Report
from .serializers import ReportSerializer


class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [IsAdministrator]

    def perform_create(self, serializer):
        serializer.save(generated_by=self.request.user)

    @action(detail=False, methods=["post"])
    def generate(self, request):
        """Builds a report's summary_data from live order/booking totals for the given period."""
        period_start = request.data.get("period_start")
        period_end = request.data.get("period_end")
        report_type = request.data.get("report_type", Report.ReportType.MONTHLY)

        orders = Order.objects.filter(created_at__date__range=[period_start, period_end])
        bookings = Booking.objects.filter(visit_date__range=[period_start, period_end])

        summary = {
            "orders_count": orders.count(),
            "orders_revenue": str(orders.aggregate(total=Sum("total_amount"))["total"] or 0),
            "bookings_count": bookings.count(),
            "bookings_revenue": str(bookings.aggregate(total=Sum("total_price"))["total"] or 0),
            "orders_by_status": list(orders.values("status").annotate(count=Count("id"))),
        }

        report = Report.objects.create(
            title=f"{report_type.title()} report {period_start} to {period_end}",
            report_type=report_type,
            period_start=period_start,
            period_end=period_end,
            summary_data=summary,
            generated_by=request.user,
        )
        return Response(ReportSerializer(report).data, status=201)
