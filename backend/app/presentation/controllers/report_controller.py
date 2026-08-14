from datetime import datetime, timezone
from flask import Blueprint, request, Response
from flask_jwt_extended import jwt_required, get_jwt
from app.presentation.response_factory import ResponseFactory
from app.business.services.report_service import ReportService
from app.business.validators.report_filter_validator import ReportFilterValidator
from app.business.exceptions.application_exceptions import UnauthorizedRoleError

report_bp = Blueprint('report', __name__, url_prefix='/api/v1/sltb/reports')
report_service = ReportService()

def _check_sltb_admin_role():
    claims = get_jwt()
    if claims.get('role') != 'SLTB Admin':
        raise UnauthorizedRoleError("This account is not authorized to access SLTB Admin resources.")

# ----------------------------
# 1. BUSES REPORT
# ----------------------------
@report_bp.route('/buses', methods=['GET'])
@jwt_required()
def get_buses_report():
    _check_sltb_admin_role()
    try:
        validated_params = ReportFilterValidator.validate_buses_filters(request.args)
        result = report_service.get_buses_report(validated_params)
        return ResponseFactory.success(data=result, message="Buses report loaded successfully.")
    except UnauthorizedRoleError as e:
        return ResponseFactory.error(message=str(e), status_code=403)
    except Exception as e:
        return ResponseFactory.error(message="Unable to load the requested report at the moment.", status_code=500)

@report_bp.route('/buses/options', methods=['GET'])
@jwt_required()
def get_buses_options():
    _check_sltb_admin_role()
    try:
        options = report_service.get_buses_options()
        return ResponseFactory.success(data=options, message="Buses filter options loaded successfully.")
    except Exception as e:
        return ResponseFactory.error(message="Unable to load report filter options.", status_code=500)

