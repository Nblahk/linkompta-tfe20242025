from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Message
from .serializers import MessageSerializer

# Envoyer un message
class EnvoyerMessageView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(expediteur=self.request.user)


# Voir ses messages reçus
class MessagesRecusView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(destinataire=self.request.user).order_by("-date_envoi")


# Voir ses messages envoyés
class MessagesEnvoyesView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(expediteur=self.request.user).order_by("-date_envoi")


# Marquer un message comme lu
class MarquerCommeLuView(generics.UpdateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        message = self.get_object()
        if message.destinataire != request.user:
            return Response({"erreur": "Vous ne pouvez pas modifier ce message."}, status=status.HTTP_403_FORBIDDEN)

        message.est_lu = True
        message.save()
        return Response({"message": "Message marqué comme lu."}, status=status.HTTP_200_OK)
