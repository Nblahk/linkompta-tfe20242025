from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Document
from .serializers import DocumentSerializer
from .permissions import IsAdmin, IsComptable, IsClient
import magic  # Pour détecter le type MIME
import os

# CLIENT : uploader un document
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
import os
import magic  # Pour détecter le type MIME

class DocumentUploadView(generics.CreateAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsClient]
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        file_obj = self.request.FILES.get('file')
        if not file_obj:
            raise ValidationError({"file": "Un fichier est requis"})
        
        # Vérifier la taille du fichier (max 10MB)
        if file_obj.size > 10 * 1024 * 1024:
            raise ValidationError({"file": "Le fichier est trop volumineux (max 10MB)"})
        
        # Vérifier le type de fichier
        mime = magic.from_buffer(file_obj.read(1024), mime=True)
        file_obj.seek(0)  # Remettre le curseur au début
        
        allowed_types = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        
        if mime not in allowed_types:
            raise ValidationError({"file": "Type de fichier non autorisé"})

        try:
            client_profile = self.request.user.client_profile
        except:
            raise ValidationError({
                "error": "Utilisateur non associé à un profil client. Veuillez contacter votre administrateur."
            })

        serializer.save(
            client=client_profile,
            status="envoye",
            file_type=mime,
            file_size=file_obj.size
        )


# CLIENT : voir ses propres documents
class ClientDocumentListView(generics.ListAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsClient]

    def get_queryset(self):
        return Document.objects.filter(client__user=self.request.user)


# COMPTABLE : voir seulement les documents de ses clients
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

        # Vérifie que le document appartient bien à un client du comptable
        if document.client.comptable != request.user:
            return Response({"error": "Vous ne pouvez pas modifier ce document."}, status=status.HTTP_403_FORBIDDEN)

        new_status = request.data.get("status")
        if new_status not in ["recu", "en_cours", "traite"]:
            return Response(
                {"error": "Statut invalide. Utilisez : recu, en_cours, traite"},
                status=status.HTTP_400_BAD_REQUEST
            )

        document.status = new_status
        document.save()

        return Response(
            {"message": f"Statut du document '{document.titre}' mis à jour en {new_status}."}
        )
