from app.business.services.base_authentication_service import BaseAuthenticationService
from app.data.repositories.user_repository import UserRepository
from app.data.repositories.session_repository import SessionRepository
from app.data.repositories.activity_log_repository import ActivityLogRepository
from app.business.exceptions.application_exceptions import (
    InvalidCredentialsError, InactiveAccountError, UnauthorizedRoleError
)
from app.domain.constants.roles import UserRole
from app.data.database import bcrypt
from flask_jwt_extended import create_access_token

class SLTBAuthenticationService(BaseAuthenticationService):

    def __init__(self, user_repo=None, session_repo=None, activity_log_repo=None):
        self.user_repo = user_repo or UserRepository()
        self.session_repo = session_repo or SessionRepository()
        self.activity_log_repo = activity_log_repo or ActivityLogRepository()

    def authenticate(self, identifier, password, ip_address=None, device_info=None):
        user_model = self.user_repo.get_by_identifier(identifier)
        if not user_model:
            raise InvalidCredentialsError("Invalid username/email or password.")

        # Compare password hash
        is_valid = False
        if user_model.password.startswith("$2b$") or user_model.password.startswith("$2a$"):
            is_valid = bcrypt.check_password_hash(user_model.password, password)
        else:
            # Handle standard hash matching if legacy plain-text seed exists
            import hashlib
            is_valid = (user_model.password == password or 
                        user_model.password == hashlib.sha256(password.encode('utf-8')).hexdigest())

        if not is_valid:
            raise InvalidCredentialsError("Invalid username/email or password.")

        if user_model.status != "Active":
            raise InactiveAccountError("This account is inactive. Contact the system administrator.")

        # Validate role permissions BEFORE creating session or issuing token
        self.authorize_role(user_model)

        role_name = user_model.role.role_name if user_model.role else "Unknown"

        # Create session record with IP & device metadata
        session = self.session_repo.create_session(
            user_id=user_model.user_id,
            ip_address=ip_address,
            device_info=device_info
        )

        # Log activity details
        module_name = UserRole.DASHBOARD_ROUTES.get(role_name, "/dashboard").split('/')[1].upper() if role_name in UserRole.DASHBOARD_ROUTES else "WEB"
        log_message = f"User '{user_model.username}' (Role: {role_name}) logged in to {module_name} module"
        if ip_address:
            log_message += f" from IP {ip_address}"
        self.activity_log_repo.log_activity(user_model.user_id, log_message)

        # Create JWT access token with expanded payload
        token = create_access_token(
            identity=str(user_model.user_id),
            additional_claims={
                'user_id': user_model.user_id,
                'role_id': user_model.role_id,
                'role_name': role_name,
                'role': role_name,
                'username': user_model.username,
                'email': user_model.email,
                'session_id': session.session_id
            }
        )

        return {
            'token': token,
            'user': user_model.to_safe_dict(),
            'session_id': session.session_id
        }

    def authorize_role(self, user):
        role_name = user.role.role_name if user.role else None
        
        # Check if role is Mobile-Only (Police Officers)
        if UserRole.is_mobile_only(role_name):
            raise UnauthorizedRoleError("Police Officer accounts can only access the Mobile Application.")

        # Check if role is permitted for Web Dashboard
        if not UserRole.is_web_permitted(role_name):
            raise UnauthorizedRoleError("This account role is not authorized to access the web application.")

        # If SLTB Admin, ensure linked profile exists
        if role_name == UserRole.SLTB_ADMIN and not user.sltb_profile:
            raise UnauthorizedRoleError("No linked SLTB Admin profile found for this account.")

        return True

