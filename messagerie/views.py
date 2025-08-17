from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Message
from .serializers import MessageSerializer
from django.core.mail import send_mail
from django.conf import settings

# Envoyer un message
class MessageCreateView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(expediteur=self.request.user)

# Boîte de réception (messages reçus)
class MessageReceivedListView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(destinataire=self.request.user).order_by("-date_envoi")

# Boîte d’envoi (messages envoyés)
class MessageSentListView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(expediteur=self.request.user).order_by("-date_envoi")

# Marquer un message comme lu
class MessageMarkAsReadView(generics.UpdateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        message = self.get_object()
        if message.destinataire != request.user:
            return Response({"error": "Vous ne pouvez pas modifier ce message."}, status=status.HTTP_403_FORBIDDEN)

        message.lu = True
        message.save()
        return Response({"message": "Message marqué comme lu."}, status=status.HTTP_200_OK)

def perform_create(self, serializer):
    message = serializer.save(expediteur=self.request.user)

    # Envoi d’un email de notification
    send_mail(
        subject=f"Nouveau message : {message.sujet}",
        message=f"Vous avez reçu un nouveau message de {message.expediteur.username}.\n\nContenu : {message.contenu}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[message.destinataire.email],
        fail_silently=True,
    )
