from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SymptomViewSet

router = DefaultRouter()
router.register(r'', SymptomViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
