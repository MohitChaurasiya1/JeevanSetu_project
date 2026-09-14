from rest_framework import viewsets, permissions, generics

from .models import User
from .serializers import UserSerializer, RegisterSerializer


class RegisterAPIView(generics.CreateAPIView):

    queryset = User.objects.all()

    serializer_class = RegisterSerializer

    permission_classes = [permissions.AllowAny]


class UserViewSet(viewsets.ModelViewSet):

    queryset = User.objects.all()

    serializer_class = UserSerializer

    permission_classes = [permissions.IsAuthenticated]


class MeAPIView(generics.RetrieveAPIView):

    serializer_class = UserSerializer

    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user