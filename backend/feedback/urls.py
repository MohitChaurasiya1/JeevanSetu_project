from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import FeedbackViewSet, ContactMessageCreateAPIView


router = DefaultRouter()
router.register(r'', FeedbackViewSet, basename='feedback')


urlpatterns = [
    path('contact/', ContactMessageCreateAPIView.as_view(), name='contact-message'),
    path('', include(router.urls)),
]