from django.db import models
from django.conf import settings

class AdminOTP(models.Model):
    admin = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='otps')
    otp_hash = models.CharField(max_length=255)
    expires_at = models.DateTimeField()
    attempts = models.IntegerField(default=0)
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"OTP for {self.admin.username} ({'Used' if self.is_used else 'Active'})"
