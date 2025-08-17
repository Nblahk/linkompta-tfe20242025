from rest_framework import serializers
from .models import Client, Dossier

class DossierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dossier
        fields = ["id", "name", "description", "created_at"]

class ClientSerializer(serializers.ModelSerializer):
    dossiers = DossierSerializer(many=True, read_only=True)

    class Meta:
        model = Client
        fields = ["id", "user", "phone", "address", "dossiers"]
