from django.shortcuts import render
from rest_framework import generics
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

# COMPTABLE : voir tous les documents de ses clients (simplifié: tous les clients pour l'instant)
class ComptableDocumentListView(generics.ListAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsComptable]

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
    
