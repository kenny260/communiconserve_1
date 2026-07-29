from rest_framework import serializers

from .models import Category, Product, ProductImage, ProductReview


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "name", "slug", "description", "icon")


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ("id", "image", "alt_text", "is_primary")


class ProductReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source="reviewer.username", read_only=True)

    class Meta:
        model = ProductReview
        fields = ("id", "reviewer", "reviewer_name", "rating", "comment", "created_at")
        read_only_fields = ("id", "reviewer", "created_at")


class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    seller_name = serializers.CharField(source="seller.business_name", read_only=True)
    community_name = serializers.CharField(source="community.name", read_only=True)
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id", "name", "slug", "category_name", "seller_name", "community_name",
            "price", "average_rating", "ratings_count", "primary_image", "is_available",
        )

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first() or obj.images.first()
        if not img or not img.image:
            return None
        request = self.context.get("request")
        return request.build_absolute_uri(img.image.url) if request else img.image.url


class ProductDetailSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ProductReviewSerializer(many=True, read_only=True)
    category_detail = CategorySerializer(source="category", read_only=True)

    class Meta:
        model = Product
        fields = (
            "id", "name", "slug", "category", "category_detail", "description", "price",
            "seller", "community", "stock_quantity", "is_available", "status",
            "average_rating", "ratings_count", "images", "reviews", "created_at",
        )
        read_only_fields = ("id", "average_rating", "ratings_count", "created_at")
