from rest_framework.routers import DefaultRouter

from core.views import AuditLogViewSet

router = DefaultRouter()
router.register("", AuditLogViewSet, basename="audit-log")

urlpatterns = router.urls
