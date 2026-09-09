from app.data.database import db
from app.data.repositories.user_repository import UserRepository
from app.data.repositories.sltb_user_repository import SLTBUserRepository
from app.data.repositories.police_officer_repository import PoliceOfficerRepository
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
        police_officer_repo=None,
        role_repo=None,
        session_repo=None,
        activity_repo=None
    ):
        self.user_repo = user_repo or UserRepository()
        self.sltb_user_repo = sltb_user_repo or SLTBUserRepository()
        self.police_officer_repo = police_officer_repo or PoliceOfficerRepository()
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

        role = user.role
        role_name = role.role_name if role else "User"

        sltb_profile = self.sltb_user_repo.get_by_user_id(user_id)
        police_profile = self.police_officer_repo.get_by_user_id(user_id)

        # Auto-create missing role profile for existing user account if missing
        if not police_profile and role_name in ["Police Admin", "Traffic Police Officer"]:
            try:
                police_profile = self.police_officer_repo.create({
                    "user_id": user_id,
                    "full_name": user.username,
                    "badge_number": f"PO{user_id:03d}",
                    "rank": "Police Admin" if role_name == "Police Admin" else "Inspector",
                    "police_station": "Police Headquarters",
                    "phone": "",
                    "joined_date": user.created_at.date() if user.created_at else None
                }, commit=True)
            except Exception as e:
                db.session.rollback()
                police_profile = None

        if not sltb_profile and role_name == "SLTB Admin":
            try:
                sltb_profile = self.sltb_user_repo.create({
                    "user_id": user_id,
                    "full_name": user.username,
                    "employee_id": f"EMP{user_id:03d}",
                    "department": "SLTB Administration",
                    "designation": "SLTB Admin",
                    "phone": "",
                    "joined_date": user.created_at.date() if user.created_at else None
                }, commit=True)
            except Exception as e:
                db.session.rollback()
                sltb_profile = None

        full_name = user.username
        department = "System"
        phone = ""
        joined_date = user.created_at.strftime('%Y-%m-%d') if user.created_at else None

        if police_profile:
            full_name = police_profile.full_name or full_name
            department = police_profile.police_station or department
            phone = police_profile.phone or phone
            if police_profile.joined_date:
                joined_date = str(police_profile.joined_date)
        elif sltb_profile:
            full_name = sltb_profile.full_name or full_name
            department = sltb_profile.department or department
            phone = sltb_profile.phone or phone
            if sltb_profile.joined_date:
                joined_date = str(sltb_profile.joined_date)

        created_at_fmt = user.created_at.strftime('%d %b %Y, %I:%M %p') if user.created_at else ""
        updated_at_fmt = user.updated_at.strftime('%d %b %Y, %I:%M %p') if user.updated_at else ""

        profile_data = {
            "id": user.user_id,
            "userId": user.user_id,
            "user_id": user.user_id,
            "username": user.username,
            "email": user.email,
            "emailAddress": user.email,
            "fullName": full_name,
            "full_name": full_name,
            "displayName": full_name,
            "profileImage": user.profile_image,
            "profile_image": user.profile_image,
            "avatar": user.profile_image,
            "role": role_name,
            "roleName": role_name,
            "roleDisplay": role_name,
            "status": user.status,
            "themePreference": user.theme_preference or "light",
            "theme_preference": user.theme_preference or "light",
            "department": department,
            "phone": phone,
            "joinedDate": joined_date,
            "joined_date": joined_date,
            "createdAt": created_at_fmt,
            "created_at": user.created_at.strftime('%Y-%m-%d %H:%M:%S') if user.created_at else "",
            "accountCreated": created_at_fmt,
            "updatedAt": updated_at_fmt,
            "updated_at": user.updated_at.strftime('%Y-%m-%d %H:%M:%S') if user.updated_at else "",
            "lastUpdated": updated_at_fmt,
            "employeeId": sltb_profile.employee_id if sltb_profile else "",
            "employee_id": sltb_profile.employee_id if sltb_profile else "",
            "designation": sltb_profile.designation if sltb_profile else "",
            "rank": police_profile.rank if police_profile else "",
            "policeStation": police_profile.police_station if police_profile else "",
            "police_station": police_profile.police_station if police_profile else "",
            "badgeNumber": police_profile.badge_number if police_profile else "",
            "badge_number": police_profile.badge_number if police_profile else ""
        }

        return profile_data

    def update_profile(self, user_id, profile_data, photo_file=None):
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise ProfileServiceError("User account not found.", status_code=404)

        sltb_profile = self.sltb_user_repo.get_by_user_id(user_id)
        police_profile = self.police_officer_repo.get_by_user_id(user_id)

        val_errors = self.profile_update_validator.validate(profile_data)
        if val_errors:
            raise ProfileServiceError("Validation failed.", errors=val_errors, status_code=400)

        # Uniqueness checks excluding current user
        email = profile_data.get('email_address') or profile_data.get('email')
        if email and self.user_repo.get_by_email(email, exclude_user_id=user_id):
            raise ProfileServiceError("Validation failed.", errors={"email_address": "This email address is already in use by another account.", "email": "This email address is already in use by another account."}, status_code=409)

        employee_id = profile_data.get('employee_id') or profile_data.get('employeeId')
        if employee_id and sltb_profile and self.sltb_user_repo.get_by_employee_id(employee_id, exclude_user_id=user_id):
            raise ProfileServiceError("Validation failed.", errors={"employee_id": "This employee ID is already in use."}, status_code=409)

        badge_number = profile_data.get('badge_number') or profile_data.get('badgeNumber')
        if badge_number and police_profile and self.police_officer_repo.get_by_badge_number(badge_number, exclude_user_id=user_id):
            raise ProfileServiceError("Validation failed.", errors={"badge_number": "This badge number is already in use."}, status_code=409)

        # Handle profile photo upload replacement
        new_photo_path = None
        old_photo_path = user.profile_image
        if photo_file and getattr(photo_file, 'filename', None):
            try:
                new_photo_path = self.photo_service.save_photo(photo_file)
            except ProfilePhotoError as e:
                raise ProfileServiceError(e.message, errors=e.errors, status_code=e.status_code)

        full_name_input = profile_data.get("full_name") or profile_data.get("fullName") or profile_data.get("displayName")
        phone_input = profile_data.get("phone")
        joined_date_input = profile_data.get("joined_date") or profile_data.get("joinedDate")

        role = user.role
        role_name = role.role_name if role else "User"

        # Auto-create profile record if missing when updating
        if not police_profile and role_name in ["Police Admin", "Traffic Police Officer"]:
            police_profile = self.police_officer_repo.create({
                "user_id": user_id,
                "full_name": full_name_input or user.username,
                "badge_number": badge_number or f"PO{user_id:03d}",
                "rank": profile_data.get("rank") or ("Police Admin" if role_name == "Police Admin" else "Inspector"),
                "police_station": profile_data.get("police_station") or profile_data.get("policeStation") or "Police Headquarters",
                "phone": phone_input or "",
                "joined_date": joined_date_input
            }, commit=False)

        if not sltb_profile and role_name == "SLTB Admin":
            sltb_profile = self.sltb_user_repo.create({
                "user_id": user_id,
                "full_name": full_name_input or user.username,
                "employee_id": employee_id or f"EMP{user_id:03d}",
                "department": profile_data.get("department") or "SLTB Administration",
                "designation": profile_data.get("designation") or "SLTB Admin",
                "phone": phone_input or "",
                "joined_date": joined_date_input
            }, commit=False)

        try:
            # 1. Update users table (email, profile_image, status)
            if email:
                user.email = str(email).strip().lower()
            if new_photo_path:
                user.profile_image = new_photo_path
            status_val = profile_data.get("status")
            if status_val in ["Active", "Inactive"]:
                user.status = status_val

            # 2. Update role profile table
            if police_profile:
                self.police_officer_repo.update_profile(
                    user_id=user_id,
                    data={
                        "full_name": full_name_input,
                        "rank": profile_data.get("rank"),
                        "police_station": profile_data.get("police_station") or profile_data.get("policeStation"),
                        "phone": phone_input,
                        "badge_number": badge_number,
                        "joined_date": joined_date_input
                    },
                    commit=False
                )
            elif sltb_profile:
                self.sltb_user_repo.update_profile(
                    user_id=user_id,
                    data={
                        "full_name": full_name_input,
                        "employee_id": employee_id,
                        "phone": phone_input,
                        "department": profile_data.get("department"),
                        "designation": profile_data.get("designation"),
                        "joined_date": joined_date_input
                    },
                    commit=False
                )

            # 3. Log activity in same transaction
            activity_desc = f"Profile updated for user '{user.username}'."
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
            raise ProfileServiceError("Unable to update your profile. Please check your information and try again.", status_code=500) from e
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
            raise ProfileServiceError("Current password is incorrect.", errors={"current_password": "Current password is incorrect."}, status_code=400)

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
                "activity": f"Password updated successfully for user '{user.username}'."
            }, commit=False)

            db.session.commit()

            return {"message": "Password updated successfully."}

        except SQLAlchemyError as e:
            db.session.rollback()
            raise ProfileServiceError("Unable to update password. Please try again.", status_code=500) from e
        except Exception as e:
            db.session.rollback()
            if isinstance(e, ProfileServiceError):
                raise e
            raise ProfileServiceError("An unexpected error occurred while changing password.", status_code=500) from e
