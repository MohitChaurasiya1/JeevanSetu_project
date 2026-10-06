from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminDashboardOverviewView, AdminPredictionViewSet

router = DefaultRouter()
router.register(r'predictions', AdminPredictionViewSet, basename='admin-prediction')

urlpatterns = [
    path('dashboard/', AdminDashboardOverviewView.as_view(), name='admin-dashboard'),
    path('', include(router.urls)),
]
