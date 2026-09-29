from datetime import datetime
from flask import Blueprint, request, Response
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from app.presentation.response_factory import ResponseFactory
from app.business.services.roadside_unit_service import RoadsideUnitService, RoadsideUnitServiceError
from app.business.exceptions.application_exceptions import UnauthorizedRoleError, ValidationError, ApplicationError

police_roadside_unit_bp = Blueprint('police_roadside_unit', __name__, url_prefix='/api/v1/police/u-turn-management')
roadside_unit_service = RoadsideUnitService()

def _check_police_admin_role():
    claims = get_jwt()
    role = claims.get('role')
    if role not in ['Police Admin', 'Traffic Police Officer']:
        raise UnauthorizedRoleError("This action is restricted to Police Admin accounts.")

@police_roadside_unit_bp.route('', methods=['GET'])
@police_roadside_unit_bp.route('/', methods=['GET'])
@jwt_required()
def get_all_uturn_units():
    _check_police_admin_role()
    try:
        keyword = request.args.get('keyword') or request.args.get('search') or ''
        status = request.args.get('status')
        route_id = request.args.get('route_id') or request.args.get('routeId')

        units = roadside_unit_service.get_units(keyword=keyword, status=status, route_id=route_id)
        return ResponseFactory.success(data=units, message="U-Turn units retrieved successfully.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_roadside_unit_bp.route('/summary', methods=['GET'])
@jwt_required()
def get_uturn_summary():
    _check_police_admin_role()
    try:
        summary = roadside_unit_service.get_summary()
        return ResponseFactory.success(data=summary, message="U-Turn summary loaded successfully.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_roadside_unit_bp.route('/search', methods=['GET'])
@jwt_required()
def search_uturn_units():
    _check_police_admin_role()
    try:
        keyword = request.args.get('keyword') or request.args.get('search') or request.args.get('q') or ''
        status = request.args.get('status')
        route_id = request.args.get('route_id') or request.args.get('routeId')

        units = roadside_unit_service.get_units(keyword=keyword, status=status, route_id=route_id)
        return ResponseFactory.success(data=units, message="U-Turn search results retrieved successfully.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_roadside_unit_bp.route('/statuses', methods=['GET'])
@jwt_required()
def get_uturn_statuses():
    _check_police_admin_role()
    try:
        statuses = roadside_unit_service.get_statuses()
        return ResponseFactory.success(data=statuses, message="U-Turn statuses loaded successfully.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_roadside_unit_bp.route('/routes', methods=['GET'])
@jwt_required()
def get_uturn_routes():
    _check_police_admin_role()
    try:
        routes = roadside_unit_service.get_routes()
        return ResponseFactory.success(data=routes, message="Routes loaded successfully.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_roadside_unit_bp.route('/devices', methods=['GET'])
@jwt_required()
def get_uturn_devices():
    _check_police_admin_role()
    try:
        devices = roadside_unit_service.get_devices()
        return ResponseFactory.success(data=devices, message="Devices loaded successfully.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_roadside_unit_bp.route('/<int:unit_id>', methods=['GET'])
@jwt_required()
def get_uturn_unit_by_id(unit_id):
    _check_police_admin_role()
    try:
        unit = roadside_unit_service.get_unit_by_id(unit_id)
        return ResponseFactory.success(data=unit, message="U-Turn unit details retrieved successfully.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_roadside_unit_bp.route('', methods=['POST'])
@police_roadside_unit_bp.route('/', methods=['POST'])
@jwt_required()
def create_uturn_unit():
    _check_police_admin_role()
    current_user_id = get_jwt_identity()
    data = request.get_json() or {}
    try:
        created = roadside_unit_service.create_unit(data, user_id=current_user_id)
        return ResponseFactory.success(data=created, message="U-Turn unit created successfully.", status_code=201)
    except ValidationError as ve:
        return ResponseFactory.error(message=ve.message, errors=ve.errors, status_code=400)
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_roadside_unit_bp.route('/<int:unit_id>', methods=['PUT'])
@jwt_required()
def update_uturn_unit(unit_id):
    _check_police_admin_role()
    current_user_id = get_jwt_identity()
    data = request.get_json() or {}
    try:
        updated = roadside_unit_service.update_unit(unit_id, data, user_id=current_user_id)
        return ResponseFactory.success(data=updated, message="U-Turn unit updated successfully.")
    except ValidationError as ve:
        return ResponseFactory.error(message=ve.message, errors=ve.errors, status_code=400)
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_roadside_unit_bp.route('/<int:unit_id>/inactive', methods=['PUT', 'PATCH'])
@jwt_required()
def deactivate_uturn_unit(unit_id):
    _check_police_admin_role()
    current_user_id = get_jwt_identity()
    try:
        result = roadside_unit_service.deactivate_unit(unit_id, user_id=current_user_id)
        return ResponseFactory.success(data=result, message="U-Turn unit deactivated successfully.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_roadside_unit_bp.route('/export/pdf', methods=['GET'])
@jwt_required()
def export_uturn_units_pdf():
    _check_police_admin_role()
    current_user_id = get_jwt_identity()
    try:
        search = request.args.get('search') or request.args.get('keyword') or ''
        status = request.args.get('status')
        route_id = request.args.get('route_id') or request.args.get('routeId')

        pdf_bytes = roadside_unit_service.export_pdf(
            search=search,
            status=status,
            route_id=route_id,
            current_user_id=current_user_id
        )

        filename = f"SLTB_SafeTrack_UTurn_Units_{datetime.now().strftime('%Y-%m-%d')}.pdf"
        return Response(
            pdf_bytes,
            mimetype="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)
