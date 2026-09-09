from datetime import datetime
from flask import Blueprint, request, Response
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from app.presentation.response_factory import ResponseFactory
from app.business.services.roadside_alert_service import RoadsideAlertService, RoadsideAlertServiceError
from app.business.exceptions.application_exceptions import UnauthorizedRoleError, ValidationError, ApplicationError

police_roadside_alert_bp = Blueprint('police_roadside_alert', __name__, url_prefix='/api/v1/police/u-turn-alerts')
roadside_alert_service = RoadsideAlertService()

def _check_police_admin_role():
    claims = get_jwt()
    role = claims.get('role')
    if role not in ['Police Admin', 'Traffic Police Officer']:
        raise UnauthorizedRoleError("This action is restricted to Police Admin accounts.")

@police_roadside_alert_bp.route('', methods=['GET'])
@police_roadside_alert_bp.route('/', methods=['GET'])
@jwt_required()
def get_alerts():
    _check_police_admin_role()
    try:
        priority = request.args.get('priority')
        alerts = roadside_alert_service.get_all_alerts(priority=priority)
        return ResponseFactory.success(data=alerts, message="U-Turn alerts retrieved successfully.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_roadside_alert_bp.route('/summary', methods=['GET'])
@jwt_required()
def get_summary():
    _check_police_admin_role()
    try:
        summary = roadside_alert_service.get_summary()
        return ResponseFactory.success(data=summary, message="Alert summary loaded successfully.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_roadside_alert_bp.route('/priorities', methods=['GET'])
@jwt_required()
def get_priorities():
    _check_police_admin_role()
    try:
        priorities = roadside_alert_service.get_priorities()
        return ResponseFactory.success(data=priorities, message="Priorities loaded successfully.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_roadside_alert_bp.route('/charts', methods=['GET'])
@jwt_required()
def get_charts():
    _check_police_admin_role()
    try:
        charts = roadside_alert_service.get_charts()
        return ResponseFactory.success(data=charts, message="Chart analytics loaded successfully.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_roadside_alert_bp.route('/recent', methods=['GET'])
@jwt_required()
def get_recent_notifications():
    _check_police_admin_role()
    try:
        limit = request.args.get('limit', default=5, type=int)
        recent = roadside_alert_service.get_recent_notifications(limit=limit)
        return ResponseFactory.success(data=recent, message="Recent alerts loaded successfully.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_roadside_alert_bp.route('/export/pdf', methods=['GET'])
@jwt_required()
def export_pdf():
    _check_police_admin_role()
    current_user_id = get_jwt_identity()
    try:
        priority = request.args.get('priority')
        pdf_bytes = roadside_alert_service.export_pdf(priority=priority, user_id=current_user_id)
        filename = f"SLTB_SafeTrack_U_Turn_Alerts_{datetime.now().strftime('%Y-%m-%d')}.pdf"
        return Response(
            pdf_bytes,
            mimetype='application/pdf',
            headers={
                'Content-Disposition': f'attachment; filename="{filename}"',
                'Content-Type': 'application/pdf'
            }
        )
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_roadside_alert_bp.route('/<int:alert_id>', methods=['GET'])
@jwt_required()
def get_alert_by_id(alert_id):
    _check_police_admin_role()
    try:
        alert = roadside_alert_service.get_alert_details(alert_id)
        return ResponseFactory.success(data=alert, message="U-Turn alert details retrieved successfully.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_roadside_alert_bp.route('', methods=['POST'])
@police_roadside_alert_bp.route('/', methods=['POST'])
@jwt_required()
def create_alert():
    _check_police_admin_role()
    data = request.get_json() or {}
    try:
        alert_payload = {
            'roadsideUnitId': data.get('roadsideUnitId') or data.get('roadside_unit_id'),
            'deviceId': data.get('deviceId') or data.get('device_id'),
            'routeId': data.get('routeId') or data.get('route_id'),
            'sensorDataId': data.get('sensorDataId') or data.get('sensor_data_id'),
            'alertTime': data.get('alertTime') or data.get('alert_time')
        }
        notif_payload = None
        if 'title' in data or 'message' in data or 'priority' in data:
            notif_payload = {
                'title': data.get('title', 'U-Turn Detected'),
                'message': data.get('message', 'A vehicle made an unauthorized U-Turn.'),
                'priority': data.get('priority', 'Medium')
            }
        created = roadside_alert_service.create_alert(alert_payload, notif_payload)
        return ResponseFactory.success(data=created, message="Roadside alert created successfully.", status_code=201)
    except ValidationError as ve:
        return ResponseFactory.error(message=ve.message, errors=ve.errors, status_code=400)
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)
