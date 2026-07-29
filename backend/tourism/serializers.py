from rest_framework import serializers

from .models import DestinationImage, TourismDestination


class DestinationImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DestinationImage
        fields = ("id", "image", "caption")


class TourismDestinationListSerializer(serializers.ModelSerializer):
    community_name = serializers.CharField(source="community.name", read_only=True)

    class Meta:
        model = TourismDestination
        fields = ("id", "name", "slug", "community_name", "location", "price_per_person", "cover_image")


class TourismDestinationDetailSerializer(serializers.ModelSerializer):
    gallery = DestinationImageSerializer(many=True, read_only=True)

    class Meta:
        model = TourismDestination
        fields = (
            "id", "name", "slug", "description", "community", "location", "latitude", "longitude",
            "facilities", "price_per_person", "opening_hours", "contact_info", "status",
            "cover_image", "gallery", "created_at",
        )
        read_only_fields = ("id", "created_at")
