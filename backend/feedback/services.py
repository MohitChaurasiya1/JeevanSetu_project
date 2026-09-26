import logging
import requests
from django.conf import settings
from django.core.mail import EmailMultiAlternatives

logger = logging.getLogger(__name__)

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"


def _send_email(*, subject, text_body, html_body, to_email, to_name="", reply_to_email=None):
    """
    Sends an email using Brevo's HTTPS API if BREVO_API_KEY is configured
    (recommended -- works on hosts like Render's free tier that block
    outbound SMTP ports). Falls back to Django's normal SMTP backend
    otherwise. Returns True/False.
    """
    api_key = getattr(settings, "BREVO_API_KEY", "")

    if api_key:
        sender_email = getattr(settings, "BREVO_SENDER_EMAIL", "") or "noreply@jeevansetu.com"
        sender_name = getattr(settings, "BREVO_SENDER_NAME", "JeevanSetu")

        payload = {
            "sender": {"name": sender_name, "email": sender_email},
            "to": [{"email": to_email, "name": to_name or to_email}],
            "subject": subject,
            "htmlContent": html_body,
            "textContent": text_body,
        }
        if reply_to_email:
            payload["replyTo"] = {"email": reply_to_email}

        try:
            response = requests.post(
                BREVO_API_URL,
                json=payload,
                headers={
                    "api-key": api_key,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                timeout=15,
            )
            if response.status_code in (200, 201):
                logger.info(f"Email sent via Brevo API to {to_email} (subject: {subject})")
                return True
            logger.warning(
                f"Brevo API returned {response.status_code} sending to {to_email}: {response.text}"
            )
            return False
        except requests.RequestException as exc:
            logger.warning(f"Brevo API request failed sending to {to_email}: {exc}")
            return False

    # Fallback: plain Django SMTP backend (will fail on hosts that block
    # SMTP ports, e.g. Render free tier).
    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "JeevanSetu <noreply@jeevansetu.com>")
    try:
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_body,
            from_email=from_email,
            to=[to_email],
            reply_to=[reply_to_email] if reply_to_email else None,
        )
        msg.attach_alternative(html_body, "text/html")
        msg.send(fail_silently=False)
        logger.info(f"Email sent via SMTP to {to_email} (subject: {subject})")
        return True
    except Exception as exc:
        logger.warning(f"Could not send email via SMTP to {to_email}: {exc}")
        return False