@report_bp.route('/buses/export', methods=['GET'])
@jwt_required()
def export_buses_csv():
    _check_sltb_admin_role()
    try:
        validated_params = ReportFilterValidator.validate_buses_filters(request.args)
        csv_data = report_service.export_buses_csv(validated_params)
        filename = f"sltb_buses_report_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}.csv"
        return Response(
            csv_data,
            mimetype="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        return ResponseFactory.error(message="Unable to export buses report.", status_code=500)

# ----------------------------
# 2. ROUTES REPORT
# ----------------------------
@report_bp.route('/routes', methods=['GET'])
@jwt_required()
def get_routes_report():
    _check_sltb_admin_role()
    try:
        validated_params = ReportFilterValidator.validate_routes_filters(request.args)
        result = report_service.get_routes_report(validated_params)
        return ResponseFactory.success(data=result, message="Routes report loaded successfully.")
    except UnauthorizedRoleError as e:
        return ResponseFactory.error(message=str(e), status_code=403)
    except Exception as e:
        return ResponseFactory.error(message="Unable to load the requested report at the moment.", status_code=500)

@report_bp.route('/routes/options', methods=['GET'])
@jwt_required()
def get_routes_options():
    _check_sltb_admin_role()
    try:
        options = report_service.get_routes_options()
        return ResponseFactory.success(data=options, message="Routes filter options loaded successfully.")
    except Exception as e:
        return ResponseFactory.error(message="Unable to load report filter options.", status_code=500)

@report_bp.route('/routes/export', methods=['GET'])
@jwt_required()
def export_routes_csv():
    _check_sltb_admin_role()
    try:
        validated_params = ReportFilterValidator.validate_routes_filters(request.args)
        csv_data = report_service.export_routes_csv(validated_params)
        filename = f"sltb_routes_report_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}.csv"
        return Response(
            csv_data,
            mimetype="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        return ResponseFactory.error(message="Unable to export routes report.", status_code=500)

# ----------------------------
# 3. DRIVERS REPORT
# ----------------------------
@report_bp.route('/drivers', methods=['GET'])
@jwt_required()
def get_drivers_report():
    _check_sltb_admin_role()
    try:
        validated_params = ReportFilterValidator.validate_drivers_filters(request.args)
        result = report_service.get_drivers_report(validated_params)
        return ResponseFactory.success(data=result, message="Drivers report loaded successfully.")
    except UnauthorizedRoleError as e:
        return ResponseFactory.error(message=str(e), status_code=403)
    except Exception as e:
        return ResponseFactory.error(message="Unable to load the requested report at the moment.", status_code=500)

@report_bp.route('/drivers/options', methods=['GET'])
@jwt_required()
def get_drivers_options():
    _check_sltb_admin_role()
    try:
        options = report_service.get_drivers_options()
        return ResponseFactory.success(data=options, message="Drivers filter options loaded successfully.")
    except Exception as e:
        return ResponseFactory.error(message="Unable to load report filter options.", status_code=500)

@report_bp.route('/drivers/export', methods=['GET'])
@jwt_required()
def export_drivers_csv():
    _check_sltb_admin_role()
    try:
        validated_params = ReportFilterValidator.validate_drivers_filters(request.args)
        csv_data = report_service.export_drivers_csv(validated_params)
        filename = f"sltb_drivers_report_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}.csv"
        return Response(
            csv_data,
            mimetype="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        return ResponseFactory.error(message="Unable to export drivers report.", status_code=500)

# ----------------------------
# 4. ASSIGNMENT HISTORY REPORT
# ----------------------------
@report_bp.route('/assignment-history', methods=['GET'])
@jwt_required()
def get_assignment_history_report():
    _check_sltb_admin_role()
    try:
        validated_params = ReportFilterValidator.validate_assignment_filters(request.args)
        result = report_service.get_assignment_history_report(validated_params)
        return ResponseFactory.success(data=result, message="Assignment history report loaded successfully.")
    except UnauthorizedRoleError as e:
        return ResponseFactory.error(message=str(e), status_code=403)
    except Exception as e:
        return ResponseFactory.error(message="Unable to load the requested report at the moment.", status_code=500)

@report_bp.route('/assignment-history/export', methods=['GET'])
@jwt_required()
def export_assignment_history_csv():
    _check_sltb_admin_role()
    try:
        validated_params = ReportFilterValidator.validate_assignment_filters(request.args)
        csv_data = report_service.export_assignment_history_csv(validated_params)
        filename = f"sltb_assignment_history_report_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}.csv"
        return Response(
            csv_data,
            mimetype="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        return ResponseFactory.error(message="Unable to export assignment history report.", status_code=500)

# ----------------------------
# 5. SENSORS AND ALERTS REPORT
# ----------------------------
@report_bp.route('/sensors-alerts', methods=['GET'])
@jwt_required()
def get_sensors_alerts_report():
    _check_sltb_admin_role()
    try:
        validated_params = ReportFilterValidator.validate_alert_filters(request.args)
        result = report_service.get_sensors_alerts_report(validated_params)
        return ResponseFactory.success(data=result, message="Sensors and alerts report loaded successfully.")
    except UnauthorizedRoleError as e:
        return ResponseFactory.error(message=str(e), status_code=403)
    except Exception as e:
        return ResponseFactory.error(message="Unable to load the requested report at the moment.", status_code=500)

@report_bp.route('/sensors-alerts/options', methods=['GET'])
@jwt_required()
def get_sensors_alerts_options():
    _check_sltb_admin_role()
    try:
        options = report_service.get_sensors_alerts_options()
        return ResponseFactory.success(data=options, message="Sensors & alerts filter options loaded successfully.")
    except Exception as e:
        return ResponseFactory.error(message="Unable to load report filter options.", status_code=500)

@report_bp.route('/sensors-alerts/export', methods=['GET'])
@jwt_required()
def export_sensors_alerts_csv():
    _check_sltb_admin_role()
    try:
        validated_params = ReportFilterValidator.validate_alert_filters(request.args)
        csv_data = report_service.export_sensors_alerts_csv(validated_params)
        filename = f"sltb_sensors_alerts_report_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}.csv"
        return Response(
            csv_data,
            mimetype="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        return ResponseFactory.error(message="Unable to export sensors & alerts report.", status_code=500)
