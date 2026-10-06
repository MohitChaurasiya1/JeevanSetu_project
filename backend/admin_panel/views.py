from datetime import timedelta
from django.utils import timezone
from django.db.models import Count, Q
from django.db.models.functions import TruncDate
from rest_framework.views import APIView
from rest_framework import viewsets, mixins, status
from rest_framework.response import Response

from core.permissions import IsAdminRole
from accounts.models import User
from predictions.models import Prediction
from feedback.models import Feedback, ContactMessage
from audit_logs.models import AuditLog
from audit_logs.services import log_audit_event
from .serializers import AdminPredictionSerializer


class AdminDashboardOverviewView(APIView):
    """
    Admin Dashboard Aggregated Metrics API:
    - totals: summary counts for users, predictions, risks, feedback, new contact messages
    - prediction_trend: 30-day timeline of predictions with continuous zero-filled dates
    - risk_distribution: breakdown by risk category
    - recent_activity: latest 8 audit logs
    """
    permission_classes = [IsAdminRole]

    def get(self, request):
        # 1. ORM counts & risk aggregation
        user_count = User.objects.count()
        prediction_stats = Prediction.objects.aggregate(
            total=Count('id'),
            high_risk=Count('id', filter=Q(risk_level__iexact='HIGH')),
            medium_risk=Count('id', filter=Q(risk_level__iexact='MEDIUM')),
            low_risk=Count('id', filter=Q(risk_level__iexact='LOW')),
        )
        total_predictions = prediction_stats['total'] or 0
        high_risk = prediction_stats['high_risk'] or 0
        medium_risk = prediction_stats['medium_risk'] or 0
        low_risk = prediction_stats['low_risk'] or 0

        feedback_count = Feedback.objects.count()
        contact_messages_new = ContactMessage.objects.filter(status='NEW').count()

        totals = {
            "users": user_count,
            "predictions": total_predictions,
            "high_risk": high_risk,
            "medium_risk": medium_risk,
            "low_risk": low_risk,
            "feedback": feedback_count,
            "contact_messages_new": contact_messages_new,
        }

        # 2. Prediction trend over last 30 days
        today = timezone.now().date()
        start_date = today - timedelta(days=29)

        trend_qs = (
            Prediction.objects.filter(created_at__date__gte=start_date)
            .annotate(date=TruncDate('created_at'))
            .values('date')
            .annotate(count=Count('id'))
            .order_by('date')
        )

        trend_dict = {}
        for item in trend_qs:
            item_date = item['date']
            if item_date:
                if isinstance(item_date, str):
                    trend_dict[item_date] = item['count']
                else:
                    trend_dict[item_date.strftime('%Y-%m-%d')] = item['count']

        prediction_trend = []
        for i in range(30):
            d = (start_date + timedelta(days=i)).strftime('%Y-%m-%d')
            prediction_trend.append({
                "date": d,
                "count": trend_dict.get(d, 0)
            })

        # 3. Risk distribution
        risk_distribution = [
            {"name": "Low", "value": low_risk},
            {"name": "Medium", "value": medium_risk},
            {"name": "High", "value": high_risk},
        ]

        # 4. Recent activity (latest 8 AuditLog rows)
        recent_logs = (
            AuditLog.objects.select_related('user')
            .order_by('-created_at')[:8]
        )
        recent_activity = [
            {
                "id": log.id,
                "username": log.username or (log.user.username if log.user else "Anonymous"),
                "action": log.action,
                "status": log.status,
                "module": log.module,
                "description": log.description or "",
                "created_at": log.created_at.isoformat() if log.created_at else None,
            }
            for log in recent_logs
        ]

        return Response({
            "totals": totals,
            "prediction_trend": prediction_trend,
            "risk_distribution": risk_distribution,
            "recent_activity": recent_activity,
        }, status=status.HTTP_200_OK)


class AdminPredictionViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """
    Admin ViewSet for managing all user predictions.
    Supports filtering by:
    - ?risk_level= (LOW, MEDIUM, HIGH)
    - ?disease= (disease name or id)
    - ?user_id=
    - ?search= (username, email, full_name, prediction_result)
    - ?date_from= (YYYY-MM-DD)
    - ?date_to= (YYYY-MM-DD)
    """
    queryset = Prediction.objects.select_related('user', 'disease').order_by('-created_at')
    serializer_class = AdminPredictionSerializer
    permission_classes = [IsAdminRole]

    def get_queryset(self):
        queryset = Prediction.objects.select_related('user', 'disease').order_by('-created_at')

        # Filter: risk_level
        risk_level = self.request.query_params.get('risk_level')
        if risk_level:
            queryset = queryset.filter(risk_level__iexact=risk_level.strip())

        # Filter: disease
        disease_param = self.request.query_params.get('disease')
        if disease_param:
            disease_param = disease_param.strip()
            if disease_param.isdigit():
                queryset = queryset.filter(disease_id=int(disease_param))
            else:
                queryset = queryset.filter(disease__name__icontains=disease_param)

        # Filter: user_id
        user_id_param = self.request.query_params.get('user_id')
        if user_id_param:
            queryset = queryset.filter(user_id=user_id_param.strip())

        # Filter: search across username, email, full_name, prediction_result
        search = self.request.query_params.get('search')
        if search:
            search = search.strip()
            queryset = queryset.filter(
                Q(user__username__icontains=search)
                | Q(user__email__icontains=search)
                | Q(user__full_name__icontains=search)
                | Q(prediction_result__icontains=search)
            )

        # Filter: date_from
        date_from = self.request.query_params.get('date_from')
        if date_from:
            queryset = queryset.filter(created_at__date__gte=date_from.strip())

        # Filter: date_to
        date_to = self.request.query_params.get('date_to')
        if date_to:
            queryset = queryset.filter(created_at__date__lte=date_to.strip())

        return queryset

    def perform_destroy(self, instance):
        requester = self.request.user
        pred_id = str(instance.id)
        instance.delete()

        log_audit_event(
            user=requester,
            username=requester.username,
            action='OTHER',
            status='SUCCESS',
            module='PREDICTIONS',
            record_id=pred_id,
            description=f"Prediction #{pred_id} deleted by admin '{requester.username}'",
            request=self.request,
        )
