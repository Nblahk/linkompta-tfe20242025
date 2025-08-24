from rest_framework import serializers
from .models import Facture, Paiement
from clients.serializers import ClientSerializer

class FactureSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)

    class Meta:
        model = Facture
        fields = [
            "id", "client", "titre", "description",
            "montant_htva", "tva", "montant_tvac",
            "statut", "date_creation"
        ]
        read_only_fields = ["montant_tvac", "date_creation"]

class PaiementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paiement
        fields = ["id", "facture", "client", "methode", "montant", "date_paiement"]
        read_only_fields = ["date_paiement"]
