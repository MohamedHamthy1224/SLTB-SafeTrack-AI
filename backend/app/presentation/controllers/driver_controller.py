import json
import os
from flask import Blueprint, request, send_from_directory, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from app.presentation.response_factory import ResponseFactory
from app.business.services.driver_service import DriverService, DriverServiceError
from app.business.exceptions.application_exceptions import UnauthorizedRoleError

driver_bp = Blueprint('driver', __name__, url_prefix='/api/v1/sltb')
driver_service = DriverService()

def _check_sltb_admin_role():
    claims = get_jwt()
    if claims.get('role') != 'SLTB Admin':
        raise UnauthorizedRoleError("This account is not authorized to access SLTB Admin resources.")

@driver_bp.route('/drivers/summary', methods=['GET'])
@jwt_required()
def get_driver_summary():
    _check_sltb_admin_role()
    try:
        summary = driver_service.get_summary()
        return ResponseFactory.success(data=summary, message="Driver summary loaded successfully.")
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@driver_bp.route('/drivers/filter-options', methods=['GET'])
@jwt_required()
def get_filter_options():
    _check_sltb_admin_role()
    try:
        options = driver_service.get_filter_options()
        return ResponseFactory.success(data=options, message="Filter options loaded successfully.")
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@driver_bp.route('/drivers/status-options', methods=['GET'])
@jwt_required()
def get_status_options():
    _check_sltb_admin_role()
    try:
        options = driver_service.get_status_options()
        return ResponseFactory.success(data=options, message="Status options loaded successfully.")
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@driver_bp.route('/drivers', methods=['GET'])
@jwt_required()
def get_drivers():
    _check_sltb_admin_role()
    try:
        params = {
            'search': request.args.get('search', ''),
            'status': request.args.get('status'),
            'gender': request.args.get('gender'),
            'page': request.args.get('page', 1),
            'per_page': request.args.get('per_page', 10),
            'sort_by': request.args.get('sort_by', 'driver_id'),
            'order': request.args.get('order', 'asc')
        }
        data = driver_service.get_drivers(params)
        return ResponseFactory.success(data=data, message="Drivers retrieved successfully.")
    except DriverServiceError as e:
        return ResponseFactory.error(message=e.message, errors=e.errors, status_code=e.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@driver_bp.route('/drivers/<int:driver_id>', methods=['GET'])
@jwt_required()
def get_driver_details(driver_id):
    _check_sltb_admin_role()
    try:
        data = driver_service.get_driver_details(driver_id)
        return ResponseFactory.success(data=data, message="Driver details retrieved successfully.")
    except DriverServiceError as e:
        return ResponseFactory.error(message=e.message, errors=e.errors, status_code=e.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@driver_bp.route('/drivers/<int:driver_id>/assignment-options', methods=['GET'])
@jwt_required()
def get_assignment_options(driver_id):
    _check_sltb_admin_role()
    try:
        data = driver_service.get_assignment_options(driver_id)
        return ResponseFactory.success(data=data, message="Assignment options retrieved successfully.")
    except DriverServiceError as e:
        return ResponseFactory.error(message=e.message, errors=e.errors, status_code=e.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@driver_bp.route('/drivers', methods=['POST'])
@jwt_required()
def create_driver():
    _check_sltb_admin_role()
    current_user_id = get_jwt_identity()

    driver_data = {}
    image_file = None

    if request.content_type and 'multipart/form-data' in request.content_type:
        driver_data_str = request.form.get('driver_data') or request.form.get('driver')
        if driver_data_str:
            try:
                driver_data = json.loads(driver_data_str)
            except Exception:
                driver_data = dict(request.form)
        else:
            driver_data = dict(request.form)
        image_file = request.files.get('profile_picture') or request.files.get('file')
    else:
        body = request.get_json() or {}
        driver_data = body.get('driver') or body

    try:
        result = driver_service.create_driver(driver_data, image_file=image_file, user_id=current_user_id)
        return ResponseFactory.success(data=result, message="Driver registered successfully.", status_code=201)
    except DriverServiceError as e:
        return ResponseFactory.error(message=e.message, errors=e.errors, status_code=e.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@driver_bp.route('/drivers/<int:driver_id>', methods=['PUT'])
@jwt_required()
def update_driver(driver_id):
    _check_sltb_admin_role()
    current_user_id = get_jwt_identity()

    driver_data = {}
    assignment_data = None
    image_file = None

    if request.content_type and 'multipart/form-data' in request.content_type:
        driver_data_str = request.form.get('driver_data') or request.form.get('driver')
        if driver_data_str:
            try:
                driver_data = json.loads(driver_data_str)
            except Exception:
                driver_data = dict(request.form)
        else:
            driver_data = dict(request.form)

        assign_data_str = request.form.get('assignment_data') or request.form.get('assignment')
        if assign_data_str:
            try:
                assignment_data = json.loads(assign_data_str)
            except Exception:
                pass
        if not assignment_data and ('bus_id' in request.form or 'route_id' in request.form):
            assignment_data = {
                'bus_id': request.form.get('bus_id'),
                'route_id': request.form.get('route_id')
            }

        image_file = request.files.get('profile_picture') or request.files.get('file')
    else:
        body = request.get_json() or {}
        driver_data = body.get('driver') or body
        assignment_data = body.get('assignment') or {
            'bus_id': body.get('bus_id'),
            'route_id': body.get('route_id')
        }

    try:
        result = driver_service.update_driver(
            driver_id=driver_id,
            driver_data=driver_data,
            assignment_data=assignment_data,
            image_file=image_file,
            user_id=current_user_id
        )
        return ResponseFactory.success(data=result, message="Driver updated successfully.")
    except DriverServiceError as e:
        return ResponseFactory.error(message=e.message, errors=e.errors, status_code=e.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@driver_bp.route('/drivers/<int:driver_id>/deactivate', methods=['PATCH'])
@jwt_required()
def deactivate_driver(driver_id):
    _check_sltb_admin_role()
    current_user_id = get_jwt_identity()

    try:
        result = driver_service.deactivate_driver(driver_id, user_id=current_user_id)
        return ResponseFactory.success(data=result, message="Driver deactivated successfully.")
    except DriverServiceError as e:
        return ResponseFactory.error(message=e.message, errors=e.errors, status_code=e.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@driver_bp.route('/uploads/drivers/<path:filename>', methods=['GET'])
def serve_driver_upload(filename):
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    upload_dir = os.path.join(base_dir, 'static', 'uploads', 'drivers')
    return send_from_directory(upload_dir, filename)
