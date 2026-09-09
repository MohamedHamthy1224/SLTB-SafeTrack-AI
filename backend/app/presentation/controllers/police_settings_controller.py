import json
import os
from flask import Blueprint, request, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.presentation.response_factory import ResponseFactory
from app.business.services.profile_service import ProfileService, ProfileServiceError
from app.business.services.settings_service import SettingsService
from app.business.exceptions.application_exceptions import ValidationError

police_settings_bp = Blueprint('police_settings', __name__, url_prefix='/api/v1/police/settings')
profile_service = ProfileService()
settings_service = SettingsService()

@police_settings_bp.route('/theme', methods=['GET'])
@jwt_required()
def get_police_theme():
    user_id = int(get_jwt_identity())
    data = settings_service.get_user_theme(user_id)
    return ResponseFactory.success(data=data, message="Theme preference retrieved successfully.")

@police_settings_bp.route('/theme', methods=['PUT', 'PATCH'])
@jwt_required()
def update_police_theme():
    user_id = int(get_jwt_identity())
    payload = request.get_json() or {}
    theme_val = payload.get('themePreference') or payload.get('theme_preference') or payload.get('theme')
    if not theme_val:
        raise ValidationError("Invalid input parameters.", errors={'theme_preference': 'Select a valid theme.'})

    data = settings_service.update_user_theme(user_id, theme_val)
    return ResponseFactory.success(data=data, message="Theme updated successfully")

@police_settings_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_police_profile():
    user_id = int(get_jwt_identity())
    try:
        data = profile_service.get_profile(user_id)
        # Format explicitly into user, role, officer objects as required by spec
        response_data = {
            "user": {
                "userId": data.get("user_id") or data.get("userId") or user_id,
                "username": data.get("username"),
                "email": data.get("email") or data.get("emailAddress"),
                "profileImage": data.get("profileImage") or data.get("profile_image"),
                "themePreference": data.get("themePreference") or data.get("theme_preference") or "light",
                "status": data.get("status") or "Active"
            },
            "role": {
                "roleName": data.get("role") or data.get("roleName") or "Police Admin"
            },
            "officer": {
                "fullName": data.get("fullName") or data.get("full_name") or data.get("displayName"),
                "badgeNumber": data.get("badgeNumber") or data.get("badge_number"),
                "rank": data.get("rank"),
                "policeStation": data.get("policeStation") or data.get("police_station"),
                "phone": data.get("phone"),
                "joinedDate": data.get("joinedDate") or data.get("joined_date")
            }
        }
        # Also preserve flat keys for backward compatibility
        response_data.update(data)
        return ResponseFactory.success(data=response_data, message="Profile retrieved successfully.")
    except ProfileServiceError as e:
        return ResponseFactory.error(message=e.message, errors=e.errors, status_code=e.status_code)
    except Exception:
        return ResponseFactory.error(message="Unable to retrieve profile information.", status_code=500)

@police_settings_bp.route('/profile', methods=['PUT', 'POST'])
@jwt_required()
def update_police_profile():
    user_id = int(get_jwt_identity())

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
        updated_data = profile_service.update_profile(user_id, profile_data, photo_file=photo_file)
        return ResponseFactory.success(data=updated_data, message="Profile updated successfully.")
    except ProfileServiceError as e:
        return ResponseFactory.error(message=e.message, errors=e.errors, status_code=e.status_code)
    except Exception:
        return ResponseFactory.error(message="Unable to update profile. Please try again.", status_code=500)

@police_settings_bp.route('/profile/photo', methods=['POST', 'PUT'])
@jwt_required()
def upload_police_photo():
    user_id = int(get_jwt_identity())
    photo_file = request.files.get('profile_image') or request.files.get('file') or request.files.get('profile_picture') or request.files.get('photo')
    if not photo_file:
        return ResponseFactory.error(message="No image file provided.", status_code=400)

    try:
        updated_data = profile_service.update_profile(user_id, {}, photo_file=photo_file)
        return ResponseFactory.success(data=updated_data, message="Profile photo updated successfully.")
    except ProfileServiceError as e:
        return ResponseFactory.error(message=e.message, errors=e.errors, status_code=e.status_code)
    except Exception:
        return ResponseFactory.error(message="Unable to upload profile photo.", status_code=500)

@police_settings_bp.route('/password', methods=['PUT', 'PATCH', 'POST'])
@jwt_required()
def update_police_password():
    user_id = int(get_jwt_identity())
    body = request.get_json() or {}

    current_pw = body.get('currentPassword') or body.get('current_password')
    new_pw = body.get('newPassword') or body.get('new_password')
    confirm_pw = body.get('confirmPassword') or body.get('confirm_password') or new_pw

    payload = {
        'current_password': current_pw,
        'new_password': new_pw,
        'confirm_password': confirm_pw
    }

    try:
        result = profile_service.change_password(user_id, payload)
        return ResponseFactory.success(data=result, message="Password updated successfully.")
    except ProfileServiceError as e:
        return ResponseFactory.error(message=e.message, errors=e.errors, status_code=e.status_code)
    except Exception:
        return ResponseFactory.error(message="Unable to update password.", status_code=500)
