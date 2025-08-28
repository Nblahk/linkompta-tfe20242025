from django.urls import path
from .views import (
    AdminClientListView,
    ComptableClientListView,
    ClientDetailView,
    ClientProfileView,
    ClientDossierListView,
)

urlpatterns = [
    path("admin-list/", AdminClientListView.as_view(), name="admin-client-list"),
    path("comptable-list/", ComptableClientListView.as_view(), name="comptable-client-list"),
    path("me/", ClientDetailView.as_view(), name="client-detail"),
    path("me/profile/", ClientProfileView.as_view(), name="client-profile"),
    path("me/dossiers/", ClientDossierListView.as_view(), name="client-dossiers"),
]
