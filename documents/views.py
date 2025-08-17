from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Document
from .serializers import DocumentSerializer
from .permissions import IsAdmin, IsComptable, IsClient

# CLIENT : uploader un document
class DocumentUploadView(generics.CreateAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsClient]

    def perform_create(self, serializer):
        serializer.save(client=self.request.user.client_profile, status="envoye")

# CLIENT : voir ses propres documents
class ClientDocumentListView(generics.ListAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsClient]

    def get_queryset(self):
        return Document.objects.filter(client__user=self.request.user)

# COMPTABLE : voir uniquement les documents de SES clients
class ComptableDocumentListView(generics.ListAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsComptable]

    def get_queryset(self):
        return Document.objects.filter(client__comptable=self.request.user)

# ADMIN : voir tous les documents
class AdminDocumentListView(generics.ListAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAdmin]

# COMPTABLE : mise à jour du statut d’un document
class ComptableDocumentUpdateStatusView(generics.UpdateAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsComptable]

    def update(self, request, *args, **kwargs):
        document = self.get_object()

        # Vérifie que le document appartient bien à un client du comptable connecté
        if document.client.comptable != request.user:
            return Response(
                {"error": "Vous ne pouvez modifier que les documents de vos propres clients."},
                status=status.HTTP_403_FORBIDDEN
            )

        new_status = request.data.get("status")

        if new_status not in ["recu", "en_cours", "traite"]:
            return Response(
                {"error": "Statut invalide. Utilise: recu, en_cours, traite"},
                status=status.HTTP_400_BAD_REQUEST
            )

        document.status = new_status
        document.save()

        return Response(
            {"message": f"Statut du document '{document.title}' mis à jour en {new_status}."}
        )