from rest_framework import generics, status
from rest_framework.response import Response
from .models import Facture, Paiement
from .serializers import FactureSerializer, PaiementSerializer
from .permissions import IsAdmin, IsComptable, IsClient

# COMPTABLE : créer une facture
class FactureCreateView(generics.CreateAPIView):
    serializer_class = FactureSerializer
    permission_classes = [IsComptable]

# CLIENT : voir ses factures
class ClientFactureListView(generics.ListAPIView):
    serializer_class = FactureSerializer
    permission_classes = [IsClient]

    def get_queryset(self):
        return Facture.objects.filter(client__user=self.request.user)

# ADMIN : voir toutes les factures
class AdminFactureListView(generics.ListAPIView):
    queryset = Facture.objects.all()
    serializer_class = FactureSerializer
    permission_classes = [IsAdmin]

# CLIENT : payer une facture (simulation avec Bancontact)
class FacturePaiementView(generics.UpdateAPIView):
    queryset = Facture.objects.all()
    serializer_class = FactureSerializer
    permission_classes = [IsClient]

    def update(self, request, *args, **kwargs):
        facture = self.get_object()

        # Vérifie que la facture appartient au client connecté
        if facture.client.user != request.user:
            return Response({"error": "Vous ne pouvez payer que vos propres factures."}, status=403)

        # Vérifie si déjà payée
        if facture.statut == "payee":
            return Response({"error": "Facture déjà payée."}, status=400)

        # Change statut en payée
        facture.statut = "payee"
        facture.save()

        # Crée un paiement lié
        paiement = Paiement.objects.create(
            facture=facture,
            client=facture.client,
            methode=request.data.get("methode", "bancontact"),  # par défaut Bancontact
            montant=facture.montant_tvac
        )

        return Response({
            "message": f"Facture {facture.id} payée avec succès via {paiement.methode}.",
            "paiement": PaiementSerializer(paiement).data
        }, status=status.HTTP_200_OK)
    
class AdminPaiementListView(generics.ListAPIView):
    queryset = Paiement.objects.all().order_by("-date_paiement")
    serializer_class = PaiementSerializer
    permission_classes = [IsAdmin]
