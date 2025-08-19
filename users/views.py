from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
import os
from django.conf import settings
from rest_framework.permissions import IsAuthenticated

from .models import User
from .serializers import UserSerializer
from .permissions import IsAdmin, IsComptable, IsClient


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


# Vue accessible seulement par ADMIN
class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]


# Vue accessible seulement par COMPTABLE
class ComptableUserListView(generics.ListAPIView):
    queryset = User.objects.filter(role="client")  # un comptable ne voit que les clients
    serializer_class = UserSerializer
    permission_classes = [IsComptable]


# Vue accessible seulement par CLIENT
class ClientUserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsClient]

    def get_object(self):
        return self.request.user   # un client ne peut voir que son propre profil


# ADMIN : lecture des logs d’audit
class AdminAuditLogView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request, *args, **kwargs):
        log_file = settings.BASE_DIR / "logs/linkompta.log"

        if not os.path.exists(log_file):
            return Response({"error": "Aucun fichier de log trouvé."}, status=404)

        with open(log_file, "r", encoding="utf-8") as f:
            lignes = f.readlines()

        # Retourne uniquement les 200 dernières lignes pour éviter de surcharger
        return Response({
            "audit_logs": lignes[-200:]
        })
    
    
class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class ComptableAuditLogView(APIView):
    permission_classes = [IsComptable]

    def get(self, request, *args, **kwargs):
        log_file = settings.BASE_DIR / "logs/linkompta.log"

        if not os.path.exists(log_file):
            return Response({"error": "Aucun fichier de log trouvé."}, status=404)

        with open(log_file, "r", encoding="utf-8") as f:
            lignes = f.readlines()

        # Filtrer uniquement les logs liés aux clients de ce comptable
        filtered_logs = []
        for ligne in lignes:
            for client in request.user.comptable_clients.all():  # relation Comptable -> Clients
                if client.user.username in ligne:
                    filtered_logs.append(ligne)

        return Response({
            "audit_logs": filtered_logs[-200:]  # Limiter à 200 dernières lignes
        })
    
