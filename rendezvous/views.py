from rest_framework import generics, status
from rest_framework.response import Response
from .models import RendezVous
from .serializers import RendezVousSerializer
from users.permissions import IsAdmin, IsComptable, IsClient

# CLIENT : demander un rendez-vous
class RendezVousCreateView(generics.CreateAPIView):
    serializer_class = RendezVousSerializer
    permission_classes = [IsClient]

    def perform_create(self, serializer):
        # Le client est pris automatiquement depuis son profil
        serializer.save(
            client=self.request.user.client_profile,
            comptable=self.request.user.client_profile.comptable
        )

# CLIENT : voir ses demandes
class ClientRendezVousListView(generics.ListAPIView):
    serializer_class = RendezVousSerializer
    permission_classes = [IsClient]

    def get_queryset(self):
        return RendezVous.objects.filter(client__user=self.request.user).order_by("-date_creation")

# COMPTABLE : voir les demandes reçues
class ComptableRendezVousListView(generics.ListAPIView):
    serializer_class = RendezVousSerializer
    permission_classes = [IsComptable]

    def get_queryset(self):
        return RendezVous.objects.filter(comptable=self.request.user).order_by("-date_creation")

# COMPTABLE : accepter/refuser une demande
class ComptableRendezVousUpdateView(generics.UpdateAPIView):
    queryset = RendezVous.objects.all()
    serializer_class = RendezVousSerializer
    permission_classes = [IsComptable]

    def update(self, request, *args, **kwargs):
        rdv = self.get_object()

        if rdv.comptable != request.user:
            return Response(
                {"error": "Vous ne pouvez pas modifier ce rendez-vous."},
                status=status.HTTP_403_FORBIDDEN
            )

        new_status = request.data.get("statut")
        if new_status not in ["accepte", "refuse"]:
            return Response(
                {"error": "Statut invalide (accepte/refuse seulement)."},
                status=status.HTTP_400_BAD_REQUEST
            )

        rdv.statut = new_status
        rdv.motif = request.data.get("motif", rdv.motif)  # possibilité de modifier le motif
        rdv.save()

        return Response({"message": f"Rendez-vous mis à jour : {new_status}"}, status=status.HTTP_200_OK)

# ADMIN : voir tous les rendez-vous
class AdminRendezVousListView(generics.ListAPIView):
    queryset = RendezVous.objects.all().order_by("-date_creation")
    serializer_class = RendezVousSerializer
    permission_classes = [IsAdmin]
