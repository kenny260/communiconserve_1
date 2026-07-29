from django.contrib import admin

from .models import SellerApplication


@admin.register(SellerApplication)
class SellerApplicationAdmin(admin.ModelAdmin):
    list_display = ("full_name", "community", "district", "status", "created_at")
    list_filter = ("status", "district")
    search_fields = ("full_name", "organization_name", "email")
