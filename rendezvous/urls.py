from django.urls import path
from .views import (
    RendezVousCreateView,
    ClientRendezVousListView,
    ComptableRendezVousListView,
    ComptableRendezVousUpdateView,
    AdminRendezVousListView,
)

urlpatterns = [
    path("create/", RendezVousCreateView.as_view(), name="rdv-create"),
    path("me/", ClientRendezVousListView.as_view(), name="rdv-client-list"),
    path("comptable/", ComptableRendezVousListView.as_view(), name="rdv-comptable-list"),
    path("comptable/<int:pk>/update/", ComptableRendezVousUpdateView.as_view(), name="rdv-update-status"),
    path("admin/", AdminRendezVousListView.as_view(), name="rdv-admin-list"),
]
