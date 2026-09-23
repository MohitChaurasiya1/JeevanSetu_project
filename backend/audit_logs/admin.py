from django.contrib import admin
from .models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'created_at',
        'action',
        'status',
        'username',
        'user',
        'module',
        'ip_address',
    )
    list_filter = ('action', 'status', 'module', 'created_at')
    search_fields = ('username', 'user__username', 'user__email', 'description', 'ip_address')
    readonly_fields = [f.name for f in AuditLog._meta.fields]

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
