import os
import sys
import django
from pathlib import Path

# Configurer Django
sys.path.append(str(Path(__file__).parent))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

import random
from users.models import User
from clients.models import Client
from django.db import transaction

def redistribute_clients():
    """Redistribuer les clients de manière plus équitable"""
    
    # Récupérer tous les comptables
    comptables = list(User.objects.filter(role="comptable"))
    print(f"Nombre de comptables: {len(comptables)}")
    
    # Récupérer tous les clients
    all_clients = list(Client.objects.all())
    print(f"Nombre total de clients: {len(all_clients)}")
    
    # Calculer la distribution idéale
    clients_par_comptable = len(all_clients) // len(comptables)
    clients_restants = len(all_clients) % len(comptables)
    
    print(f"Distribution idéale: {clients_par_comptable} clients par comptable")
    print(f"Clients restants à distribuer: {clients_restants}")
    print()
    
    # Mélanger les listes pour une distribution aléatoire
    random.shuffle(comptables)
    random.shuffle(all_clients)
    
    # Distribuer les clients
    client_index = 0
    
    for i, comptable in enumerate(comptables):
        # Calculer le nombre de clients pour ce comptable
        nb_clients = clients_par_comptable
        if i < clients_restants:  # Distribuer les clients restants
            nb_clients += 1
        
        print(f"👨‍💼 {comptable.first_name} {comptable.last_name} recevra {nb_clients} clients:")
        
        # Assigner les clients
        for j in range(nb_clients):
            if client_index < len(all_clients):
                client = all_clients[client_index]
                client.comptable = comptable
                client.save()
                print(f"   - {client.user.first_name} {client.user.last_name}")
                client_index += 1
        print()
    
    print(f"✅ Distribution terminée! {client_index} clients redistribués.")

if __name__ == "__main__":
    print("=== REDISTRIBUTION ÉQUITABLE DES CLIENTS ===")
    print()
    
    with transaction.atomic():
        redistribute_clients()
    
    print("\n=== VÉRIFICATION DE LA NOUVELLE DISTRIBUTION ===")
    
    # Vérifier la nouvelle distribution
    comptables = User.objects.filter(role='comptable')
    for comptable in comptables:
        clients_count = Client.objects.filter(comptable=comptable).count()
        print(f"{comptable.first_name} {comptable.last_name}: {clients_count} clients")
    
    print("\nRedistribution terminée avec succès !")
