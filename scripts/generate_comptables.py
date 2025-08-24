import os
import sys
import django
from pathlib import Path

# Configurer Django
sys.path.append(str(Path(__file__).parent.parent))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

import json
from faker import Faker
from django.contrib.auth.hashers import make_password

# Initialiser Faker avec locale française
fake = Faker(['fr_FR'])

# Liste pour stocker toutes les données
data = []

# On commence à partir de l'ID 152 (après les 150 clients + 1 admin)
start_id = 152

# Générer 20 comptables
for i in range(start_id, start_id + 20):
    first_name = fake.first_name()
    last_name = fake.last_name()
    username = f"comptable.{first_name.lower()}.{last_name.lower()}"
    email = f"{username}@linkompta.com"
    
    # Données de l'utilisateur comptable
    user_data = {
        "model": "users.user",
        "pk": i,
        "fields": {
            "password": make_password("Comptable123!"),  # Mot de passe par défaut
            "username": username,
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "role": "comptable",
            "is_active": True,
            "is_staff": True,  # Les comptables ont accès à l'admin
            "is_superuser": False
        }
    }
    data.append(user_data)

# Créer le dossier fixtures s'il n'existe pas
os.makedirs('users/fixtures', exist_ok=True)

# Écrire les données dans le fichier JSON
with open('users/fixtures/comptables.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"20 comptables générés avec succès dans users/fixtures/comptables.json")
print("Format des noms d'utilisateur : comptable.prenom.nom")
print("Mot de passe par défaut : Comptable123!")
