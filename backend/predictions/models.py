from django.db import models
from django.conf import settings
from diseases.models import Disease

class Prediction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='predictions')
    disease = models.ForeignKey(Disease, on_delete=models.SET_NULL, null=True, blank=True, related_name='predictions')
    input_data = models.JSONField(help_text='Medical features and symptoms input parameters')
    prediction_result = models.CharField(max_length=255)
    probability = models.FloatField(default=0.0)
    risk_level = models.CharField(max_length=50)
    model_version = models.CharField(max_length=50, default='1.0.0')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Prediction #{self.id} for {self.user.username}"
