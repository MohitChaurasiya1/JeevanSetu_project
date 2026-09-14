from rest_framework import serializers
from .models import Feedback, ContactMessage


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = [
            'id',
            'full_name',
            'email',
            'phone',
            'message',
            'status',
            'admin_response',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'status',
            'admin_response',
            'created_at',
            'updated_at',
        ]