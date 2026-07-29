from django.contrib import admin

from .models import Category, Product, ProductImage, ProductReview


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "seller", "price", "status", "is_available")
    list_filter = ("status", "category", "is_available")
    search_fields = ("name", "seller__business_name")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductImageInline]


admin.site.register(ProductReview)
