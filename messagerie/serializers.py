from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    expediteur_nom = serializers.CharField(source="expediteur.username", read_only=True)
    destinataire_nom = serializers.CharField(source="destinataire.username", read_only=True)

    class Meta:
        model = Message
        fields = [
            "id",
            "expediteur", "expediteur_nom",
            "destinataire", "destinataire_nom",
            "objet", "contenu",
            "est_lu", "date_envoi"
        ]
        read_only_fields = ["expediteur", "est_lu", "date_envoi"]
