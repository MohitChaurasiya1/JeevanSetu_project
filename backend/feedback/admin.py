from django.contrib import admin
from .models import Feedback

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'subject', 'rating', 'status', 'created_at')
    list_filter = ('status', 'rating')
