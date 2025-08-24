import os
import sys
import django
from pathlib import Path

# Configurer Django
sys.path.append(str(Path(__file__).parent))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User
from django.contrib.auth.hashers import make_password

print("=== MISE À JOUR DU MOT DE PASSE DE PAUL ===")

try:
    # Récupérer Paul
    paul = User.objects.get(username="comptable.paul.dupont")
    
    # Définir le mot de passe
    paul.set_password("password123")
    paul.save()
    
    print(f"✅ Mot de passe mis à jour pour Paul Dupont")
    print(f"   Username: {paul.username}")
    print(f"   Email: {paul.email}")
    print(f"   Nouveau mot de passe: password123")
    
    # Vérifier que le mot de passe fonctionne
    if paul.check_password("password123"):
        print("✅ Vérification du mot de passe: OK")
    else:
        print("❌ Erreur lors de la vérification du mot de passe")
        
except User.DoesNotExist:
    print("❌ Utilisateur Paul non trouvé")
except Exception as e:
    print(f"❌ Erreur: {e}")

print("\n=== MISE À JOUR DU MOT DE PASSE DE SOPHIE ===")

try:
    # Récupérer Sophie
    sophie = User.objects.get(username="sophie.merle")
    
    # Définir le mot de passe
    sophie.set_password("password123")
    sophie.save()
    
    print(f"✅ Mot de passe mis à jour pour Sophie Merle")
    print(f"   Username: {sophie.username}")
    print(f"   Email: {sophie.email}")
    print(f"   Nouveau mot de passe: password123")
    
    # Vérifier que le mot de passe fonctionne
    if sophie.check_password("password123"):
        print("✅ Vérification du mot de passe: OK")
    else:
        print("❌ Erreur lors de la vérification du mot de passe")
        
except User.DoesNotExist:
    print("❌ Utilisatrice Sophie non trouvée")
except Exception as e:
    print(f"❌ Erreur: {e}")

print("\n=== INFORMATIONS DE CONNEXION FINALES ===")
print("Username Paul: comptable.paul.dupont")
print("Username Sophie: sophie.merle")
print("Mot de passe pour les deux: password123")
