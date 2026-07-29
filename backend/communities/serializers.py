from rest_framework import serializers

from .models import Community, CommunityImage


class CommunityImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityImage
        fields = ("id", "image", "caption")


class CommunitySerializer(serializers.ModelSerializer):
    gallery = CommunityImageSerializer(many=True, read_only=True)
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Community
        fields = (
            "id", "name", "slug", "district", "overview", "conservation_initiatives",
            "contact_email", "contact_phone", "latitude", "longitude", "cover_image",
            "is_published", "gallery", "product_count", "created_at",
        )
        read_only_fields = ("id", "created_at")

    def get_product_count(self, obj):
        return obj.products.filter(status="published").count() if hasattr(obj, "products") else 0


class CommunityListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Community
        fields = ("id", "name", "slug", "district", "cover_image")
