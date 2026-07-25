from rest_framework.exceptions import APIException
from rest_framework import status

class CustomValidationException(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Invalid input parameters provided.'
    default_code = 'invalid_input'
