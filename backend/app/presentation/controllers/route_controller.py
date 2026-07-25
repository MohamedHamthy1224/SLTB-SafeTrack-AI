from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.presentation.response_factory import ResponseFactory
from app.business.services.route_service import (
    RouteService,
    RouteServiceError,
    ResourceNotFoundError,
    RouteAlreadyInactiveError,
    DuplicateResourceError
)
from app.business.exceptions.application_exceptions import UnauthorizedRoleError

route_bp = Blueprint('route', __name__, url_prefix='/api/v1/sltb')
route_service = RouteService()

def _check_sltb_admin_role():
    claims = get_jwt()
    if claims.get('role') != 'SLTB Admin':
        raise UnauthorizedRoleError("This account is not authorized to access SLTB Admin resources.")

@route_bp.route('/routes/summary', methods=['GET'])
@jwt_required()
def get_route_summary():
    _check_sltb_admin_role()
    try:
        summary = route_service.get_summary()
        return ResponseFactory.success(data=summary, message="Route summary calculated successfully.")
    except RouteServiceError as e:
        return ResponseFactory.error(message=e.message, errors=e.errors, status_code=e.status_code)
    except Exception as e:
        return ResponseFactory.error(message="Unable to calculate route summary.", status_code=500)

@route_bp.route('/routes/filter-options', methods=['GET'])
@jwt_required()
def get_filter_options():
    _check_sltb_admin_role()
    try:
        options = route_service.get_filter_options()
        return ResponseFactory.success(data=options, message="Route filter options retrieved successfully.")
    except RouteServiceError as e:
        return ResponseFactory.error(message=e.message, errors=e.errors, status_code=e.status_code)
    except Exception as e:
        return ResponseFactory.error(message="Unable to retrieve filter options.", status_code=500)

@route_bp.route('/routes/status-options', methods=['GET'])
@jwt_required()
def get_status_options():
    _check_sltb_admin_role()
    try:
        options = route_service.get_status_options()
        return ResponseFactory.success(data=options, message="Route status options retrieved successfully.")
    except Exception as e:
        return ResponseFactory.error(message="Unable to retrieve status options.", status_code=500)

@route_bp.route('/routes', methods=['GET'])
@jwt_required()
def get_routes():
    _check_sltb_admin_role()
    try:
        params = {
            'search': request.args.get('search', ''),
            'status': request.args.get('status', ''),
            'start_location': request.args.get('start_location', ''),
            'end_location': request.args.get('end_location', ''),
            'page': request.args.get('page', 1),
            'per_page': request.args.get('per_page', 10),
            'sort_by': request.args.get('sort_by', 'route_number'),
            'order': request.args.get('order', 'asc')
        }
        data = route_service.get_routes(params)
        return ResponseFactory.success(data=data, message="Routes retrieved successfully.")
    except RouteServiceError as e:
        return ResponseFactory.error(message=e.message, errors=e.errors, status_code=e.status_code)
    except Exception as e:
        return ResponseFactory.error(message="Unable to fetch routes.", status_code=500)

@route_bp.route('/routes/<int:route_id>', methods=['GET'])
@jwt_required()
def get_route_details(route_id):
    _check_sltb_admin_role()
    try:
        data = route_service.get_route_details(route_id)
        return ResponseFactory.success(data=data, message="Route details retrieved successfully.")
    except RouteServiceError as e:
        return ResponseFactory.error(message=e.message, errors=e.errors, status_code=e.status_code)
    except Exception as e:
        return ResponseFactory.error(message="Unable to retrieve route details.", status_code=500)

@route_bp.route('/routes', methods=['POST'])
@jwt_required()
def create_route():
    _check_sltb_admin_role()
    current_user_id = get_jwt_identity()
    body = request.get_json() or {}
    try:
        result = route_service.create_route(body, user_id=current_user_id)
        return ResponseFactory.success(data=result, message="Route registered successfully.", status_code=201)
    except RouteServiceError as e:
        return ResponseFactory.error(message=e.message, errors=e.errors, status_code=e.status_code)
    except Exception as e:
        return ResponseFactory.error(message="Unable to create route.", status_code=500)

@route_bp.route('/routes/<int:route_id>', methods=['PUT'])
@jwt_required()
def update_route(route_id):
    _check_sltb_admin_role()
    current_user_id = get_jwt_identity()
    body = request.get_json() or {}
    try:
        result = route_service.update_route(route_id, body, user_id=current_user_id)
        return ResponseFactory.success(data=result, message="Route updated successfully.")
    except RouteServiceError as e:
        return ResponseFactory.error(message=e.message, errors=e.errors, status_code=e.status_code)
    except Exception as e:
        return ResponseFactory.error(message="Unable to update route.", status_code=500)

@route_bp.route('/routes/<int:route_id>/deactivate', methods=['PATCH'])
@jwt_required()
def deactivate_route(route_id):
    _check_sltb_admin_role()
    current_user_id = get_jwt_identity()
    try:
        result = route_service.deactivate_route(route_id, user_id=current_user_id)
        return ResponseFactory.success(data=result, message="Route deactivated successfully.")
    except RouteAlreadyInactiveError as e:
        return ResponseFactory.error(message=e.message, status_code=409)
    except ResourceNotFoundError as e:
        return ResponseFactory.error(message=e.message, status_code=404)
    except RouteServiceError as e:
        return ResponseFactory.error(message=e.message, errors=e.errors, status_code=e.status_code)
    except Exception as e:
        return ResponseFactory.error(message="Unable to deactivate the route at the moment.", status_code=500)
