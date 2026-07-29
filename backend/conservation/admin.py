from django.contrib import admin

from .models import ConservationProject, ProjectGallery, ProjectUpdate


class ProjectGalleryInline(admin.TabularInline):
    model = ProjectGallery
    extra = 1


class ProjectUpdateInline(admin.TabularInline):
    model = ProjectUpdate
    extra = 0


@admin.register(ConservationProject)
class ConservationProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "community", "category", "status")
    list_filter = ("category", "status")
    search_fields = ("title",)
    prepopulated_fields = {"slug": ("title",)}
    inlines = [ProjectGalleryInline, ProjectUpdateInline]
