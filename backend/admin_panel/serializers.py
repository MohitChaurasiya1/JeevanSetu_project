from rest_framework import serializers
from .models import AdminOTP

class AdminOTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminOTP
        fields = '__all__'
