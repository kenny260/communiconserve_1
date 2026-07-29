from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions, viewsets
from rest_framework.filters import SearchFilter
from rest_framework_simplejwt.views import TokenObtainPairView

from accounts.permissions import IsAdministrator
from .serializers import RegisterSerializer, RoleTokenObtainPairSerializer, UserSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class LoginView(TokenObtainPairView):
    serializer_class = RoleTokenObtainPairSerializer


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """Admin-only user directory (spec section 14: User Management)."""

    queryset = User.objects.all().order_by("-created_at")
    serializer_class = UserSerializer
    permission_classes = [IsAdministrator]
    filter_backends = [SearchFilter, DjangoFilterBackend]
    search_fields = ["username", "email", "first_name", "last_name"]
    filterset_fields = ["role", "is_verified_seller"]
