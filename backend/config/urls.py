from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/diseases/', include('diseases.urls')),
    path('api/symptoms/', include('diseases.symptom_urls')),
    path('api/predictions/', include('predictions.urls')),
    path('api/feedback/', include('feedback.urls')),
    path('api/admin-panel/', include('admin_panel.urls')),
    path('api/audit-logs/', include('audit_logs.urls')),
    path('api/ml-models/', include('ml_models.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
