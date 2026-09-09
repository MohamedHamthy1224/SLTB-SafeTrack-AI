from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.presentation.response_factory import ResponseFactory
from app.business.services.device_service import DeviceService, DeviceServiceError
from app.business.exceptions.application_exceptions import UnauthorizedRoleError, ValidationError, ApplicationError

police_device_bp = Blueprint('police_device', __name__, url_prefix='/api/v1/police/devices')
device_service = DeviceService()

def _check_police_admin_role():
    claims = get_jwt()
    role = claims.get('role')
    if role not in ['Police Admin', 'Traffic Police Officer']:
        raise UnauthorizedRoleError("This action is restricted to Police Admin accounts.")

@police_device_bp.route('', methods=['GET'])
@police_device_bp.route('/', methods=['GET'])
@jwt_required()
def get_devices():
    _check_police_admin_role()
    try:
        keyword = request.args.get('keyword') or request.args.get('search') or ''
        device_type = request.args.get('device_type') or request.args.get('deviceType')
        status = request.args.get('status')

        devices = device_service.get_devices(keyword=keyword, device_type=device_type, status=status)
        return ResponseFactory.success(data=devices, message="Devices retrieved successfully.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_device_bp.route('/summary', methods=['GET'])
@jwt_required()
def get_device_summary():
    _check_police_admin_role()
    try:
        summary = device_service.get_summary()
        return ResponseFactory.success(data=summary, message="Device summary loaded successfully.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_device_bp.route('/types', methods=['GET'])
@jwt_required()
def get_device_types():
    _check_police_admin_role()
    try:
        types = device_service.get_device_types()
        return ResponseFactory.success(data=types, message="Device types loaded successfully.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_device_bp.route('/statuses', methods=['GET'])
@jwt_required()
def get_device_statuses():
    _check_police_admin_role()
    try:
        statuses = device_service.get_device_statuses()
        return ResponseFactory.success(data=statuses, message="Device statuses loaded successfully.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_device_bp.route('/bus-statuses', methods=['GET'])
@jwt_required()
def get_bus_device_statuses():
    _check_police_admin_role()
    try:
        statuses = device_service.get_bus_device_statuses()
        return ResponseFactory.success(data=statuses, message="Bus device statuses loaded successfully.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_device_bp.route('/buses', methods=['GET'])
@jwt_required()
def get_buses_for_assignment():
    _check_police_admin_role()
    try:
        buses = device_service.get_available_buses()
        return ResponseFactory.success(data=buses, message="Buses loaded successfully.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_device_bp.route('/<int:device_id>', methods=['GET'])
@jwt_required()
def get_device_by_id(device_id):
    _check_police_admin_role()
    try:
        device = device_service.get_device_by_id(device_id)
        return ResponseFactory.success(data=device, message="Device details retrieved successfully.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_device_bp.route('', methods=['POST'])
@police_device_bp.route('/', methods=['POST'])
@jwt_required()
def create_device():
    _check_police_admin_role()
    current_user_id = get_jwt_identity()
    data = request.get_json() or {}
    try:
        created = device_service.create_device(data, user_id=current_user_id)
        return ResponseFactory.success(data=created, message="Device created successfully.", status_code=201)
    except ValidationError as ve:
        return ResponseFactory.error(message=ve.message, errors=ve.errors, status_code=400)
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_device_bp.route('/<int:device_id>', methods=['PUT'])
@jwt_required()
def update_device(device_id):
    _check_police_admin_role()
    current_user_id = get_jwt_identity()
    data = request.get_json() or {}
    try:
        updated = device_service.update_device(device_id, data, user_id=current_user_id)
        return ResponseFactory.success(data=updated, message="Device updated successfully.")
    except ValidationError as ve:
        return ResponseFactory.error(message=ve.message, errors=ve.errors, status_code=400)
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_device_bp.route('/<int:device_id>/inactive', methods=['PUT', 'PATCH'])
@jwt_required()
def set_device_inactive(device_id):
    _check_police_admin_role()
    current_user_id = get_jwt_identity()
    try:
        result = device_service.set_inactive(device_id, user_id=current_user_id)
        return ResponseFactory.success(data=result, message="Device status updated to Inactive successfully.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)
