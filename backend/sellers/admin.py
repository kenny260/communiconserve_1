from django.contrib import admin

from .models import VerifiedSeller


@admin.register(VerifiedSeller)
class VerifiedSellerAdmin(admin.ModelAdmin):
    list_display = ("business_name", "community", "business_type", "is_active", "created_at")
    list_filter = ("is_active", "business_type")
    search_fields = ("business_name", "email")
