from django.db import models
from django.conf import settings
from diseases.models import Disease

class MLModel(models.Model):
    model_name = models.CharField(max_length=255)
    disease = models.ForeignKey(Disease, on_delete=models.CASCADE, related_name='ml_models')
    model_file = models.FileField(upload_to='model_files/')
    version = models.CharField(max_length=50)
    accuracy = models.FloatField(default=0.0)
    precision = models.FloatField(default=0.0)
    recall = models.FloatField(default=0.0)
    f1_score = models.FloatField(default=0.0)
    training_date = models.DateField(blank=True, null=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.model_name} v{self.version} ({'Active' if self.is_active else 'Inactive'})"
