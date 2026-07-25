from django.db import models
from django.conf import settings

class Feedback(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('REVIEWED', 'Reviewed'),
        ('RESOLVED', 'Resolved'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='feedbacks')
    subject = models.CharField(max_length=255)
    message = models.TextField()
    rating = models.IntegerField(default=5)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    admin_response = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Feedback #{self.id} - {self.subject}"
