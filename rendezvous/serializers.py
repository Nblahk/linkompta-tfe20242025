from rest_framework import serializers
from .models import RendezVous

class RendezVousSerializer(serializers.ModelSerializer):
    class Meta:
        model = RendezVous
        fields = ["id", "client", "comptable", "date", "motif", "statut", "date_creation"]
        read_only_fields = ["statut", "date_creation"]
