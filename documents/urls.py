from django.urls import path
from .views import (
    DocumentUploadView,
    ClientDocumentListView,
    ComptableDocumentListView,
    AdminDocumentListView,
    ComptableDocumentUpdateStatusView,
)

urlpatterns = [
    path("upload/", DocumentUploadView.as_view(), name="document-upload"),
    path("me/", ClientDocumentListView.as_view(), name="client-documents"),
    path("comptable-list/", ComptableDocumentListView.as_view(), name="comptable-documents"),
    path("admin-list/", AdminDocumentListView.as_view(), name="admin-documents"),
    path("<int:pk>/update-status/", ComptableDocumentUpdateStatusView.as_view(), name="update-document-status"),
]
