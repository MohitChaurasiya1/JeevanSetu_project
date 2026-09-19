from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'full_name',
            'email',
            'phone',
            'gender',
            'date_of_birth',
            'role',
            'is_email_verified',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'role',
            'is_email_verified',
            'is_active',
            'created_at',
            'updated_at',
        ]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        error_messages={'min_length': 'Password must be at least 8 characters long.'}
    )
    password_confirm = serializers.CharField(
        write_only=True
    )
    phone = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    gender = serializers.CharField(required=False, allow_blank=True, allow_null=True, default='OTHER')
    date_of_birth = serializers.DateField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            'username',
            'full_name',
            'email',
            'phone',
            'gender',
            'date_of_birth',
            'password',
            'password_confirm',
        ]

    def to_internal_value(self, data):
        if isinstance(data, dict):
            data = data.copy()
            # Convert empty string date_of_birth or phone to None before DRF date parsing
            if data.get('date_of_birth') == '':
                data['date_of_birth'] = None
            if data.get('phone') == '':
                data['phone'] = None
            if not data.get('gender'):
                data['gender'] = 'OTHER'
        return super().to_internal_value(data)

    def validate_username(self, value):
        username = (value or '').strip()
        if not username:
            raise serializers.ValidationError("Username is required.")
        if User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return username

    def validate_email(self, value):
        email = (value or '').strip()
        if not email:
            raise serializers.ValidationError("Email is required.")
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return email

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password_confirm'):
            raise serializers.ValidationError({
                'password_confirm': 'Passwords do not match.'
            })
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm', None)
        password = validated_data.pop('password')

        # Clean optional blank fields
        if not validated_data.get('phone'):
            validated_data['phone'] = None
        if not validated_data.get('date_of_birth'):
            validated_data['date_of_birth'] = None
        if not validated_data.get('gender'):
            validated_data['gender'] = 'OTHER'

        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Allows authentication using EITHER username OR email address.
    """
    def validate(self, attrs):
        username_or_email = (attrs.get('username') or '').strip()
        password = attrs.get('password')

        if username_or_email and password:
            user = User.objects.filter(
                Q(username__iexact=username_or_email) | Q(email__iexact=username_or_email)
            ).first()

            if user and user.check_password(password):
                attrs['username'] = user.username

        return super().validate(attrs)