# Diagrammes PlantUML - Linkompta

Ce dossier contient les diagrammes PlantUML 2.0 de l'application Linkompta pour le rapport de TFE.

## 📋 Liste des diagrammes

### 1. `Linkompta_Diagramme_Utilisation.puml`
**Diagramme de cas d'utilisation global**
- Vue d'ensemble de tous les acteurs (Client, Comptable, Administrateur)
- Tous les cas d'usage organisés par modules fonctionnels
- Relations include/extend entre les cas d'usage
- Parfait pour la section "Analyse fonctionnelle" du TFE

### 2. `Linkompta_Workflow_Principal.puml`
**Workflow principal des processus métier**
- Séquences d'interactions entre Client et Comptable
- Flux de gestion documentaire
- Processus de facturation et rendez-vous
- Idéal pour expliquer les processus métier

### 3. `Linkompta_Architecture_Technique.puml`
**Architecture technique du système**
- Stack technologique (React + Django + Base de données)
- Composants frontend et backend
- Relations entre les couches
- Parfait pour la section "Architecture technique"

### 4. `Linkompta_Sequence_Document.puml`
**Diagramme de séquence détaillé**
- Cas d'usage complet : upload et traitement d'un document
- Interactions entre tous les composants
- Authentification JWT et sécurité
- Excellent pour illustrer un scénario concret

## 🛠️ Utilisation

Pour générer les diagrammes :

1. **En ligne** : Copiez le contenu dans [PlantUML Online](http://www.plantuml.com/plantuml)
2. **VS Code** : Installez l'extension PlantUML
3. **Local** : Utilisez PlantUML en ligne de commande

## 📊 Statistiques du projet

### Technologies utilisées
- **Backend** : Django 5.2.5 + Django REST Framework
- **Frontend** : React 18 + Axios
- **Base de données** : SQLite (dev) / PostgreSQL (prod)
- **Authentification** : JWT Bearer tokens
- **Sécurité** : Permissions par rôles

### Fonctionnalités implémentées
- ✅ Authentification multi-rôles (Client/Comptable/Admin)
- ✅ Gestion documentaire avec statuts
- ✅ Facturation avec calcul TVA automatique
- ✅ Système de rendez-vous
- ✅ Messagerie interne sécurisée
- ✅ Interface d'administration complète
- ✅ Assignment automatique clients-comptables

### Données de test
- **21 comptables** générés automatiquement
- **151 clients** répartis équitablement
- **Utilisateurs de test** :
  - Comptable : `comptable.paul.dupont` / `password123`
  - Cliente : `sophie.merle` / `password123`

## 📝 Conseils pour le rapport TFE

1. **Introduction** : Utilisez le diagramme d'utilisation pour présenter la portée
2. **Analyse** : Le workflow principal illustre les processus métier
3. **Conception** : L'architecture technique montre les choix technologiques
4. **Implémentation** : Le diagramme de séquence détaille la réalisation

Ces diagrammes respectent les standards UML et PlantUML 2.0, parfaits pour un rapport académique professionnel.
