from django.contrib import admin

from .models import DestinationImage, TourismDestination


class DestinationImageInline(admin.TabularInline):
    model = DestinationImage
    extra = 1


@admin.register(TourismDestination)
class TourismDestinationAdmin(admin.ModelAdmin):
    list_display = ("name", "community", "price_per_person", "status")
    list_filter = ("status", "community")
    search_fields = ("name", "location")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [DestinationImageInline]
