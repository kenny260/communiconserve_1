from django.utils import timezone
from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import IsAdministrator
from core.audit import log_action
from sellers.models import VerifiedSeller
from .models import SellerApplication
from .serializers import SellerApplicationReviewSerializer, SellerApplicationSerializer


class SellerApplicationViewSet(viewsets.ModelViewSet):
    queryset = SellerApplication.objects.select_related("community", "applicant").all()
    serializer_class = SellerApplicationSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["full_name", "organization_name", "email"]
    ordering_fields = ["created_at", "status"]
    filterset_fields = ["status", "community"]

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        if self.action in ("list", "retrieve"):
            return [permissions.IsAuthenticated()]
        return [IsAdministrator()]

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.is_authenticated and not user.is_administrator:
            qs = qs.filter(applicant=user)
        return qs

    @action(detail=True, methods=["post"], permission_classes=[IsAdministrator])
    def review(self, request, pk=None):
        application = self.get_object()
        serializer = SellerApplicationReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        action_taken = serializer.validated_data["action"]

        application.reviewed_by = request.user
        application.reviewed_at = timezone.now()

        if action_taken == "approve":
            application.status = SellerApplication.Status.APPROVED
            application.save()
            seller, _ = VerifiedSeller.objects.get_or_create(
                application=application,
                defaults={
                    "user": application.applicant,
                    "business_name": application.organization_name or application.full_name,
                    "community": application.community,
                    "district": application.district,
                    "phone_number": application.phone_number,
                    "email": application.email,
                    "business_type": application.business_type,
                    "business_description": application.business_description,
                },
            )
            if application.applicant:
                application.applicant.is_verified_seller = True
                application.applicant.save(update_fields=["is_verified_seller"])
            log_action(request.user, "approve_seller_application", application)
        else:
            application.status = SellerApplication.Status.REJECTED
            application.rejection_reason = serializer.validated_data.get("rejection_reason", "")
            application.save()
            log_action(request.user, "reject_seller_application", application)

        return Response(SellerApplicationSerializer(application).data, status=status.HTTP_200_OK)
