from flask import Blueprint
from app.presentation.response_factory import ResponseFactory
from app.business.services.dashboard_service import DashboardService
from app.business.exceptions.application_exceptions import UnauthorizedRoleError
from flask_jwt_extended import jwt_required, get_jwt

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/v1/sltb')
dashboard_service = DashboardService()

def _check_sltb_admin_role():
    claims = get_jwt()
    if claims.get('role') != 'SLTB Admin':
        raise UnauthorizedRoleError("This account is not authorized to access SLTB Admin resources.")

@dashboard_bp.route('/dashboard/overview', methods=['GET'])
@jwt_required()
def get_dashboard_overview():
    _check_sltb_admin_role()
    data = dashboard_service.get_dashboard_overview()
    return ResponseFactory.success(data=data, message="Dashboard overview retrieved successfully.")

@dashboard_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_full_dashboard():
    _check_sltb_admin_role()
    data = dashboard_service.get_dashboard_overview()
    return ResponseFactory.success(data=data, message="Dashboard data loaded successfully.")

@dashboard_bp.route('/dashboard/summary', methods=['GET'])
@jwt_required()
def get_summary():
    _check_sltb_admin_role()
    summary = dashboard_service.dashboard_repo.get_summary_stats()
    return ResponseFactory.success(data=summary)
