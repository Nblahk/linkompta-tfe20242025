from django.urls import path
from .views import UserListView
from .views import (
    AdminUserListView,
    ComptableUserListView,
    ClientUserDetailView,
)

urlpatterns = [
    path("", UserListView.as_view(), name="user-list"),
    path("admin-list/", AdminUserListView.as_view(), name="admin-list"),
    path("comptable-list/", ComptableUserListView.as_view(), name="comptable-list"),
    path("client-detail/", ClientUserDetailView.as_view(), name="client-detail"),
]
