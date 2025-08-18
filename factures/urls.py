from django.urls import path
from .views import (
    FactureCreateView,
    ClientFactureListView,
    AdminFactureListView,
    FacturePaiementView,
    AdminPaiementListView,
)

urlpatterns = [
    path("create/", FactureCreateView.as_view(), name="facture-create"),
    path("me/", ClientFactureListView.as_view(), name="client-factures"),
    path("admin-list/", AdminFactureListView.as_view(), name="admin-factures"),
    path("<int:pk>/payer/", FacturePaiementView.as_view(), name="facture-paiement"),
    path("admin-paiements/", AdminPaiementListView.as_view(), name="admin-paiements"),
]
