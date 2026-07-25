from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt
from app.presentation.response_factory import ResponseFactory
from app.data.repositories.route_repository import RouteRepository
from app.business.exceptions.application_exceptions import UnauthorizedRoleError

route_option_bp = Blueprint('route_option', __name__, url_prefix='/api/v1/sltb')
route_repo = RouteRepository()

def _check_sltb_admin_role():
    claims = get_jwt()
    if claims.get('role') != 'SLTB Admin':
        raise UnauthorizedRoleError("This account is not authorized to access SLTB Admin resources.")

@route_option_bp.route('/routes/options', methods=['GET'])
@jwt_required()
def get_route_options():
    _check_sltb_admin_role()
    try:
        routes = route_repo.get_active_routes()
        options = []
        seen_ids = set()

        for r in routes:
            if not r or r.route_id in seen_ids or r.status != 'Active':
                continue
            seen_ids.add(r.route_id)

            options.append({
                'route_id': r.route_id,
                'route_number': r.route_number,
                'route_name': r.route_name,
                'start_location': r.start_location,
                'end_location': r.end_location,
                'status': r.status,
                # Aliases for camelCase compatibility
                'routeId': r.route_id,
                'routeNumber': r.route_number,
                'routeName': r.route_name,
                'startLocation': r.start_location,
                'endLocation': r.end_location
            })
        return ResponseFactory.success(data=options, message="Route options fetched successfully.")
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)
