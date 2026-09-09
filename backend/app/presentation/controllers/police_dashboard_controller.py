from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from app.presentation.response_factory import ResponseFactory
from app.business.services.police_dashboard_service import PoliceDashboardService
from app.business.exceptions.application_exceptions import UnauthorizedRoleError, ApplicationError

police_dashboard_bp = Blueprint('police_dashboard', __name__, url_prefix='/api/v1/police/dashboard')
police_dashboard_service = PoliceDashboardService()

def _check_police_admin_role():
    claims = get_jwt()
    role = claims.get('role')
    if role not in ['Police Admin', 'Traffic Police Officer']:
        raise UnauthorizedRoleError("This action is restricted to Police Admin accounts.")

@police_dashboard_bp.route('', methods=['GET'])
@police_dashboard_bp.route('/', methods=['GET'])
@jwt_required()
def get_police_dashboard():
    _check_police_admin_role()
    current_user_id = get_jwt_identity()
    period = request.args.get('period', 'This Week')
    try:
        data = police_dashboard_service.get_dashboard_data(period=period, request_user_id=current_user_id)
        return ResponseFactory.success(data=data, message="Police dashboard data retrieved successfully.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_dashboard_bp.route('/charts', methods=['GET'])
@jwt_required()
def get_police_dashboard_charts():
    _check_police_admin_role()
    period = request.args.get('period', 'This Week')
    try:
        charts = police_dashboard_service.get_alerts_chart(period=period)
        return ResponseFactory.success(data=charts, message="Alerts overview chart data retrieved.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_dashboard_bp.route('/safety-monitors', methods=['GET'])
@jwt_required()
def get_police_dashboard_safety_monitors():
    _check_police_admin_role()
    try:
        monitors = police_dashboard_service.get_safety_monitors()
        return ResponseFactory.success(data=monitors, message="Live safety monitor readings loaded.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)
