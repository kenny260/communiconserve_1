from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import LoginView, MeView, RegisterView, UserViewSet

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("login/refresh/", TokenRefreshView.as_view(), name="login-refresh"),
    path("me/", MeView.as_view(), name="me"),
    path("users/", UserViewSet.as_view({"get": "list"}), name="user-list"),
    path("users/<uuid:pk>/", UserViewSet.as_view({"get": "retrieve"}), name="user-detail"),
]
