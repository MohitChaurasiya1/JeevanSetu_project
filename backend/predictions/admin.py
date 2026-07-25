from django.contrib import admin
from .models import Prediction

@admin.register(Prediction)
class PredictionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'disease', 'probability', 'risk_level', 'model_version', 'created_at')
    list_filter = ('risk_level', 'created_at')
