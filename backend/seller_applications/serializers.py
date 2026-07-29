from rest_framework import serializers

from .models import SellerApplication


class SellerApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerApplication
        fields = (
            "id", "applicant", "full_name", "organization_name", "community", "district",
            "phone_number", "email", "business_type", "products_to_sell",
            "business_description", "supporting_document", "status",
            "reviewed_by", "reviewed_at", "rejection_reason", "created_at",
        )
        read_only_fields = ("id", "status", "reviewed_by", "reviewed_at", "created_at", "applicant")

    def create(self, validated_data):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["applicant"] = request.user
        return super().create(validated_data)


class SellerApplicationReviewSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=("approve", "reject"))
    rejection_reason = serializers.CharField(required=False, allow_blank=True)
