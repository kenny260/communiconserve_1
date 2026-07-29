from rest_framework import permissions


class IsAdministrator(permissions.BasePermission):
    """Allows access only to NGO Coordinator / Conservation Officer roles."""

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and getattr(user, "role", None) in ("ngo_coordinator", "conservation_officer")
        )
