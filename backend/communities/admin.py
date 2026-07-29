from django.contrib import admin

from .models import Community, CommunityImage


class CommunityImageInline(admin.TabularInline):
    model = CommunityImage
    extra = 1


@admin.register(Community)
class CommunityAdmin(admin.ModelAdmin):
    list_display = ("name", "district", "is_published", "created_at")
    list_filter = ("district", "is_published")
    search_fields = ("name", "district")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [CommunityImageInline]
