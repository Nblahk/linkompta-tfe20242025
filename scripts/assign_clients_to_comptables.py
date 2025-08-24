import os
import sys
import django
from pathlib import Path

# Configurer Django
sys.path.append(str(Path(__file__).parent.parent))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

import random
from users.models import User
from django.db import transaction

# Fonction pour obtenir ou créer les utilisateurs Sophie et Paul
def ensure_sophie_and_paul():
    from clients.models import Client
    
    # Créer ou mettre à jour Paul le comptable
    paul, _ = User.objects.update_or_create(
        username="comptable.paul.dupont",
        defaults={
            "email": "comptable.paul.dupont@linkompta.com",
            "first_name": "Paul",
            "last_name": "Dupont",
            "role": "comptable",
            "is_active": True,
            "is_staff": True,
            "is_superuser": False
        }
    )
    
    # Créer ou mettre à jour Sophie la cliente
    sophie, created_sophie = User.objects.update_or_create(
        username="sophie.merle",
        defaults={
            "email": "sophie.merle@example.com",
            "first_name": "Sophie",
            "last_name": "Merle",
            "role": "client",
            "is_active": True,
            "is_staff": False,
            "is_superuser": False
        }
    )
    
    # Créer le profil client pour Sophie si nécessaire
    Client.objects.get_or_create(
        user=sophie,
        defaults={
            'phone': '0123456789',
            'address': '123 rue des Clients, 75000 Paris'
        }
    )
    
    return paul, sophie

def assign_clients_to_comptables():
    # Obtenir Paul et Sophie
    paul, sophie = ensure_sophie_and_paul()
    
    # Récupérer tous les comptables (sauf Paul qui est déjà géré)
    comptables = list(User.objects.filter(role="comptable").exclude(id=paul.id))
    
    # Récupérer tous les clients (sauf Sophie qui est déjà gérée)
    clients = list(User.objects.filter(role="client").exclude(id=sophie.id))
    
    # Assigner Sophie à Paul
    sophie.client_profile.comptable = paul
    sophie.client_profile.save()
    print(f"Sophie Merle a été assignée à Paul le comptable")
    
    # Mélanger les clients pour une distribution aléatoire
    random.shuffle(clients)
    
    # Distribuer les clients restants aux comptables
    for i, client in enumerate(clients):
        # Sélectionner un comptable au hasard
        comptable = random.choice(comptables)
        
        # Assigner le client au comptable
        client.client_profile.comptable = comptable
        client.client_profile.save()
        
        print(f"Client {client.username} assigné à {comptable.username}")

if __name__ == "__main__":
    with transaction.atomic():
        assign_clients_to_comptables()
    print("\nAssignation terminée avec succès !")
