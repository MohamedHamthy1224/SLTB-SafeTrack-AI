from flask import Blueprint, request
from app.presentation.response_factory import ResponseFactory
from app.business.validators.login_validator import LoginValidator
from app.business.validators.forgot_password_validator import ForgotPasswordValidator
from app.business.validators.reset_password_validator import ResetPasswordValidator
from app.business.services.sltb_authentication_service import SLTBAuthenticationService
from app.business.services.password_reset_service import PasswordResetService
from app.business.services.session_service import SessionService
from app.business.exceptions.application_exceptions import ValidationError
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

auth_bp = Blueprint('auth', __name__, url_prefix='/api/v1/auth')

login_validator = LoginValidator()
forgot_validator = ForgotPasswordValidator()
reset_validator = ResetPasswordValidator()

auth_service = SLTBAuthenticationService()
reset_service = PasswordResetService()
session_service = SessionService()

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    errors = login_validator.validate(data)
    if errors:
        raise ValidationError("Invalid input parameters.", errors=errors)

    identifier = data.get('identifier', '').strip()
    password = data.get('password', '')
    ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
    if ip_address and ',' in ip_address:
        ip_address = ip_address.split(',')[0].strip()
    device_info = request.headers.get('User-Agent', '')

    result = auth_service.authenticate(
        identifier, 
        password, 
        ip_address=ip_address, 
        device_info=device_info
    )
    return ResponseFactory.success(data=result, message="Authentication successful. Welcome to SLTB SafeTrack AI.")

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    claims = get_jwt()
    session_id = claims.get('session_id')
    if session_id:
        session_service.end_session(session_id)
    return ResponseFactory.success(message="Logged out successfully.")

@auth_bp.route('/session', methods=['GET'])
@jwt_required()
def check_session():
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    user_info = auth_service.user_repo.get_by_id(current_user_id)
    if not user_info or user_info.status != "Active":
        return ResponseFactory.error(message="Session expired or invalid user.", status_code=401)
    
    return ResponseFactory.success(data={
        'authenticated': True,
        'user': user_info.to_safe_dict()
    }, message="Active session verified.")

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    user_info = auth_service.user_repo.get_by_id(current_user_id)
    if not user_info:
        return ResponseFactory.error(message="User not found.", status_code=404)
    return ResponseFactory.success(data=user_info.to_safe_dict())

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json() or {}
    errors = forgot_validator.validate(data)
    if errors:
        raise ValidationError("Validation failed.", errors=errors)

    email = data.get('email', '').strip()
    msg = reset_service.request_password_reset(email)
    return ResponseFactory.success(message=msg)

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json() or {}
    errors = reset_validator.validate(data)
    if errors:
        raise ValidationError("Validation failed.", errors=errors)

    token = data.get('token', '').strip()
    new_password = data.get('new_password', '')

    reset_service.reset_password(token, new_password)
    return ResponseFactory.success(message="Password reset successfully. You may now log in with your new password.")
