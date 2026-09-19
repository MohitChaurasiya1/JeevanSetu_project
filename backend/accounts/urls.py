from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    UserViewSet,
    RegisterAPIView,
    MeAPIView,
    CustomTokenObtainPairView,
)

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),

    # Registration
    path('register/', RegisterAPIView.as_view(), name='register'),

    # Current logged-in user profile
    path('me/', MeAPIView.as_view(), name='me'),

    # JWT Authentication (Username OR Email login)
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]