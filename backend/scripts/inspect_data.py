"""
Standalone script to inspect all data stored in the JeevanSetu backend database.
Run from the backend directory:
    python scripts/inspect_data.py
"""
import os
import sys
import django

# ---------- Django bootstrap ----------
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.base")
django.setup()

# ---------- Imports (after setup) ----------
from django.contrib.auth import get_user_model
from diseases.models import Disease, Symptom
from predictions.models import Prediction
from feedback.models import Feedback, ContactMessage
from ml_models.models import MLModel
from audit_logs.models import AuditLog
from admin_panel.models import AdminOTP

User = get_user_model()

SEPARATOR = "=" * 80


def section(title):
    print(f"\n{SEPARATOR}")
    print(f"  {title}")
    print(SEPARATOR)


def show_users():
    section("USERS")
    qs = User.objects.all()
    print(f"Total: {qs.count()}")
    for u in qs:
        print(f"  • id={u.id}  username={u.username}  email={u.email}  "
              f"role={u.role}  active={u.is_active}  email_verified={u.is_email_verified}  "
              f"gender={u.gender}  dob={u.date_of_birth}  phone={u.phone}  "
              f"created={u.created_at}")


def show_diseases():
    section("DISEASES")
    qs = Disease.objects.all()
    print(f"Total: {qs.count()}")
    for d in qs:
        desc_preview = (d.description[:80] + "...") if len(d.description) > 80 else d.description
        print(f"  • id={d.id}  name={d.name}  specialist={d.recommended_specialist}  "
              f"active={d.is_active}")
        print(f"    description: {desc_preview}")


def show_symptoms():
    section("SYMPTOMS")
    qs = Symptom.objects.all()
    print(f"Total: {qs.count()}")
    for s in qs:
        print(f"  • id={s.id}  name={s.name}  category={s.category}  active={s.is_active}")


def show_predictions():
    section("PREDICTIONS")
    qs = Prediction.objects.select_related("user", "disease").all()
    print(f"Total: {qs.count()}")
    for p in qs:
        print(f"  • id={p.id}  user={p.user.username}  disease={p.disease}  "
              f"result={p.prediction_result}  prob={p.probability}  "
              f"risk={p.risk_level}  model_ver={p.model_version}  created={p.created_at}")
        print(f"    input_data: {p.input_data}")


def show_feedbacks():
    section("FEEDBACKS")
    qs = Feedback.objects.select_related("user").all()
    print(f"Total: {qs.count()}")
    for f in qs:
        print(f"  • id={f.id}  user={f.user.username}  subject={f.subject}  "
              f"rating={f.rating}  status={f.status}  created={f.created_at}")
        msg_preview = (f.message[:80] + "...") if len(f.message) > 80 else f.message
        print(f"    message: {msg_preview}")


def show_contact_messages():
    section("CONTACT MESSAGES")
    qs = ContactMessage.objects.all()
    print(f"Total: {qs.count()}")
    for c in qs:
        msg_preview = (c.message[:80] + "...") if len(c.message) > 80 else c.message
        print(f"  • id={c.id}  name={c.full_name}  email={c.email}  phone={c.phone}  "
              f"status={c.status}  created={c.created_at}")
        print(f"    message: {msg_preview}")


def show_ml_models():
    section("ML MODELS")
    qs = MLModel.objects.select_related("disease", "uploaded_by").all()
    print(f"Total: {qs.count()}")
    for m in qs:
        uploader = m.uploaded_by.username if m.uploaded_by else "N/A"
        print(f"  • id={m.id}  name={m.model_name}  disease={m.disease.name}  "
              f"version={m.version}  accuracy={m.accuracy}  active={m.is_active}  "
              f"uploaded_by={uploader}  training_date={m.training_date}")


def show_audit_logs():
    section("AUDIT LOGS (last 30)")
    qs = AuditLog.objects.all()[:30]
    total = AuditLog.objects.count()
    print(f"Total: {total}  (showing latest 30)")
    for a in qs:
        user_str = a.username or (a.user.username if a.user else "Anonymous")
        print(f"  • id={a.id}  user={user_str}  action={a.action}  status={a.status}  "
              f"module={a.module}  ip={a.ip_address}  created={a.created_at}")
        if a.description:
            desc = (a.description[:100] + "...") if len(a.description) > 100 else a.description
            print(f"    desc: {desc}")


def show_admin_otps():
    section("ADMIN OTPs")
    qs = AdminOTP.objects.select_related("admin").all()
    print(f"Total: {qs.count()}")
    for o in qs:
        print(f"  • id={o.id}  admin={o.admin.username}  used={o.is_used}  "
              f"attempts={o.attempts}  expires={o.expires_at}  created={o.created_at}")


def main():
    print(SEPARATOR)
    print("  JeevanSetu — Database Inspection Report")
    print(SEPARATOR)

    show_users()
    show_diseases()
    show_symptoms()
    show_predictions()
    show_feedbacks()
    show_contact_messages()
    show_ml_models()
    show_audit_logs()
    show_admin_otps()

    print(f"\n{SEPARATOR}")
    print("  Done!")
    print(SEPARATOR)


if __name__ == "__main__":
    main()
