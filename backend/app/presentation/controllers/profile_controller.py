import json
import os
from flask import Blueprint, request, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from app.presentation.response_factory import ResponseFactory
from app.business.services.profile_service import ProfileService, ProfileServiceError
from app.business.exceptions.application_exceptions import UnauthorizedRoleError

profile_bp = Blueprint('profile', __name__, url_prefix='/api/v1')
profile_service = ProfileService()

@profile_bp.route('/profile', methods=['GET'])
@profile_bp.route('/sltb/profile', methods=['GET'])
@profile_bp.route('/police/profile', methods=['GET'])
@profile_bp.route('/police/settings/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = int(get_jwt_identity())
    try:
        data = profile_service.get_profile(current_user_id)
        return ResponseFactory.success(data=data, message="Profile retrieved successfully.")
    except ProfileServiceError as e:
        return ResponseFactory.error(message=e.message, errors=e.errors, status_code=e.status_code)
    except Exception:
        return ResponseFactory.error(message="Unable to retrieve profile information.", status_code=500)

@profile_bp.route('/profile', methods=['PUT', 'POST'])
@profile_bp.route('/sltb/profile', methods=['PUT', 'POST'])
@profile_bp.route('/police/profile', methods=['PUT', 'POST'])
@profile_bp.route('/police/settings/profile', methods=['PUT', 'POST'])
@profile_bp.route('/police/settings/profile/photo', methods=['POST', 'PUT'])
@jwt_required()
def update_profile():
    current_user_id = int(get_jwt_identity())

    profile_data = {}
    photo_file = None

    if request.content_type and 'multipart/form-data' in request.content_type:
        profile_data_str = request.form.get('profile_data') or request.form.get('profile')
        if profile_data_str:
            try:
                profile_data = json.loads(profile_data_str)
            except Exception:
                profile_data = dict(request.form)
        else:
            profile_data = dict(request.form)
        photo_file = request.files.get('profile_image') or request.files.get('file') or request.files.get('profile_picture') or request.files.get('photo')
    else:
        body = request.get_json() or {}
        profile_data = body.get('profile') or body

    try:
        updated_data = profile_service.update_profile(current_user_id, profile_data, photo_file=photo_file)
        return ResponseFactory.success(data=updated_data, message="Profile updated successfully.")
    except ProfileServiceError as e:
        return ResponseFactory.error(message=e.message, errors=e.errors, status_code=e.status_code)
    except Exception:
        return ResponseFactory.error(message="Unable to update profile. Please try again.", status_code=500)

@profile_bp.route('/profile/password', methods=['PATCH', 'PUT', 'POST'])
@profile_bp.route('/sltb/profile/password', methods=['PATCH', 'PUT', 'POST'])
@profile_bp.route('/police/profile/password', methods=['PATCH', 'PUT', 'POST'])
@profile_bp.route('/police/settings/password', methods=['PATCH', 'PUT', 'POST'])
@jwt_required()
def change_password():
    current_user_id = int(get_jwt_identity())

    body = request.get_json() or {}
    # Handle both snake_case and camelCase parameters
    current_pw = body.get('current_password') or body.get('currentPassword')
    new_pw = body.get('new_password') or body.get('newPassword')
    confirm_pw = body.get('confirm_password') or body.get('confirmPassword') or new_pw

    payload = {
        'current_password': current_pw,
        'new_password': new_pw,
        'confirm_password': confirm_pw
    }

    try:
        result = profile_service.change_password(current_user_id, payload)
        return ResponseFactory.success(data=result, message="Password updated successfully.")
    except ProfileServiceError as e:
        return ResponseFactory.error(message=e.message, errors=e.errors, status_code=e.status_code)
    except Exception:
        return ResponseFactory.error(message="Unable to update password. Please try again.", status_code=500)

@profile_bp.route('/uploads/profiles/<path:filename>', methods=['GET'])
@profile_bp.route('/sltb/uploads/profiles/<path:filename>', methods=['GET'])
@profile_bp.route('/police/uploads/profiles/<path:filename>', methods=['GET'])
def serve_profile_upload(filename):
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    upload_dir = os.path.join(base_dir, 'static', 'uploads', 'profiles')
    return send_from_directory(upload_dir, filename)
