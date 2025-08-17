from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    # Champs affichés dans la liste des utilisateurs
    list_display = ("username", "email", "role", "is_staff", "is_active")

    # Champs pour la recherche
    search_fields = ("username", "email", "role")

    # Champs éditables dans le formulaire Admin
    fieldsets = UserAdmin.fieldsets + (
        (None, {"fields": ("role", "company_name")}),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {"fields": ("role", "company_name")}),
    )

# Enregistrer le modèle User avec la config personnalisée
admin.site.register(User, CustomUserAdmin)
