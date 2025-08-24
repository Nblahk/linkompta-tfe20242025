from django.db import models
from users.models import User

class Client(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="client_profile")
    comptable = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="clients_assignes", limit_choices_to={'role': 'comptable'})
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Client: {self.user.username}"

class Dossier(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="dossiers")
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Dossier: {self.name} ({self.client.user.username})"
