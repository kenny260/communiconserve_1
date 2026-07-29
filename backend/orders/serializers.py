from rest_framework import serializers

from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ("id", "product", "product_name", "quantity", "unit_price", "subtotal")


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = (
            "id", "order_number", "customer", "status", "shipping_address",
            "total_amount", "items", "created_at",
        )
        read_only_fields = ("id", "order_number", "customer", "total_amount", "created_at")

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        request = self.context.get("request")
        order = Order.objects.create(customer=request.user, **validated_data)
        for item in items_data:
            OrderItem.objects.create(order=order, **item)
        order.recalculate_total()
        return order
