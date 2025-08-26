import os
import sys
import django
from pathlib import Path

# Configurer Django
sys.path.append(str(Path(__file__).parent))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User
from clients.models import Client
from django.db import transaction

def reassign_sophie_to_paul():
    """Réassigner Sophie Merle à Paul Dupont comme demandé initialement"""
    
    try:
        # Récupérer Paul et Sophie
        paul = User.objects.get(username="comptable.paul.dupont")
        sophie_user = User.objects.get(username="sophie.merle")
        sophie_client = Client.objects.get(user=sophie_user)
        
        # Récupérer le comptable actuel de Sophie
        ancien_comptable = sophie_client.comptable
        
        print(f"Sophie Merle est actuellement assignée à: {ancien_comptable.first_name} {ancien_comptable.last_name}")
        print(f"Réassignation à Paul Dupont...")
        
        # Réassigner Sophie à Paul
        sophie_client.comptable = paul
        sophie_client.save()
        
        print(f"✅ Sophie Merle est maintenant assignée à Paul Dupont")
        
        # Afficher le résumé final
        paul_clients = Client.objects.filter(comptable=paul)
        print(f"\nClients de Paul Dupont ({paul_clients.count()} clients):")
        for i, client in enumerate(paul_clients, 1):
            print(f"  {i}. {client.user.first_name} {client.user.last_name} ({client.user.username})")
        
        ancien_comptable_clients = Client.objects.filter(comptable=ancien_comptable)
        print(f"\nClients restants pour {ancien_comptable.first_name} {ancien_comptable.last_name} ({ancien_comptable_clients.count()} clients):")
        for i, client in enumerate(ancien_comptable_clients, 1):
            print(f"  {i}. {client.user.first_name} {client.user.last_name} ({client.user.username})")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    print("=== RÉASSIGNATION DE SOPHIE À PAUL ===")
    print()
    
    with transaction.atomic():
        reassign_sophie_to_paul()
    
    print("\nRéassignation terminée avec succès !")
