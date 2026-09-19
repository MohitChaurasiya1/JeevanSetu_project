from django.db import models
from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response

from .models import Feedback, ContactMessage
from .serializers import (
    FeedbackSerializer,
    ContactMessageSerializer,
    ContactMessageAdminSerializer,
)
from .services import (
    send_contact_received_notification,
    send_contact_response_email,
)


class IsAdminOrStaff(permissions.BasePermission):
    """
    Allows access only to authenticated admin users (is_staff, is_superuser, or role in ['ADMIN', 'SUPER_ADMIN']).
    """
    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and (
                user.is_staff
                or user.is_superuser
                or getattr(user, 'role', None) in ['ADMIN', 'SUPER_ADMIN']
            )
        )


class FeedbackViewSet(viewsets.ModelViewSet):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Feedback.objects.all()

        return Feedback.objects.filter(user=self.request.user)


class ContactMessageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Contact Messages.
    - Anonymous public users can POST new contact messages.
    - Only authenticated administrators/staff can view, filter, retrieve, and update contact messages.
    """
    queryset = ContactMessage.objects.all().order_by('-created_at')

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [IsAdminOrStaff()]

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update', 'retrieve']:
            return ContactMessageAdminSerializer
        return ContactMessageSerializer

    def get_queryset(self):
        queryset = ContactMessage.objects.all().order_by('-created_at')
        
        # Filter by status: NEW, READ, RESOLVED
        status_param = self.request.query_params.get('status')
        if status_param and status_param.upper() in ['NEW', 'READ', 'RESOLVED']:
            queryset = queryset.filter(status=status_param.upper())

        # Search across full_name, email, phone, message
        search_param = self.request.query_params.get('search')
        if search_param:
            search_param = search_param.strip()
            queryset = queryset.filter(
                models.Q(full_name__icontains=search_param)
                | models.Q(email__icontains=search_param)
                | models.Q(phone__icontains=search_param)
                | models.Q(message__icontains=search_param)
            )

        return queryset

    def perform_create(self, serializer):
        contact_message = serializer.save()
        send_contact_received_notification(contact_message)

    def perform_update(self, serializer):
        send_email = serializer.validated_data.pop('send_email', True)
        old_response = serializer.instance.admin_response
        instance = serializer.save()
        new_response = instance.admin_response

        # Send response email if admin response was added or updated
        if send_email and new_response and new_response != old_response:
            send_contact_response_email(instance)


class ContactMessageCreateAPIView(generics.CreateAPIView):
    """
    Backward-compatible public endpoint for creating contact messages.
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        contact_message = serializer.save()
        send_contact_received_notification(contact_message)