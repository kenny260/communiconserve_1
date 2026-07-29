from rest_framework import serializers

from .models import VerifiedSeller


class VerifiedSellerSerializer(serializers.ModelSerializer):
    community_name = serializers.CharField(source="community.name", read_only=True)
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = VerifiedSeller
        fields = (
            "id", "business_name", "community", "community_name", "district",
            "phone_number", "email", "business_type", "business_description",
            "logo", "is_active", "product_count", "created_at",
        )
        read_only_fields = ("id", "created_at")

    def get_product_count(self, obj):
        return obj.products.count()
