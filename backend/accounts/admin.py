from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'full_name', 'role', 'is_active', 'created_at')
    search_fields = ('username', 'email', 'full_name')
    list_filter = ('role', 'is_active', 'is_email_verified')
