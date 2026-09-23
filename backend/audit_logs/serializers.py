from rest_framework import serializers
from .models import AuditLog


class AuditLogSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    user_role = serializers.CharField(source='user.role', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = AuditLog
        fields = [
            'id',
            'user',
            'user_id',
            'username',
            'user_role',
            'user_email',
            'action',
            'status',
            'module',
            'record_id',
            'description',
            'ip_address',
            'user_agent',
            'created_at',
        ]
        read_only_fields = fields
