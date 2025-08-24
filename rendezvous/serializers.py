from rest_framework import serializers
from .models import RendezVous
from users.serializers import UserSerializer

class RendezVousSerializer(serializers.ModelSerializer):
    client = UserSerializer(read_only=True)
    comptable = UserSerializer(read_only=True)

    class Meta:
        model = RendezVous
        fields = ["id", "client", "comptable", "date", "motif", "statut", "date_creation"]
        read_only_fields = ["statut", "date_creation"]
