from app.business.services.base_authentication_service import BaseAuthenticationService
from app.data.repositories.user_repository import UserRepository
from app.data.repositories.session_repository import SessionRepository
from app.data.repositories.activity_log_repository import ActivityLogRepository
from app.business.exceptions.application_exceptions import (
    InvalidCredentialsError, InactiveAccountError, UnauthorizedRoleError
)
from app.data.database import bcrypt
from flask_jwt_extended import create_access_token

class SLTBAuthenticationService(BaseAuthenticationService):

    def __init__(self, user_repo=None, session_repo=None, activity_log_repo=None):
        self.user_repo = user_repo or UserRepository()
        self.session_repo = session_repo or SessionRepository()
        self.activity_log_repo = activity_log_repo or ActivityLogRepository()

    def authenticate(self, identifier, password):
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

        self.authorize_role(user_model)

        if not user_model.sltb_profile:
            raise UnauthorizedRoleError("No linked SLTB Admin profile found for this account.")

        # Create session record & log activity
        session = self.session_repo.create_session(user_model.user_id)
        self.activity_log_repo.log_activity(user_model.user_id, "User logged in to SLTB Admin Dashboard")

        # Create JWT access token with role claims
        token = create_access_token(
            identity=str(user_model.user_id),
            additional_claims={
                'role': user_model.role.role_name if user_model.role else '',
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
        if role_name != "SLTB Admin":
            raise UnauthorizedRoleError("This account is not authorized to access the SLTB Admin dashboard.")
        return True
