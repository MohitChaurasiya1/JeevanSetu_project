from django.core.exceptions import ValidationError

def validate_phone_number(value):
    if value and not value.isdigit():
        raise ValidationError('Phone number must contain only digits.')
