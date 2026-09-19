import re
from rest_framework import serializers
from .models import Feedback, ContactMessage

PHONE_REGEX = re.compile(r'^[+\d][\d\s\-().]{6,19}$')


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']


class ContactMessageSerializer(serializers.ModelSerializer):
    """
    Public serializer for anonymous contact message submissions.
    Ensures status and admin_response cannot be manipulated by public users.
    """
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

    def validate_full_name(self, value):
        name = (value or '').strip()
        if not name:
            raise serializers.ValidationError("Full name is required.")
        if len(name) < 2:
            raise serializers.ValidationError("Full name must be at least 2 characters.")
        return name

    def validate_email(self, value):
        email = (value or '').strip()
        if not email:
            raise serializers.ValidationError("Email address is required.")
        return email

    def validate_phone(self, value):
        if not value:
            return ''
        phone = value.strip()
        if phone and not PHONE_REGEX.match(phone):
            raise serializers.ValidationError("Please enter a valid phone number.")
        return phone

    def validate_message(self, value):
        msg = (value or '').strip()
        if not msg:
            raise serializers.ValidationError("Message is required.")
        if len(msg) < 10:
            raise serializers.ValidationError("Message must be at least 10 characters.")
        return msg


class ContactMessageAdminSerializer(serializers.ModelSerializer):
    """
    Admin serializer for staff/admin to view details and update status/admin_response.
    """
    send_email = serializers.BooleanField(write_only=True, required=False, default=True)

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
            'send_email',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'full_name',
            'email',
            'phone',
            'message',
            'created_at',
            'updated_at',
        ]

    def validate_status(self, value):
        valid_statuses = [choice[0] for choice in ContactMessage.STATUS_CHOICES]
        if value not in valid_statuses:
            raise serializers.ValidationError(f"Invalid status. Choose from: {', '.join(valid_statuses)}")
        return value