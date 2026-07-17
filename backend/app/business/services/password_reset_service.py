import secrets
import traceback
from datetime import datetime, timedelta
from app.data.repositories.user_repository import UserRepository
from app.data.repositories.activity_log_repository import ActivityLogRepository
from app.data.repositories.password_reset_repository import PasswordResetRepository
from app.business.services.password_service import PasswordService
from app.business.exceptions.application_exceptions import ResetTokenInvalidError
from app.data.database import mail
from flask_mail import Message
from flask import current_app

class PasswordResetService:

    def __init__(self, user_repo=None, activity_log_repo=None, password_reset_repo=None):
        self.user_repo = user_repo or UserRepository()
        self.activity_log_repo = activity_log_repo or ActivityLogRepository()
        self.password_reset_repo = password_reset_repo or PasswordResetRepository()

    def request_password_reset(self, email):
        generic_msg = "If an eligible account exists for this email, a password reset link has been sent."
        
        user = self.user_repo.get_by_email(email)
        if not user or user.status != "Active":
            print(f"[DEBUG FORGOT-PW] Request for non-existent or inactive user email: {email}")
            return generic_msg

        if not user.role or user.role.role_name != "SLTB Admin" or not user.sltb_profile:
            print(f"[DEBUG FORGOT-PW] Request for unauthorized role user email: {email}")
            return generic_msg

        # Generate cryptographically secure random reset token
        token = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(minutes=30)

        # Persist token in password_resets table
        self.password_reset_repo.create_token(user.user_id, token, expires_at)
        self.activity_log_repo.log_activity(user.user_id, "Requested password reset link")

        frontend_url = current_app.config.get('FRONTEND_URL', 'http://localhost:3000')
        reset_link = f"{frontend_url}/reset-password?token={token}"

        body = (
            "Hello,\n\n"
            "A request has been received to reset your password.\n\n"
            "Click the link below.\n\n"
            f"{reset_link}\n\n"
            "This link is valid for 30 minutes.\n\n"
            "If you did not request a password reset, please ignore this email.\n\n"
            "SLTB SafeTrack AI\n"
            "Sri Lanka Transport Board"
        )

        sender = current_app.config.get('MAIL_DEFAULT_SENDER', 'sltbsafetrack.ai@gmail.com')
        smtp_host = current_app.config.get('MAIL_SERVER')
        smtp_port = current_app.config.get('MAIL_PORT')
        smtp_user = current_app.config.get('MAIL_USERNAME')

        print("========================================================")
        print("FORGOT PASSWORD DEBUG LOGGING")
        print(f"User email:          {user.email}")
        print(f"Generated reset link: {reset_link}")
        print(f"SMTP host:           {smtp_host}")
        print(f"SMTP port:           {smtp_port}")
        print(f"SMTP username:       {smtp_user}")
        print(f"Sender:              {sender}")
        print(f"Recipient:           {user.email}")
        print("========================================================")

        msg = Message(
            subject="SLTB SafeTrack AI Password Reset",
            sender=sender,
            recipients=[user.email],
            body=body
        )

        try:
            print("[SMTP EXECUTION] Invoking mail.send(msg)...")
            mail.send(msg)
            print("[SMTP EXECUTION SUCCESS] Email successfully dispatched via Flask-Mail!")
        except Exception as e:
            print("--------------------------------------------------------")
            print("FULL EXCEPTION TRACEBACK ON MAIL SENDING:")
            print(traceback.format_exc())
            print("--------------------------------------------------------")
            current_app.logger.error(f"Flask-Mail Exception: {str(e)}\n{traceback.format_exc()}")
            raise e

        return generic_msg

    def reset_password(self, token, new_password):
        if not token:
            raise ResetTokenInvalidError("Reset token is required.")

        reset_record = self.password_reset_repo.get_by_token(token)
        if not reset_record:
            raise ResetTokenInvalidError("Invalid password reset token.")

        if reset_record.used:
            raise ResetTokenInvalidError("This password reset link has already been used.")

        if datetime.utcnow() > reset_record.expires_at:
            raise ResetTokenInvalidError("Password reset token has expired. Please request a new one.")

        user = self.user_repo.get_by_id(reset_record.user_id)
        if not user or user.status != "Active":
            raise ResetTokenInvalidError("Invalid or inactive user account.")

        new_hash = PasswordService.hash_password(new_password)
        self.user_repo.update(user.user_id, {'password': new_hash})
        self.password_reset_repo.mark_as_used(reset_record)
        self.activity_log_repo.log_activity(user.user_id, "Successfully updated account password")

        return True
