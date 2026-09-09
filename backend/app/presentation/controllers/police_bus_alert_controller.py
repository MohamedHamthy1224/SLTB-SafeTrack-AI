import io
from datetime import datetime
from flask import Blueprint, request, Response, send_file
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from app.presentation.response_factory import ResponseFactory
from app.business.services.bus_alert_service import BusAlertService
from app.business.exceptions.application_exceptions import UnauthorizedRoleError, NotFoundError, ValidationError, ApplicationError

police_bus_alert_bp = Blueprint('police_bus_alert', __name__, url_prefix='/api/v1/police/bus-alerts')
bus_alert_service = BusAlertService()

def _check_police_admin_role():
    claims = get_jwt()
    role = claims.get('role')
    if role not in ['Police Admin', 'Traffic Police Officer']:
        raise UnauthorizedRoleError("This action is restricted to Police Admin accounts.")

@police_bus_alert_bp.route('', methods=['GET'])
@police_bus_alert_bp.route('/', methods=['GET'])
@jwt_required()
def get_police_bus_alerts():
    _check_police_admin_role()
    try:
        data = bus_alert_service.get_alerts(request.args)
        return ResponseFactory.success(data=data, message="Bus alerts retrieved successfully.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_bus_alert_bp.route('/<int:alert_id>', methods=['GET'])
@jwt_required()
def get_police_bus_alert_by_id(alert_id):
    _check_police_admin_role()
    try:
        data = bus_alert_service.get_alert_by_id(alert_id)
        return ResponseFactory.success(data=data, message="Bus alert details retrieved successfully.")
    except NotFoundError as nfe:
        return ResponseFactory.error(message=str(nfe), status_code=404)
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_bus_alert_bp.route('/summary', methods=['GET'])
@jwt_required()
def get_police_bus_alert_summary():
    _check_police_admin_role()
    try:
        summary = bus_alert_service.get_summary()
        return ResponseFactory.success(data=summary, message="Bus alert summary loaded.")
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_bus_alert_bp.route('/recent', methods=['GET'])
@jwt_required()
def get_police_bus_alert_recent():
    _check_police_admin_role()
    try:
        limit = request.args.get('limit', 5)
        try:
            limit = int(limit)
        except (ValueError, TypeError):
            limit = 5
        recent = bus_alert_service.get_recent(limit=limit)
        return ResponseFactory.success(data=recent, message="Recent bus alert notifications loaded.")
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_bus_alert_bp.route('/charts', methods=['GET'])
@jwt_required()
def get_police_bus_alert_charts():
    _check_police_admin_role()
    try:
        charts = bus_alert_service.get_charts_data()
        return ResponseFactory.success(data=charts, message="Bus alert chart statistics loaded.")
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_bus_alert_bp.route('/export/pdf', methods=['GET'])
@jwt_required()
def export_police_bus_alerts_pdf():
    _check_police_admin_role()
    current_user_id = get_jwt_identity()
    try:
        pdf_bytes = bus_alert_service.export_pdf(params=request.args, request_user_id=current_user_id)
        filename = f"SLTB_SafeTrack_Bus_Alerts_{datetime.now().strftime('%Y-%m-%d')}.pdf"
        return send_file(
            io.BytesIO(pdf_bytes),
            mimetype="application/pdf",
            as_attachment=True,
            download_name=filename
        )
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_bus_alert_bp.route('', methods=['POST'])
@police_bus_alert_bp.route('/', methods=['POST'])
@jwt_required()
def create_police_bus_alert():
    _check_police_admin_role()
    try:
        data = request.get_json() or {}
        created = bus_alert_service.create_bus_alert(data)
        return ResponseFactory.success(data=created, message="Bus alert created successfully.", status_code=201)
    except ValidationError as ve:
        return ResponseFactory.error(message=ve.message, errors=ve.errors, status_code=400)
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)
