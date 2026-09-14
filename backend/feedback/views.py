from rest_framework import viewsets, permissions, generics

from .models import Feedback, ContactMessage
from .serializers import FeedbackSerializer, ContactMessageSerializer


class FeedbackViewSet(viewsets.ModelViewSet):
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Feedback.objects.all()

        return Feedback.objects.filter(user=self.request.user)


class ContactMessageCreateAPIView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]