from flask import Blueprint, request
from app.presentation.response_factory import ResponseFactory
from app.business.services.settings_service import SettingsService
from app.business.exceptions.application_exceptions import UnauthorizedRoleError, ValidationError
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity

settings_bp = Blueprint('settings', __name__, url_prefix='/api/v1')
settings_service = SettingsService()

@settings_bp.route('/settings/theme', methods=['GET'])
@settings_bp.route('/settings/theme/', methods=['GET'])
@settings_bp.route('/sltb/settings/theme', methods=['GET'])
@settings_bp.route('/sltb/settings/theme/', methods=['GET'])
@settings_bp.route('/police/settings/theme', methods=['GET'])
@settings_bp.route('/police/settings/theme/', methods=['GET'])
@jwt_required()
def get_theme_preference():
    user_id = int(get_jwt_identity())
    data = settings_service.get_user_theme(user_id)
    return ResponseFactory.success(data=data, message="Theme preference retrieved successfully.")

@settings_bp.route('/settings/theme', methods=['PATCH', 'PUT'])
@settings_bp.route('/settings/theme/', methods=['PATCH', 'PUT'])
@settings_bp.route('/sltb/settings/theme', methods=['PATCH', 'PUT'])
@settings_bp.route('/sltb/settings/theme/', methods=['PATCH', 'PUT'])
@settings_bp.route('/police/settings/theme', methods=['PATCH', 'PUT'])
@settings_bp.route('/police/settings/theme/', methods=['PATCH', 'PUT'])
@jwt_required()
def update_theme_preference():
    user_id = int(get_jwt_identity())
    payload = request.get_json() or {}
    
    theme_val = payload.get('theme_preference') or payload.get('themePreference')
    if not theme_val:
        raise ValidationError("Invalid input parameters.", errors={'theme_preference': 'Select a valid theme.'})

    data = settings_service.update_user_theme(user_id, theme_val)
    return ResponseFactory.success(data=data, message="Theme preference updated successfully.")
