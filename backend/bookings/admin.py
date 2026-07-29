from django.contrib import admin

from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("reference", "customer", "destination", "visit_date", "status", "total_price")
    list_filter = ("status",)
    search_fields = ("reference", "customer__username")
