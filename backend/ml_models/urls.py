from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MLModelViewSet

router = DefaultRouter()
router.register(r'', MLModelViewSet, basename='ml-model')

urlpatterns = [
    path('', include(router.urls)),
]
