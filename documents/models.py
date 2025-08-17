from django.db import models
from clients.models import Client

class Document(models.Model):
    STATUS_CHOICES = (
        ("envoye", "Envoyé"),
        ("recu", "Reçu"),
        ("en_cours", "En cours de traitement"),
        ("traite", "Traité"),
    )

    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="documents")
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to="documents/")  # stockage local (plus tard: S3, etc.)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="envoye")

    def __str__(self):
        return f"{self.title} ({self.client.user.username})"
