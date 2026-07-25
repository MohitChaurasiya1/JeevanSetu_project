from django.contrib import admin
from .models import MLModel

@admin.register(MLModel)
class MLModelAdmin(admin.ModelAdmin):
    list_display = ('id', 'model_name', 'disease', 'version', 'accuracy', 'is_active', 'created_at')
