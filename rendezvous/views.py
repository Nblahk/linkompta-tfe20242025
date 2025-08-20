from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import RendezVous
from .serializers import RendezVousSerializer
from users.permissions import IsAdmin, IsComptable, IsClient

# CLIENT : demander un rendez-vous
class RendezVousCreateView(generics.CreateAPIView):
    serializer_class = RendezVousSerializer
    permission_classes = [IsClient]

    def perform_create(self, serializer):
        # On assigne automatiquement le comptable du client
        serializer.save(client=self.request.user, comptable=self.request.user.client_profile.comptable)


# CLIENT : voir ses demandes
class RendezVousClientListView(generics.ListAPIView):
    serializer_class = RendezVousSerializer
    permission_classes = [IsClient]

    def get_queryset(self):
        return RendezVous.objects.filter(client=self.request.user).order_by("-created_at")


# COMPTABLE : voir les demandes de ses clients
class RendezVousComptableListView(generics.ListAPIView):
    serializer_class = RendezVousSerializer
    permission_classes = [IsComptable]

    def get_queryset(self):
        return RendezVous.objects.filter(comptable=self.request.user).order_by("-created_at")


# COMPTABLE : accepter/refuser une demande
class RendezVousUpdateStatusView(generics.UpdateAPIView):
    queryset = RendezVous.objects.all()
    serializer_class = RendezVousSerializer
    permission_classes = [IsComptable]

    def update(self, request, *args, **kwargs):
        rdv = self.get_object()

        if rdv.comptable != request.user:
            return Response({"error": "Vous ne pouvez pas modifier ce rendez-vous."}, status=status.HTTP_403_FORBIDDEN)

        new_status = request.data.get("status")
        if new_status not in ["accepte", "refuse"]:
            return Response({"error": "Statut invalide (accepte/refuse seulement)."}, status=status.HTTP_400_BAD_REQUEST)

        rdv.status = new_status
        rdv.commentaire = request.data.get("commentaire", "")
        rdv.save()

        return Response({"message": f"Rendez-vous mis à jour : {new_status}"}, status=status.HTTP_200_OK)


# ADMIN : voir tous les rendez-vous
class AdminRendezVousListView(generics.ListAPIView):
    queryset = RendezVous.objects.all().order_by("-created_at")
    serializer_class = RendezVousSerializer
    permission_classes = [IsAdmin]
