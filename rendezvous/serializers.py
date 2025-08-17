from rest_framework import serializers
from .models import RendezVous

class RendezVousSerializer(serializers.ModelSerializer):
    class Meta:
        model = RendezVous
        fields = ["id", "client", "comptable", "date", "status", "commentaire", "created_at"]
        read_only_fields = ["status", "created_at"]
