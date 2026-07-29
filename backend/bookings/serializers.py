from rest_framework import serializers

from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    destination_name = serializers.CharField(source="destination.name", read_only=True)

    class Meta:
        model = Booking
        fields = (
            "id", "reference", "customer", "destination", "destination_name", "visit_date",
            "visit_time", "adults", "children", "total_price", "status", "notes", "created_at",
        )
        read_only_fields = ("id", "reference", "customer", "total_price", "status", "created_at")

    def create(self, validated_data):
        request = self.context.get("request")
        validated_data["customer"] = request.user
        return super().create(validated_data)
