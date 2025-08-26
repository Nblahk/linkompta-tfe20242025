classDiagram
    class User {
        +int id
        +string username
        +string email
        +string first_name
        +string last_name
        +string role
        +authenticate()
    }

    class Client {
        +int id
        +string phone
        +string address
    }

    class Document {
        +int id
        +string title
        +file file
        +string status
        +datetime uploaded_at
    }

    class Facture {
        +int id
        +string titre
        +decimal montant_htva
        +decimal tva
        +decimal montant_tvac
        +string statut
    }

    class RendezVous {
        +int id
        +datetime date
        +string motif
        +string statut
    }

    class Message {
        +int id
        +string contenu
        +boolean lu
        +datetime date_envoi
    }

    User ||--o{ Client : profil
    User ||--o{ Client : comptable
    Client ||--o{ Document : possède
    Client ||--o{ Facture : reçoit
    User ||--o{ RendezVous : client
    User ||--o{ RendezVous : comptable
    User ||--o{ Message : expéditeur
    User ||--o{ Message : destinataire
