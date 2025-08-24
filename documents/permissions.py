from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "admin"

class IsComptable(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "comptable"

class IsClient(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated or request.user.role != "client":
            return False
        try:
            return bool(request.user.client_profile)
        except:
            return False
