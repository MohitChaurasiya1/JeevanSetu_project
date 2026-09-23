import logging
from .models import AuditLog

logger = logging.getLogger(__name__)


def get_client_ip(request):
    """
    Safely extract the client's IP address from request headers.
    """
    if not request:
        return None
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def get_user_agent(request):
    """
    Safely extract user-agent header.
    """
    if not request:
        return None
    return request.META.get('HTTP_USER_AGENT', '')[:500]


def log_audit_event(
    user=None,
    username=None,
    action='OTHER',
    status='SUCCESS',
    module='AUTH',
    record_id=None,
    description=None,
    request=None,
    ip_address=None,
    user_agent=None,
):
    """
    Create an audit log record safely.
    Ensures that logging exceptions never crash user authentication flows.
    NEVER logs passwords, tokens, or sensitive credentials.
    """
    try:
        resolved_username = username
        if not resolved_username and user:
            resolved_username = getattr(user, 'username', None)

        resolved_ip = ip_address or get_client_ip(request)
        resolved_ua = user_agent or get_user_agent(request)
        resolved_record_id = (
            str(record_id)
            if record_id is not None
            else (str(user.id) if user and hasattr(user, 'id') else None)
        )

        return AuditLog.objects.create(
            user=user,
            username=resolved_username,
            action=action,
            status=status,
            module=module,
            record_id=resolved_record_id,
            description=description,
            ip_address=resolved_ip,
            user_agent=resolved_ua,
        )
    except Exception as e:
        logger.error(f"Failed to record audit log: {e}", exc_info=True)
        return None
