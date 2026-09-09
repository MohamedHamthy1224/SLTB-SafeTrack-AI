from datetime import datetime, timezone
from flask import Blueprint, request, Response
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from app.presentation.response_factory import ResponseFactory
from app.business.services.system_log_service import SystemLogService, SystemLogServiceError
from app.business.exceptions.application_exceptions import UnauthorizedRoleError, ApplicationError

police_system_log_bp = Blueprint('police_system_logs', __name__, url_prefix='/api/v1/police/system-logs')
system_log_service = SystemLogService()

def _check_police_admin_role():
    claims = get_jwt()
    role = claims.get('role')
    if role not in ['Police Admin', 'Traffic Police Officer']:
        raise UnauthorizedRoleError("This action is restricted to Police Admin accounts.")

@police_system_log_bp.route('', methods=['GET'])
@police_system_log_bp.route('/', methods=['GET'])
@jwt_required()
def get_system_logs():
    try:
        keyword = request.args.get('keyword') or request.args.get('search')
        user_id = request.args.get('userId') or request.args.get('user_id')
        start_date = request.args.get('startDate') or request.args.get('start_date')
        end_date = request.args.get('endDate') or request.args.get('end_date')
        sort_by = request.args.get('sortBy') or request.args.get('sort_by')
        sort_order = request.args.get('sortOrder') or request.args.get('sort_order', 'desc')
        page = request.args.get('page')
        per_page = request.args.get('perPage') or request.args.get('per_page')

        logs_data = system_log_service.get_logs(
            keyword=keyword,
            user_id=user_id,
            start_date=start_date,
            end_date=end_date,
            sort_by=sort_by,
            sort_order=sort_order,
            page=page,
            per_page=per_page
        )
        return ResponseFactory.success(data=logs_data, message="System logs retrieved successfully.")
    except SystemLogServiceError as e:
        return ResponseFactory.error(message=e.message, status_code=e.status_code)
    except Exception:
        return ResponseFactory.error(message="Unable to fetch system logs.", status_code=500)

@police_system_log_bp.route('/summary', methods=['GET'])
@jwt_required()
def get_system_logs_summary():
    try:
        summary = system_log_service.get_summary()
        return ResponseFactory.success(data=summary, message="System logs summary retrieved successfully.")
    except Exception:
        return ResponseFactory.error(message="Unable to compute summary statistics.", status_code=500)

@police_system_log_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users_options():
    try:
        options = system_log_service.get_users_options()
        return ResponseFactory.success(data=options, message="User filter options loaded successfully.")
    except Exception:
        return ResponseFactory.error(message="Unable to load user options.", status_code=500)

@police_system_log_bp.route('/activity-by-day', methods=['GET'])
@jwt_required()
def get_activity_by_day():
    try:
        data = system_log_service.get_activity_by_day()
        return ResponseFactory.success(data=data, message="Activity by day retrieved successfully.")
    except Exception:
        return ResponseFactory.error(message="Unable to compute activity by day chart data.", status_code=500)

@police_system_log_bp.route('/user-distribution', methods=['GET'])
@jwt_required()
def get_user_distribution():
    try:
        data = system_log_service.get_user_distribution()
        return ResponseFactory.success(data=data, message="User distribution retrieved successfully.")
    except Exception:
        return ResponseFactory.error(message="Unable to compute user distribution data.", status_code=500)

@police_system_log_bp.route('/recent', methods=['GET'])
@jwt_required()
def get_recent_activities():
    try:
        limit = int(request.args.get('limit', 10))
        data = system_log_service.get_recent_activities(limit=limit)
        return ResponseFactory.success(data=data, message="Recent activities retrieved successfully.")
    except Exception:
        return ResponseFactory.error(message="Unable to fetch recent activities.", status_code=500)

@police_system_log_bp.route('/sessions', methods=['GET'])
@jwt_required()
def get_user_sessions():
    try:
        sessions = system_log_service.get_sessions()
        return ResponseFactory.success(data=sessions, message="User sessions retrieved successfully.")
    except Exception:
        return ResponseFactory.error(message="Unable to fetch user sessions.", status_code=500)

@police_system_log_bp.route('/export/pdf', methods=['GET'])
@jwt_required()
def export_system_logs_pdf():
    _check_police_admin_role()
    current_user_id = get_jwt_identity()
    try:
        keyword = request.args.get('keyword') or request.args.get('search')
        user_id = request.args.get('userId') or request.args.get('user_id')
        start_date = request.args.get('startDate') or request.args.get('start_date')
        end_date = request.args.get('endDate') or request.args.get('end_date')

        pdf_bytes = system_log_service.export_pdf(
            keyword=keyword,
            user_id=user_id,
            start_date=start_date,
            end_date=end_date,
            request_user_id=current_user_id
        )
        filename = f"SLTB_SafeTrack_System_Logs_{datetime.now().strftime('%Y-%m-%d')}.pdf"
        return Response(
            pdf_bytes,
            mimetype="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message="Unable to export system logs report.", status_code=500)

