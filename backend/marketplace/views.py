from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import IsAdministrator
from core.audit import log_action
from .models import Category, Product, ProductReview
from .serializers import (
    CategorySerializer, ProductDetailSerializer, ProductListSerializer, ProductReviewSerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return [IsAdministrator()]
        return [permissions.AllowAny()]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related("category", "seller", "community").prefetch_related("images", "reviews")
    lookup_field = "slug"
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "description", "seller__business_name", "community__name"]
    ordering_fields = ["price", "average_rating", "created_at"]
    filterset_fields = ["category", "community", "seller", "status"]

    def get_serializer_class(self):
        return ProductListSerializer if self.action == "list" else ProductDetailSerializer

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return [IsAdministrator()]
        if self.action == "review":
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        qs = super().get_queryset()
        if self.action == "list" and not (self.request.user.is_authenticated and self.request.user.is_administrator):
            qs = qs.filter(status=Product.Status.PUBLISHED)
        return qs

    def perform_create(self, serializer):
        instance = serializer.save()
        log_action(self.request.user, "create_product", instance)

    @action(detail=True, methods=["post"])
    def review(self, request, slug=None):
        product = self.get_object()
        serializer = ProductReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        review, created = ProductReview.objects.update_or_create(
            product=product, reviewer=request.user,
            defaults={"rating": serializer.validated_data["rating"], "comment": serializer.validated_data.get("comment", "")},
        )
        from django.db.models import Avg, Count
        stats = product.reviews.aggregate(avg=Avg("rating"), count=Count("id"))
        product.average_rating = round(stats["avg"] or 0, 2)
        product.ratings_count = stats["count"]
        product.save(update_fields=["average_rating", "ratings_count"])
        return Response(ProductReviewSerializer(review).data, status=201 if created else 200)
