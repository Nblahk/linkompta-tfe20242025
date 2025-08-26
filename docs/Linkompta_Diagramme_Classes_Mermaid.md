```mermaid
classDiagram
    %% Diagramme de classes - Linkompta
    %% Application de gestion comptable

    %% Classe User (utilisateur principal)
    class User {
        +int id
        +string username
        +string email
        +string first_name
        +string last_name
        +string role
        +string company_name
        +boolean is_active
        +boolean is_staff
        +boolean is_superuser
        +datetime date_joined
        +authenticate()
        +set_password()
        +check_password()
        +get_full_name()
    }

    %% Classe Client
    class Client {
        +int id
        +string phone
        +string address
        +datetime created_at
        +get_documents()
        +get_factures()
        +get_rendezvous()
    }

    %% Classe Document
    class Document {
        +int id
        +string title
        +file file
        +int file_size
        +string file_type
        +datetime uploaded_at
        +string status
        +update_status()
        +get_file_url()
        +format_file_size()
    }

    %% Classe Facture
    class Facture {
        +int id
        +string titre
        +string description
        +decimal montant_htva
        +decimal tva
        +decimal montant_tvac
        +string statut
        +datetime date_creation
        +calculate_montant_tvac()
        +update_statut()
        +generate_pdf()
    }

    %% Classe RendezVous
    class RendezVous {
        +int id
        +datetime date
        +string motif
        +string statut
        +datetime date_creation
        +accept()
        +refuse()
        +mark_completed()
    }

    %% Classe Message
    class Message {
        +int id
        +string contenu
        +boolean lu
        +datetime date_envoi
        +mark_as_read()
        +get_recipients()
    }

    %% Classe Dossier
    class Dossier {
        +int id
        +string name
        +string description
        +datetime created_at
        +add_document()
        +get_documents()
    }

    %% Relations principales

    %% User hérite des fonctionnalités Django AbstractUser
    User ||--o{ Client : "1..* (has profile)"
    User ||--o{ Message : "1..* (sends)"
    User ||--o{ Message : "1..* (receives)"
    User ||--o{ RendezVous : "1..* (comptable)"
    User ||--o{ RendezVous : "1..* (client)"

    %% Client est lié aux autres entités
    Client ||--o{ Document : "1..* (uploads)"
    Client ||--o{ Facture : "1..* (receives)"
    Client ||--o{ Dossier : "1..* (owns)"
    Client }o--|| User : "belongs to (comptable)"

    %% Document appartient à un client et un dossier
    Document }o--|| Client : "belongs to"
    Document }o--o| Dossier : "belongs to"

    %% Facture appartient à un client
    Facture }o--|| Client : "issued to"

    %% RendezVous lie client et comptable
    RendezVous }o--|| User : "client"
    RendezVous }o--|| User : "comptable"

    %% Message lie expéditeur et destinataire
    Message }o--|| User : "expediteur"
    Message }o--|| User : "destinataire"

    %% Dossier contient des documents
    Dossier ||--o{ Document : "1..* (contains)"

    %% Notes sur les énumérations
    class DocumentStatus {
        <<enumeration>>
        ENVOYE
        RECU
        EN_COURS
        TRAITE
    }

    class FactureStatut {
        <<enumeration>>
        EN_ATTENTE
        PAYEE
        ANNULEE
    }

    class RendezVousStatut {
        <<enumeration>>
        EN_ATTENTE
        ACCEPTE
        REFUSE
        TERMINE
    }

    class UserRole {
        <<enumeration>>
        CLIENT
        COMPTABLE
        ADMIN
    }

    %% Associations avec les énumérations
    Document --> DocumentStatus : status
    Facture --> FactureStatut : statut
    RendezVous --> RendezVousStatut : statut
    User --> UserRole : role
```
