from django.db import models
from clients.models import Client

class Facture(models.Model):
    STATUS_CHOICES = (
        ("non_payee", "Non payée"),
        ("payee", "Payée"),
    )

    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="factures")
    titre = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    montant_htva = models.DecimalField(max_digits=10, decimal_places=2)
    tva = models.DecimalField(max_digits=10, decimal_places=2, default=21.00)  # TVA 21%
    montant_tvac = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    statut = models.CharField(max_length=20, choices=STATUS_CHOICES, default="non_payee")
    date_creation = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Calcul automatique du montant TVAC
        if self.montant_htva and self.tva:
            self.montant_tvac = self.montant_htva + (self.montant_htva * self.tva / 100)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Facture {self.id} - {self.client.user.username} - {self.statut}"


class Paiement(models.Model):
    facture = models.OneToOneField(Facture, on_delete=models.CASCADE, related_name="paiement")
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="paiements")
    methode = models.CharField(max_length=50, default="bancontact")  # Bancontact, carte, etc.
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    date_paiement = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Paiement {self.facture.id} - {self.client.user.username} - {self.methode}"
