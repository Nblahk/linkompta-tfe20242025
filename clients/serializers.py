from rest_framework import serializers
from .models import Client, Dossier
from users.serializers import UserSerializer

class DossierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dossier
        fields = ["id", "name", "description", "created_at"]

class ClientSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    dossiers = DossierSerializer(many=True, read_only=True)

    class Meta:
        model = Client
        fields = ["id", "user", "phone", "address", "dossiers"]

class ClientProfileSerializer(serializers.ModelSerializer):
    # Champs du User
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    email = serializers.EmailField(source='user.email')
    
    # Champs du Client  
    phone = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Client
        fields = ["first_name", "last_name", "email", "phone", "address"]

    def update(self, instance, validated_data):
        # Extraire les données User
        user_data = validated_data.pop('user', {})
        
        # Mettre à jour les champs User
        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()
        
        # Mettre à jour les champs Client
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance
