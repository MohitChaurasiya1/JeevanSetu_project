from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import UserViewSet, RegisterAPIView, MeAPIView


router = DefaultRouter()
router.register(r'users', UserViewSet)


urlpatterns = [
    path('', include(router.urls)),

    # Registration
    path('register/', RegisterAPIView.as_view(), name='register'),

    # Current logged-in user
    path('me/', MeAPIView.as_view(), name='me'),

    # JWT Authentication
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]