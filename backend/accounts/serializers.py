from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id", "username", "email", "first_name", "last_name",
            "role", "phone_number", "community", "profile_image",
            "is_verified_seller", "created_at",
        )
        read_only_fields = ("id", "role", "is_verified_seller", "created_at")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("id", "username", "email", "password", "first_name", "last_name", "phone_number")

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class RoleTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Adds the user's role/administrator flag to the JWT payload."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["is_administrator"] = user.is_administrator
        return token
