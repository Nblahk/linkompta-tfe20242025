from django.db import models
from users.models import User

class RendezVous(models.Model):
    STATUS_CHOICES = (
        ("en_attente", "En attente"),
        ("accepte", "Accepté"),
        ("refuse", "Refusé"),
    )

    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name="rendezvous_demandes")
    comptable = models.ForeignKey(User, on_delete=models.CASCADE, related_name="rendezvous_recus")
    date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="en_attente")
    commentaire = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"RDV {self.client.username} avec {self.comptable.username} - {self.status}"
