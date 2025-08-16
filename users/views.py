from django.shortcuts import render
from rest_framework import generics
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
