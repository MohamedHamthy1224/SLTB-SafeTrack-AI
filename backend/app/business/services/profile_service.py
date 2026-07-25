from app.data.database import db
from app.data.repositories.user_repository import UserRepository
from app.data.repositories.sltb_user_repository import SLTBUserRepository
from app.data.repositories.role_repository import RoleRepository
from app.data.repositories.session_repository import SessionRepository
from app.data.repositories.activity_log_repository import ActivityLogRepository
from app.business.validators.profile_update_validator import ProfileUpdateValidator
from app.business.validators.password_change_validator import PasswordChangeValidator
from app.business.services.profile_photo_service import ProfilePhotoService, ProfilePhotoError
from app.business.services.password_service import PasswordService
from app.business.services.websocket_service import WebSocketService
from sqlalchemy.exc import SQLAlchemyError

class ProfileServiceError(Exception):
    def __init__(self, message, errors=None, status_code=400):
        super().__init__(message)
        self.message = message
        self.errors = errors or {}
        self.status_code = status_code

class ProfileService:

    def __init__(
        self,
        user_repo=None,
        sltb_user_repo=None,
        role_repo=None,
        session_repo=None,
        activity_repo=None
    ):
        self.user_repo = user_repo or UserRepository()
        self.sltb_user_repo = sltb_user_repo or SLTBUserRepository()
        self.role_repo = role_repo or RoleRepository()
        self.session_repo = session_repo or SessionRepository()
        self.activity_repo = activity_repo or ActivityLogRepository()
        self.profile_update_validator = ProfileUpdateValidator()
        self.password_change_validator = PasswordChangeValidator()
        self.photo_service = ProfilePhotoService()
        self.password_service = PasswordService()
        self.websocket_service = WebSocketService()

    def get_profile(self, user_id):
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise ProfileServiceError("User profile not found.", status_code=404)

        sltb_profile = self.sltb_user_repo.get_by_user_id(user_id)
        role = user.role

        return {
            "userId": user.user_id,
            "fullName": sltb_profile.full_name if sltb_profile else user.username,
            "username": user.username,
            "emailAddress": user.email,
            "profileImage": user.profile_image,
            "roleName": role.role_name if role else "SLTB Admin",
            "status": user.status,
            "employeeId": sltb_profile.employee_id if sltb_profile else "",
            "phone": sltb_profile.phone if sltb_profile else "",
            "department": sltb_profile.department if sltb_profile else "",
            "designation": sltb_profile.designation if sltb_profile else "",
            "joinedDate": str(sltb_profile.joined_date) if sltb_profile and sltb_profile.joined_date else None,
            "createdAt": user.created_at.strftime('%Y-%m-%dT%H:%M:%S') if user.created_at else None,
            "updatedAt": user.updated_at.strftime('%Y-%m-%dT%H:%M:%S') if user.updated_at else None
        }

    def update_profile(self, user_id, profile_data, photo_file=None):
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise ProfileServiceError("User account not found.", status_code=404)

        sltb_profile = self.sltb_user_repo.get_by_user_id(user_id)
        if not sltb_profile:
            raise ProfileServiceError("SLTB user profile not found.", status_code=404)

        val_errors = self.profile_update_validator.validate(profile_data)
        if val_errors:
            raise ProfileServiceError("Validation failed.", errors=val_errors, status_code=400)

        # Uniqueness checks excluding current user
        email = profile_data.get('email_address') or profile_data.get('email')
        if email and self.user_repo.get_by_email(email, exclude_user_id=user_id):
            raise ProfileServiceError("Validation failed.", errors={"email_address": "This email address is already in use by another account."}, status_code=409)

        employee_id = profile_data.get('employee_id')
        if employee_id and self.sltb_user_repo.get_by_employee_id(employee_id, exclude_user_id=user_id):
            raise ProfileServiceError("Validation failed.", errors={"employee_id": "This employee ID is already in use."}, status_code=409)

        # Handle profile photo upload replacement
        new_photo_path = None
        old_photo_path = user.profile_image
        if photo_file and getattr(photo_file, 'filename', None):
            try:
                new_photo_path = self.photo_service.save_photo(photo_file)
            except ProfilePhotoError as e:
                raise ProfileServiceError(e.message, errors=e.errors, status_code=e.status_code)

        try:
            # 1. Update users table (email and profile_image)
            self.user_repo.update_profile(
                user_id=user_id,
                email=email,
                profile_image=new_photo_path if new_photo_path else None,
                commit=False
            )

            # 2. Update sltb_users table
            self.sltb_user_repo.update_profile(
                user_id=user_id,
                data={
                    "full_name": profile_data.get("full_name"),
                    "employee_id": profile_data.get("employee_id"),
                    "phone": profile_data.get("phone"),
                    "department": profile_data.get("department"),
                    "designation": profile_data.get("designation"),
                    "joined_date": profile_data.get("joined_date")
                },
                commit=False
            )

            # 3. Log activity in same transaction
            activity_desc = f"SLTB Admin profile updated for '{sltb_profile.full_name}'."
            activity_log = self.activity_repo.create({
                "user_id": user_id,
                "activity": activity_desc
            }, commit=False)

            db.session.commit()

            # Clean up old profile photo file after successful commit
            if new_photo_path and old_photo_path and old_photo_path != new_photo_path:
                self.photo_service.remove_photo_file(old_photo_path)

            updated_profile = self.get_profile(user_id)

            # Emit WebSocket notifications
            self.websocket_service.emit_profile_updated(updated_profile)
            if activity_log:
                self.websocket_service.emit_recent_activity_created({
                    "log_id": getattr(activity_log, "activity_id", None),
                    "user_id": user_id,
                    "activity": activity_desc,
                    "activity_time": str(getattr(activity_log, "activity_time", ""))
                })

            return updated_profile

        except SQLAlchemyError as e:
            db.session.rollback()
            if new_photo_path:
                self.photo_service.remove_photo_file(new_photo_path)
            raise ProfileServiceError("Failed to update profile in database.", status_code=500) from e
        except Exception as e:
            db.session.rollback()
            if new_photo_path:
                self.photo_service.remove_photo_file(new_photo_path)
            if isinstance(e, ProfileServiceError):
                raise e
            raise ProfileServiceError("An unexpected error occurred while updating profile.", status_code=500) from e

    def change_password(self, user_id, password_data):
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise ProfileServiceError("User account not found.", status_code=404)

        val_errors = self.password_change_validator.validate(password_data)
        if val_errors:
            raise ProfileServiceError("Validation failed.", errors=val_errors, status_code=400)

        current_pw = password_data.get("current_password")
        new_pw = password_data.get("new_password")

        # Verify current password
        if not self.password_service.verify_password(user.password, current_pw):
            raise ProfileServiceError("The current password is incorrect.", errors={"current_password": "The current password is incorrect."}, status_code=400)

        try:
            # Hash new password
            new_pw_hash = self.password_service.hash_password(new_pw)

            # 1. Update user password
            self.user_repo.update_password(user_id, new_pw_hash, commit=False)

            # 2. Revoke active sessions for user
            self.session_repo.revoke_all_for_user(user_id, commit=False)

            # 3. Log activity
            self.activity_repo.create({
                "user_id": user_id,
                "activity": "SLTB Admin password was changed successfully."
            }, commit=False)

            db.session.commit()

            return {"message": "Password changed successfully. Please log in again with your new password."}

        except SQLAlchemyError as e:
            db.session.rollback()
            raise ProfileServiceError("Failed to update password in database.", status_code=500) from e
        except Exception as e:
            db.session.rollback()
            if isinstance(e, ProfileServiceError):
                raise e
            raise ProfileServiceError("An unexpected error occurred while changing password.", status_code=500) from e
