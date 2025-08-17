from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "expediteur", "destinataire", "sujet", "contenu", "date_envoi", "lu"]
        read_only_fields = ["expediteur", "date_envoi", "lu"]
