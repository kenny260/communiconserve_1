from rest_framework import serializers

from .models import ConservationProject, ProjectGallery, ProjectUpdate


class ProjectGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectGallery
        fields = ("id", "image", "caption")


class ProjectUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectUpdate
        fields = ("id", "title", "content", "created_at")


class ConservationProjectListSerializer(serializers.ModelSerializer):
    community_name = serializers.CharField(source="community.name", read_only=True)

    class Meta:
        model = ConservationProject
        fields = ("id", "title", "slug", "community_name", "category", "status", "cover_image")


class ConservationProjectDetailSerializer(serializers.ModelSerializer):
    gallery = ProjectGallerySerializer(many=True, read_only=True)
    updates = ProjectUpdateSerializer(many=True, read_only=True)

    class Meta:
        model = ConservationProject
        fields = (
            "id", "title", "slug", "community", "category", "description", "status",
            "start_date", "end_date", "impact_summary", "cover_image", "gallery", "updates", "created_at",
        )
        read_only_fields = ("id", "created_at")
