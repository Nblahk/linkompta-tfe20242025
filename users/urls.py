from django.urls import path
from .views import UserListView
from .views import (
    AdminUserListView,
    ComptableUserListView,
    ClientUserDetailView,
    AdminAuditLogView,
    ComptableAuditLogView,
    CurrentUserView, 
    )   



urlpatterns = [
    path("", UserListView.as_view(), name="user-list"),
    path("admin-list/", AdminUserListView.as_view(), name="admin-list"),
    path("comptable-list/", ComptableUserListView.as_view(), name="comptable-list"),
    path("me/", CurrentUserView.as_view(), name="user-me"), 
    path("client-detail/", ClientUserDetailView.as_view(), name="client-detail"),
    path("admin/audit/", AdminAuditLogView.as_view(), name="admin-audit"),
    path("comptable/audit/", ComptableAuditLogView.as_view(), name="comptable-audit"),
]
