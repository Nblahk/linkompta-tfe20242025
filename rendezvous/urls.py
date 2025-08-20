from django.urls import path
from .views import (
    RendezVousCreateView,
    RendezVousClientListView,
    RendezVousComptableListView,
    RendezVousUpdateStatusView,
    AdminRendezVousListView,
)

urlpatterns = [
    path("create/", RendezVousCreateView.as_view(), name="rdv-create"),
    path("me/", RendezVousClientListView.as_view(), name="rdv-client-list"),
    path("comptable/", RendezVousComptableListView.as_view(), name="rdv-comptable-list"),
    path("<int:pk>/update-status/", RendezVousUpdateStatusView.as_view(), name="rdv-update-status"),
    path("admin/", AdminRendezVousListView.as_view(), name="admin-rdv-list"),
]
