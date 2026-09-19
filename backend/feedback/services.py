import logging
from django.conf import settings
from django.core.mail import EmailMultiAlternatives

logger = logging.getLogger(__name__)


def send_contact_received_notification(contact_message):
    """
    Sends an email notification to the administrator (mohitkumarchaurasiya2005@gmail.com)
    when a new contact message is submitted by a user or website visitor.
    Includes reply_to set to the user's email so the admin can reply directly.
    """
    admin_email = getattr(settings, 'ADMIN_NOTIFICATION_EMAIL', 'mohitkumarchaurasiya2005@gmail.com')
    if not admin_email:
        logger.info("Admin notification email is not configured. Skipping email notification.")
        return False

    subject = f"New Contact Message from {contact_message.full_name} - JeevanSetu"
    
    # Plain text version (strictly ASCII-safe for cross-platform console/terminal backends)
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

    # HTML formatted email
    html_body = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b; }}
        .card {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }}
        .header {{ background: linear-gradient(135deg, #0d9488 0%, #059669 100%); color: #ffffff; padding: 24px 32px; }}
        .header h1 {{ margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.02em; }}
        .header p {{ margin: 6px 0 0 0; font-size: 13px; opacity: 0.9; }}
        .content {{ padding: 32px; }}
        .badge {{ display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; background-color: #e0f2fe; color: #0369a1; }}
        .details-table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
        .details-table td {{ padding: 8px 0; font-size: 14px; border-bottom: 1px solid #f1f5f9; }}
        .details-table td.label {{ font-weight: 600; color: #64748b; width: 110px; }}
        .details-table td.value {{ color: #0f172a; }}
        .message-box {{ background: #f8fafc; border-left: 4px solid #0d9488; border-radius: 0 8px 8px 0; padding: 18px 20px; margin: 24px 0; }}
        .message-box p {{ margin: 0; font-size: 15px; line-height: 1.6; color: #334155; white-space: pre-wrap; }}
        .btn {{ display: inline-block; background-color: #0d9488; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; margin-top: 12px; }}
        .footer {{ background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center; font-size: 12px; color: #94a3b8; }}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>JeevanSetu &bull; Contact Inquiry</h1>
          <p>You received a new visitor inquiry from your website contact form</p>
        </div>
        <div class="content">
          <span class="badge">Inquiry #{contact_message.id} &bull; {contact_message.status}</span>
          
          <table class="details-table">
            <tr>
              <td class="label">From:</td>
              <td class="value"><strong>{contact_message.full_name}</strong></td>
            </tr>
            <tr>
              <td class="label">Email:</td>
              <td class="value"><a href="mailto:{contact_message.email}" style="color: #0d9488; text-decoration: underline;">{contact_message.email}</a></td>
            </tr>
            <tr>
              <td class="label">Phone:</td>
              <td class="value">{contact_message.phone or '<em>Not provided</em>'}</td>
            </tr>
          </table>

          <div style="font-weight: 600; font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Message:</div>
          <div class="message-box">
            <p>{contact_message.message}</p>
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <a href="mailto:{contact_message.email}?subject=Re: Your JeevanSetu Inquiry [#{contact_message.id}]" class="btn">
              &rarr; Reply directly to {contact_message.full_name}
            </a>
          </div>
        </div>
        <div class="footer">
          JeevanSetu Healthcare AI Platform &bull; Automated Contact System<br>
          Admin Recipient: {admin_email}
        </div>
      </div>
    </body>
    </html>
    """

    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'JeevanSetu <noreply@jeevansetu.com>')

    try:
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_body,
            from_email=from_email,
            to=[admin_email],
            reply_to=[contact_message.email],
        )
        msg.attach_alternative(html_body, "text/html")
        msg.send(fail_silently=False)
        logger.info(f"Admin notification email successfully dispatched for contact message #{contact_message.id} to {admin_email}")
        return True
    except Exception as exc:
        logger.warning(
            f"Could not send admin notification email for contact message #{contact_message.id}: {exc}"
        )
        return False


def send_contact_response_email(contact_message):
    """
    Sends an email notification to the user when an administrator responds to their inquiry.
    Includes reply_to set to the admin notification email.
    """
    if not contact_message.email or not contact_message.admin_response:
        return False

    admin_email = getattr(settings, 'ADMIN_NOTIFICATION_EMAIL', 'mohitkumarchaurasiya2005@gmail.com')
    subject = "Response to your JeevanSetu Inquiry"
    
    text_body = (
        f"Dear {contact_message.full_name},\n\n"
        f"Thank you for contacting JeevanSetu. Here is the response to your inquiry:\n\n"
        f"--------------------------------------------------\n"
        f"YOUR ORIGINAL MESSAGE:\n"
        f"\"{contact_message.message}\"\n\n"
        f"OUR RESPONSE:\n"
        f"{contact_message.admin_response}\n"
        f"--------------------------------------------------\n\n"
        f"Status: {contact_message.status}\n\n"
        f"If you have further questions, you can reply directly to this email.\n\n"
        f"Warm regards,\n"
        f"The JeevanSetu Team\n"
        f"https://jeevansetu.com"
    )

    html_body = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b; }}
        .card {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }}
        .header {{ background: linear-gradient(135deg, #0d9488 0%, #059669 100%); color: #ffffff; padding: 24px 32px; }}
        .header h1 {{ margin: 0; font-size: 22px; font-weight: 700; }}
        .content {{ padding: 32px; }}
        .quote-box {{ background: #f8fafc; border-left: 3px solid #cbd5e1; border-radius: 0 6px 6px 0; padding: 14px 16px; margin: 12px 0 24px 0; font-size: 14px; color: #64748b; font-style: italic; }}
        .response-box {{ background: #f0fdfa; border-left: 4px solid #0d9488; border-radius: 0 8px 8px 0; padding: 18px 20px; margin: 12px 0 24px 0; }}
        .response-box p {{ margin: 0; font-size: 15px; line-height: 1.6; color: #134e4a; white-space: pre-wrap; }}
        .footer {{ background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center; font-size: 12px; color: #94a3b8; }}
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>JeevanSetu Support</h1>
        </div>
        <div class="content">
          <p style="font-size: 16px; margin-top: 0;">Dear <strong>{contact_message.full_name}</strong>,</p>
          <p style="font-size: 14px; color: #475569;">Thank you for contacting JeevanSetu. Here is our response to your inquiry:</p>

          <div style="font-size: 12px; font-weight: 600; color: #94a3b8; text-transform: uppercase;">Your Message:</div>
          <div class="quote-box">"{contact_message.message}"</div>

          <div style="font-size: 12px; font-weight: 600; color: #0d9488; text-transform: uppercase;">Response from JeevanSetu Team:</div>
          <div class="response-box">
            <p>{contact_message.admin_response}</p>
          </div>

          <p style="font-size: 13px; color: #64748b; margin-top: 24px;">
            If you have any further questions or require more details, simply reply to this email.
          </p>
        </div>
        <div class="footer">
          &copy; JeevanSetu Healthcare AI Platform &bull; <a href="https://jeevansetu.com" style="color: #0d9488; text-decoration: none;">jeevansetu.com</a>
        </div>
      </div>
    </body>
    </html>
    """

    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'JeevanSetu <noreply@jeevansetu.com>')

    try:
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_body,
            from_email=from_email,
            to=[contact_message.email],
            reply_to=[admin_email],
        )
        msg.attach_alternative(html_body, "text/html")
        msg.send(fail_silently=False)
        logger.info(f"Response email sent to {contact_message.email} for contact message #{contact_message.id}")
        return True
    except Exception as exc:
        logger.warning(
            f"Could not send response email to {contact_message.email} for message #{contact_message.id}: {exc}"
        )
        return False
