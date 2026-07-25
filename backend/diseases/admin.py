from django.contrib import admin
from .models import Disease, Symptom

@admin.register(Disease)
class DiseaseAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'recommended_specialist', 'is_active', 'created_at')

@admin.register(Symptom)
class SymptomAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'is_active', 'created_at')
