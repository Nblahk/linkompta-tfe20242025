from django.urls import path
from .views import (
    FactureCreateView,
    ClientFactureListView,
    ComptableFactureListView,
    AdminFactureListView,
    FacturePaiementView,
    AdminPaiementListView,
)

urlpatterns = [
    path("create/", FactureCreateView.as_view(), name="facture-create"),
    path("me/", ClientFactureListView.as_view(), name="client-factures"),
    path("comptable/", ComptableFactureListView.as_view(), name="comptable-factures"),
    path("admin/", AdminFactureListView.as_view(), name="admin-factures"),
    path("<int:pk>/payer/", FacturePaiementView.as_view(), name="facture-payer"),
    path("admin/paiements/", AdminPaiementListView.as_view(), name="admin-paiements"),
]
