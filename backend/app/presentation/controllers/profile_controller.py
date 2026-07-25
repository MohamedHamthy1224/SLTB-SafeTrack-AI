import json
import os
from flask import Blueprint, request, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from app.presentation.response_factory import ResponseFactory
from app.business.services.profile_service import ProfileService, ProfileServiceError
from app.business.exceptions.application_exceptions import UnauthorizedRoleError

profile_bp = Blueprint('profile', __name__, url_prefix='/api/v1/sltb')
profile_service = ProfileService()

def _check_sltb_admin_role():
    claims = get_jwt()
    if claims.get('role') != 'SLTB Admin':
        raise UnauthorizedRoleError("This account is not authorized to access SLTB Admin resources.")

@profile_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    _check_sltb_admin_role()
    current_user_id = int(get_jwt_identity())
    try:
        data = profile_service.get_profile(current_user_id)
        return ResponseFactory.success(data=data, message="Profile retrieved successfully.")
    except ProfileServiceError as e:
        return ResponseFactory.error(message=e.message, errors=e.errors, status_code=e.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@profile_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    _check_sltb_admin_role()
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
        photo_file = request.files.get('profile_image') or request.files.get('file') or request.files.get('profile_picture')
    else:
        body = request.get_json() or {}
        profile_data = body.get('profile') or body

    try:
        updated_data = profile_service.update_profile(current_user_id, profile_data, photo_file=photo_file)
        return ResponseFactory.success(data=updated_data, message="Profile updated successfully.")
    except ProfileServiceError as e:
        return ResponseFactory.error(message=e.message, errors=e.errors, status_code=e.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@profile_bp.route('/profile/password', methods=['PATCH'])
@jwt_required()
def change_password():
    _check_sltb_admin_role()
    current_user_id = int(get_jwt_identity())

    body = request.get_json() or {}

    try:
        result = profile_service.change_password(current_user_id, body)
        return ResponseFactory.success(data=result, message="Password updated successfully.")
    except ProfileServiceError as e:
        return ResponseFactory.error(message=e.message, errors=e.errors, status_code=e.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@profile_bp.route('/uploads/profiles/<path:filename>', methods=['GET'])
def serve_profile_upload(filename):
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    upload_dir = os.path.join(base_dir, 'static', 'uploads', 'profiles')
    return send_from_directory(upload_dir, filename)