def send_contact_received_notification(contact_message):
    """
    Sends an email notification to the administrator
    when a new contact message is submitted by a user or website visitor.
    Includes reply_to set to the user's email so the admin can reply directly.
    """
    admin_email = getattr(settings, 'ADMIN_NOTIFICATION_EMAIL', 'mohitkumarchaurasiya2005@gmail.com')
    if not admin_email:
        logger.info("Admin notification email is not configured. Skipping email notification.")
        return False

    subject = f"New Contact Message from {contact_message.full_name} - JeevanSetu"

    text_body = (
        f"You have received a new contact inquiry on JeevanSetu!\n\n"
        f"--------------------------------------------------\n"
        f"SENDER DETAILS:\n"
        f"* Name:  {contact_message.full_name}\n"
        f"* Email: {contact_message.email}\n"
        f"* Phone: {contact_message.phone or 'Not provided'}\n"
        f"* Inquiry ID: #{contact_message.id}\n"
        f"* Status: {contact_message.status}\n"
        f"--------------------------------------------------\n\n"
        f"MESSAGE CONTENT:\n"
        f"\"{contact_message.message}\"\n\n"
        f"--------------------------------------------------\n"
        f"To reply directly to {contact_message.full_name}, simply hit Reply to this email "
        f"or write to {contact_message.email}.\n\n"
        f"-- JeevanSetu Automated Notification System"
    )

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Message</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f4f7; font-family: Arial, Helvetica, sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding: 24px 0;">
            <tr>
                <td align="center">
                    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                        <tr>
                            <td style="background-color:#0f766e; padding: 20px 32px;">
                                <h1 style="color:#ffffff; font-size:20px; margin:0;">JeevanSetu</h1>
                                <p style="color:#d1fae5; font-size:13px; margin:4px 0 0 0;">New Contact Message Received</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 24px 32px;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px; color:#111827;">
                                    <tr>
                                        <td style="padding: 6px 0; width:120px; color:#6b7280;">Name</td>
                                        <td style="padding: 6px 0; font-weight:bold;">{contact_message.full_name}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; color:#6b7280;">Email</td>
                                        <td style="padding: 6px 0;">{contact_message.email}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; color:#6b7280;">Phone</td>
                                        <td style="padding: 6px 0;">{contact_message.phone or 'Not provided'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; color:#6b7280;">Inquiry ID</td>
                                        <td style="padding: 6px 0;">#{contact_message.id}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; color:#6b7280;">Status</td>
                                        <td style="padding: 6px 0;">{contact_message.status}</td>
                                    </tr>
                                </table>
                                <hr style="border:none; border-top:1px solid #e5e7eb; margin:20px 0;">
                                <p style="font-size:13px; color:#6b7280; margin:0 0 8px 0;">MESSAGE</p>
                                <p style="font-size:14px; color:#111827; background-color:#f9fafb; padding:14px; border-radius:6px; white-space:pre-wrap;">{contact_message.message}</p>
                                <hr style="border:none; border-top:1px solid #e5e7eb; margin:20px 0;">
                                <p style="font-size:13px; color:#6b7280;">
                                    To reply directly to {contact_message.full_name}, simply hit Reply to this email
                                    or write to <a href="mailto:{contact_message.email}" style="color:#0f766e;">{contact_message.email}</a>.
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color:#f9fafb; padding: 14px 32px; text-align:center;">
                                <p style="font-size:11px; color:#9ca3af; margin:0;">JeevanSetu Automated Notification System</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

    return _send_email(
        subject=subject,
        text_body=text_body,
        html_body=html_body,
        to_email=admin_email,
        to_name="JeevanSetu Admin",
        reply_to_email=contact_message.email,
    )


def send_contact_response_email(contact_message, response_text=None):
    """
    Sends an email to the original sender when the admin responds to their
    contact message from the admin dashboard.
    """
    if not contact_message.email:
        logger.info("Contact message has no email address. Skipping response email.")
        return False

    if response_text is None:
        response_text = contact_message.admin_response or ""

    subject = f"Re: Your message to JeevanSetu - #{contact_message.id}"

    text_body = (
        f"Hi {contact_message.full_name},\n\n"
        f"Thank you for reaching out to JeevanSetu. Here is our response to your inquiry:\n\n"
        f"--------------------------------------------------\n"
        f"{response_text}\n"
        f"--------------------------------------------------\n\n"
        f"For reference, your original message was:\n"
        f"\"{contact_message.message}\"\n\n"
        f"If you have any further questions, feel free to reply to this email.\n\n"
        f"-- Team JeevanSetu"
    )

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Response from JeevanSetu</title>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f4f7; font-family: Arial, Helvetica, sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding: 24px 0;">
            <tr>
                <td align="center">
                    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                        <tr>
                            <td style="background-color:#0f766e; padding: 20px 32px;">
                                <h1 style="color:#ffffff; font-size:20px; margin:0;">JeevanSetu</h1>
                                <p style="color:#d1fae5; font-size:13px; margin:4px 0 0 0;">Response to your inquiry</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 24px 32px;">
                                <p style="font-size:14px; color:#111827;">Hi {contact_message.full_name},</p>
                                <p style="font-size:14px; color:#111827;">Thank you for reaching out to JeevanSetu. Here is our response to your inquiry:</p>
                                <p style="font-size:14px; color:#111827; background-color:#f0fdf4; border-left:4px solid #0f766e; padding:14px; border-radius:4px; white-space:pre-wrap;">{response_text}</p>
                                <hr style="border:none; border-top:1px solid #e5e7eb; margin:20px 0;">
                                <p style="font-size:13px; color:#6b7280; margin:0 0 6px 0;">YOUR ORIGINAL MESSAGE</p>
                                <p style="font-size:13px; color:#374151; background-color:#f9fafb; padding:12px; border-radius:6px; white-space:pre-wrap;">{contact_message.message}</p>
                                <p style="font-size:13px; color:#6b7280; margin-top:20px;">If you have any further questions, feel free to reply to this email.</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color:#f9fafb; padding: 14px 32px; text-align:center;">
                                <p style="font-size:11px; color:#9ca3af; margin:0;">Team JeevanSetu</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

    return _send_email(
        subject=subject,
        text_body=text_body,
        html_body=html_body,
        to_email=contact_message.email,
        to_name=contact_message.full_name,
    )
