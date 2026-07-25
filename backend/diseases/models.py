from django.db import models

class Disease(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    precautions = models.TextField(blank=True, null=True)
    recommended_specialist = models.CharField(max_length=255, blank=True, null=True)
    risk_message = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Symptom(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
