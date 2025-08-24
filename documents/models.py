from django.db import models
from clients.models import Client

def document_file_path(instance, filename):
    # Générer le chemin : media/documents/client_id/filename
    from datetime import datetime
    now = datetime.now()
    return f'documents/client_{instance.client.id}/{now.strftime("%Y-%m")}/{filename}'

class Document(models.Model):
    STATUS_CHOICES = (
        ("envoye", "Envoyé"),
        ("recu", "Reçu"),
        ("en_cours", "En cours de traitement"),
        ("traite", "Traité"),
    )

    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="documents")
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to=document_file_path)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="envoye")
    file_type = models.CharField(max_length=50, blank=True)  # Pour stocker le type MIME
    file_size = models.IntegerField(default=0)  # Taille en bytes

    def __str__(self):
        return f"{self.title} ({self.client.user.username})"
