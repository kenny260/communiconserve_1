from rest_framework.routers import DefaultRouter

from .views import TourismDestinationViewSet

router = DefaultRouter()
router.register("", TourismDestinationViewSet, basename="tourism-destination")

urlpatterns = router.urls
