from rest_framework.routers import DefaultRouter

from .views import ConservationProjectViewSet

router = DefaultRouter()
router.register("", ConservationProjectViewSet, basename="conservation-project")

urlpatterns = router.urls
