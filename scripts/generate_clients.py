import os
import sys
import django
from pathlib import Path

# Configurer Django
sys.path.append(str(Path(__file__).parent.parent))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

import json
import random
from faker import Faker
from django.contrib.auth.hashers import make_password

# Initialiser Faker avec locale française
fake = Faker(['fr_FR'])

# Liste pour stocker toutes les données
data = []

# Générer l'admin s'il n'existe pas déjà
admin_data = {
    "model": "users.user",
    "pk": 1,
    "fields": {
        "password": make_password("admin"),
        "username": "admin",
        "email": "admin@admin.com",
        "first_name": "Admin",
        "last_name": "User",
        "role": "admin",
        "is_active": True,
        "is_staff": True,
        "is_superuser": True
    }
}
data.append(admin_data)

# Générer 150 clients
for i in range(2, 152):  # On commence à 2 car 1 est réservé pour l'admin
    # Générer un utilisateur
    first_name = fake.first_name()
    last_name = fake.last_name()
    username = f"{first_name.lower()}.{last_name.lower()}"
    email = f"{username}@{fake.free_email_domain()}"
    
    user_data = {
        "model": "users.user",
        "pk": i,
        "fields": {
            "password": make_password("password123"),  # Mot de passe par défaut
            "username": username,
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "role": "client",
            "is_active": True,
            "is_staff": False,
            "is_superuser": False
        }
    }
    
    # Générer un client lié à l'utilisateur
    client_data = {
        "model": "clients.client",
        "pk": i-1,  # PK du client commence à 1
        "fields": {
            "user": i,  # Lien vers l'utilisateur
            "phone": fake.phone_number(),
            "address": fake.address().replace('\n', ', ')
        }
    }
    
    # Ajouter les données
    data.append(user_data)
    data.append(client_data)

# Écrire les données dans le fichier JSON
with open('clients/fixtures/clients.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
