from django.urls import path

from .views import DashboardAnalyticsView, TopProductsView

urlpatterns = [
    path("dashboard/", DashboardAnalyticsView.as_view(), name="analytics-dashboard"),
    path("top-products/", TopProductsView.as_view(), name="analytics-top-products"),
]
