from rest_framework.routers import DefaultRouter

from .views import SellerApplicationViewSet

router = DefaultRouter()
router.register("", SellerApplicationViewSet, basename="seller-application")

urlpatterns = router.urls
