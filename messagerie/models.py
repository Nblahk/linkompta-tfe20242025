from django.db import models
from users.models import User

class Message(models.Model):
    expediteur = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages_envoyes")
    destinataire = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages_recus")
    objet = models.CharField(max_length=255)
    contenu = models.TextField()
    est_lu = models.BooleanField(default=False)
    date_envoi = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"De {self.expediteur.username} à {self.destinataire.username} - {self.objet}"
