from rest_framework import serializers
from .models import Document
from clients.serializers import ClientSerializer

class DocumentSerializer(serializers.ModelSerializer):
    client = ClientSerializer(read_only=True)
    file_size = serializers.SerializerMethodField()
    file_type = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = ["id", "title", "file", "file_size", "file_type", "uploaded_at", "status", "client"]
        read_only_fields = ["uploaded_at", "status", "client", "file_size", "file_type"]

    def get_file_size(self, obj):
        if obj.file:
            return obj.file.size
        return 0

    def get_file_type(self, obj):
        if obj.file:
            return obj.file.name.split('.')[-1].upper()
        return "N/A"
