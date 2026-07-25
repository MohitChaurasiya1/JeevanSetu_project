from django.contrib import admin
from .models import AuditLog

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'admin', 'action', 'module', 'ip_address', 'created_at')
    list_filter = ('module', 'created_at')
