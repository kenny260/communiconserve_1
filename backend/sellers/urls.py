from rest_framework.routers import DefaultRouter

from .views import VerifiedSellerViewSet

router = DefaultRouter()
router.register("", VerifiedSellerViewSet, basename="verified-seller")

urlpatterns = router.urls
