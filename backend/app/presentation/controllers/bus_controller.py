from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.presentation.response_factory import ResponseFactory
from app.business.services.bus_service import BusService, BusServiceError
from app.business.exceptions.application_exceptions import UnauthorizedRoleError

bus_bp = Blueprint('bus', __name__, url_prefix='/api/v1/sltb')
bus_service = BusService()

def _check_sltb_admin_role():
    claims = get_jwt()
    if claims.get('role') != 'SLTB Admin':
        raise UnauthorizedRoleError("This account is not authorized to access SLTB Admin resources.")

@bus_bp.route('/buses/summary', methods=['GET'])
@jwt_required()
def get_bus_summary():
    _check_sltb_admin_role()
    try:
        summary = bus_service.get_summary()
        return ResponseFactory.success(data=summary, message="Bus summary loaded successfully.")
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@bus_bp.route('/buses/filter-options', methods=['GET'])
@jwt_required()
def get_filter_options():
    _check_sltb_admin_role()
    try:
        options = bus_service.get_filter_options()
        return ResponseFactory.success(data=options, message="Filter options loaded successfully.")
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@bus_bp.route('/buses', methods=['GET'])
@jwt_required()
def get_buses():
    _check_sltb_admin_role()
    try:
        params = {
            'search': request.args.get('search', ''),
            'route_id': request.args.get('route_id'),
            'driver_id': request.args.get('driver_id'),
            'status': request.args.get('status'),
            'page': request.args.get('page', 1),
            'per_page': request.args.get('per_page', 10),
            'sort_by': request.args.get('sort_by', 'bus_number'),
            'order': request.args.get('order', 'asc')
        }
        data = bus_service.get_buses(params)
        return ResponseFactory.success(data=data, message="Buses retrieved successfully.")
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@bus_bp.route('/buses/<int:bus_id>', methods=['GET'])
@jwt_required()
def get_bus_details(bus_id):
    _check_sltb_admin_role()
    try:
        data = bus_service.get_bus_details(bus_id)
        return ResponseFactory.success(data=data, message="Bus details retrieved successfully.")
    except BusServiceError as e:
        return ResponseFactory.error(message=e.message, errors=e.errors, status_code=e.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@bus_bp.route('/buses', methods=['POST'])
@jwt_required()
def create_bus():
    _check_sltb_admin_role()
    current_user_id = get_jwt_identity()
    body = request.get_json() or {}

    bus_data = body.get('bus') or body
    assignment_data = body.get('assignment') or {
        'route_id': body.get('route_id'),
        'driver_id': body.get('driver_id')
    }

    try:
        result = bus_service.create_bus_with_assignment(bus_data, assignment_data, user_id=current_user_id)
        return ResponseFactory.success(data=result, message="Bus registered and assigned successfully.", status_code=201)
    except BusServiceError as e:
        return ResponseFactory.error(message=e.message, errors=e.errors, status_code=e.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@bus_bp.route('/buses/<int:bus_id>', methods=['PUT'])
@jwt_required()
def update_bus(bus_id):
    _check_sltb_admin_role()
    current_user_id = get_jwt_identity()
    body = request.get_json() or {}

    bus_data = body.get('bus') or body
    assignment_data = body.get('assignment') or {
        'route_id': body.get('route_id'),
        'driver_id': body.get('driver_id')
    }

    try:
        result = bus_service.update_bus_with_assignment(bus_id, bus_data, assignment_data, user_id=current_user_id)
        return ResponseFactory.success(data=result, message="Bus details updated successfully.")
    except BusServiceError as e:
        return ResponseFactory.error(message=e.message, errors=e.errors, status_code=e.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@bus_bp.route('/buses/<int:bus_id>/deactivate', methods=['PATCH'])
@jwt_required()
def deactivate_bus(bus_id):
    _check_sltb_admin_role()
    current_user_id = get_jwt_identity()
    try:
        result = bus_service.deactivate_bus(bus_id, user_id=current_user_id)
        return ResponseFactory.success(data=result, message="Bus deactivated successfully.")
    except BusServiceError as e:
        return ResponseFactory.error(message=e.message, errors=e.errors, status_code=e.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

