from django.db import models
from django.conf import settings


class AuditLog(models.Model):
    STATUS_CHOICES = (
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
    )

    ACTION_CHOICES = (
        ('LOGIN', 'Login'),
        ('REGISTER', 'Register'),
        ('LOGOUT', 'Logout'),
        ('PASSWORD_CHANGE', 'Password Change'),
        ('PROFILE_UPDATE', 'Profile Update'),
        ('OTHER', 'Other'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='audit_logs'
    )
    username = models.CharField(max_length=150, blank=True, null=True)
    action = models.CharField(max_length=50, default='OTHER')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SUCCESS')
    module = models.CharField(max_length=100, default='AUTH')
    record_id = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Audit Log'
        verbose_name_plural = 'Audit Logs'

    def __str__(self):
        user_str = self.username or (self.user.username if self.user else 'Anonymous')
        return f"[{self.status}] {self.action} on {self.module} by {user_str} at {self.created_at}"
