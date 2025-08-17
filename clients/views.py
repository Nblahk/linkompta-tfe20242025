from django.shortcuts import render
from rest_framework import generics
from .models import Client, Dossier
from .serializers import ClientSerializer, DossierSerializer
from .permissions import IsAdmin, IsComptable, IsClient

# ADMIN : voir tous les clients
class AdminClientListView(generics.ListAPIView):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [IsAdmin]

# COMPTABLE : voir uniquement ses propres clients
class ComptableClientListView(generics.ListAPIView):
    serializer_class = ClientSerializer
    permission_classes = [IsComptable]

    def get_queryset(self):
        return Client.objects.filter(comptable=self.request.user)

# CLIENT : voir son propre profil
class ClientDetailView(generics.RetrieveAPIView):
    serializer_class = ClientSerializer
    permission_classes = [IsClient]

    def get_object(self):
        return Client.objects.get(user=self.request.user)

# CLIENT : voir ses dossiers
class ClientDossierListView(generics.ListAPIView):
    serializer_class = DossierSerializer
    permission_classes = [IsClient]

    def get_queryset(self):
        return Dossier.objects.filter(client__user=self.request.user)
