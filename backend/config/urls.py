from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

api_v1_patterns = [
    path("auth/", include("accounts.urls")),
    path("communities/", include("communities.urls")),
    path("sellers/", include("sellers.urls")),
    path("seller-applications/", include("seller_applications.urls")),
    path("marketplace/", include("marketplace.urls")),
    path("tourism/", include("tourism.urls")),
    path("bookings/", include("bookings.urls")),
    path("orders/", include("orders.urls")),
    path("conservation/", include("conservation.urls")),
    path("notifications/", include("notifications.urls")),
    path("reports/", include("reports.urls")),
    path("analytics/", include("analytics.urls")),
    path("audit-logs/", include("core.urls")),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include(api_v1_patterns)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
