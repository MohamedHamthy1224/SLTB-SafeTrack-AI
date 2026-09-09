from datetime import datetime
from flask import Blueprint, request, Response
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from app.data.database import db
from app.data.models.roadside_unit_model import RoadsideUnitModel
from app.data.models.route_model import RouteModel
from app.data.models.device_registry_model import DeviceRegistryModel
from app.presentation.response_factory import ResponseFactory
from app.business.services.pdf_generator_service import PDFGeneratorService
from app.data.repositories.activity_log_repository import ActivityLogRepository
from app.business.exceptions.application_exceptions import UnauthorizedRoleError, ApplicationError
from sqlalchemy import func, or_, cast, String

police_uturn_bp = Blueprint('police_uturn', __name__, url_prefix='/api/v1/police/uturn-units')

def _check_police_admin_role():
    claims = get_jwt()
    role = claims.get('role')
    if role not in ['Police Admin', 'Traffic Police Officer']:
        raise UnauthorizedRoleError("This action is restricted to Police Admin accounts.")

@police_uturn_bp.route('', methods=['GET'])
@police_uturn_bp.route('/', methods=['GET'])
@jwt_required()
def get_uturn_units():
    _check_police_admin_role()
    try:
        search = request.args.get('search', '').strip()
        status = request.args.get('status')
        route_id = request.args.get('route_id') or request.args.get('routeId')

        query = db.session.query(
            RoadsideUnitModel,
            RouteModel.route_number,
            RouteModel.route_name
        ).outerjoin(
            RouteModel, RouteModel.route_id == RoadsideUnitModel.route_id
        )

        if search:
            search_conds = [
                RoadsideUnitModel.location_name.ilike(f'%{search}%'),
                cast(RoadsideUnitModel.roadside_unit_id, String).ilike(f'%{search}%')
            ]
            query = query.filter(or_(*search_conds))

        if status and status.lower() not in ('all', 'all status'):
            query = query.filter(RoadsideUnitModel.status == status)

        if route_id and route_id.lower() not in ('all', 'all routes'):
            try:
                clean_route = int(route_id.replace('ROU-', '').replace('Route', '').strip())
                query = query.filter(RoadsideUnitModel.route_id == clean_route)
            except (ValueError, TypeError):
                pass

        query = query.order_by(RoadsideUnitModel.roadside_unit_id.asc())
        rows = query.all()

        results = []
        for unit, r_num, r_name in rows:
            u_dict = unit.to_dict()
            u_dict['routeName'] = f"{r_num} - {r_name}" if r_num else '—'
            results.append(u_dict)

        return ResponseFactory.success(data=results, message="U-Turn units retrieved successfully.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_uturn_bp.route('/summary', methods=['GET'])
@jwt_required()
def get_uturn_summary():
    _check_police_admin_role()
    try:
        total = db.session.query(func.count(RoadsideUnitModel.roadside_unit_id)).scalar() or 0
        active = db.session.query(func.count(RoadsideUnitModel.roadside_unit_id)).filter(
            RoadsideUnitModel.status == 'Active'
        ).scalar() or 0
        inactive = db.session.query(func.count(RoadsideUnitModel.roadside_unit_id)).filter(
            RoadsideUnitModel.status == 'Inactive'
        ).scalar() or 0
        maintenance = db.session.query(func.count(RoadsideUnitModel.roadside_unit_id)).filter(
            RoadsideUnitModel.status == 'Maintenance'
        ).scalar() or 0

        return ResponseFactory.success(data={
            'total': total,
            'totalUnits': total,
            'active': active,
            'activeUnits': active,
            'inactive': inactive,
            'inactiveUnits': inactive,
            'maintenance': maintenance,
            'maintenanceUnits': maintenance
        }, message="U-Turn unit summary loaded.")
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@police_uturn_bp.route('/export/pdf', methods=['GET'])
@jwt_required()
def export_uturn_units_pdf():
    _check_police_admin_role()
    current_user_id = get_jwt_identity()
    try:
        search = request.args.get('search', '').strip()
        status = request.args.get('status')
        route_id = request.args.get('route_id') or request.args.get('routeId')

        query = db.session.query(
            RoadsideUnitModel,
            RouteModel.route_number,
            RouteModel.route_name
        ).outerjoin(
            RouteModel, RouteModel.route_id == RoadsideUnitModel.route_id
        )

        if search:
            search_conds = [
                RoadsideUnitModel.location_name.ilike(f'%{search}%'),
                cast(RoadsideUnitModel.roadside_unit_id, String).ilike(f'%{search}%')
            ]
            query = query.filter(or_(*search_conds))

        if status and status.lower() not in ('all', 'all status'):
            query = query.filter(RoadsideUnitModel.status == status)

        if route_id and route_id.lower() not in ('all', 'all routes'):
            try:
                clean_route = int(route_id.replace('ROU-', '').replace('Route', '').strip())
                query = query.filter(RoadsideUnitModel.route_id == clean_route)
            except (ValueError, TypeError):
                pass

        query = query.order_by(RoadsideUnitModel.roadside_unit_id.asc())
        rows = query.all()

        units = []
        for unit, r_num, r_name in rows:
            units.append({
                'unitId': unit.roadside_unit_id,
                'locationName': unit.location_name,
                'latitude': str(unit.latitude) if unit.latitude else '—',
                'longitude': str(unit.longitude) if unit.longitude else '—',
                'deviceId': unit.device_id,
                'route': f"Route {r_num}" if r_num else (f"Route #{unit.route_id}" if unit.route_id else '—'),
                'status': unit.status or 'Active',
                'installedDate': str(unit.installation_date) if unit.installation_date else '—'
            })

        cols = [
            {'header': 'Unit ID', 'key': 'unitId', 'width': 8, 'align': 'left'},
            {'header': 'Location Name', 'key': 'locationName', 'width': 22, 'align': 'left'},
            {'header': 'Latitude', 'key': 'latitude', 'width': 12, 'align': 'left'},
            {'header': 'Longitude', 'key': 'longitude', 'width': 12, 'align': 'left'},
            {'header': 'Device ID', 'key': 'deviceId', 'width': 10, 'align': 'left'},
            {'header': 'Route', 'key': 'route', 'width': 12, 'align': 'left'},
            {'header': 'Status', 'key': 'status', 'width': 10, 'align': 'left'},
            {'header': 'Installed Date', 'key': 'installedDate', 'width': 14, 'align': 'left'},
        ]

        # Activity log
        if current_user_id:
            try:
                ActivityLogRepository().log_activity(current_user_id, "Exported U-Turn Management PDF report.")
            except Exception:
                pass

        pdf_bytes = PDFGeneratorService.generate_report_pdf(
            title="SLTB SAFETRACK AI - POLICE ROADSIDE U-TURN UNITS REPORT",
            columns=cols,
            rows=units,
            summary_metrics={'Total Units': len(units)},
            filter_info={
                'Search': search or None,
                'Status': status if status and status.lower() not in ('all', 'all status') else None,
                'Route': route_id if route_id and route_id.lower() not in ('all', 'all routes') else None
            },
            user_info=f"User #{current_user_id}" if current_user_id else "Police Admin"
        )

        filename = f"SLTB_SafeTrack_UTurn_Units_{datetime.now().strftime('%Y-%m-%d')}.pdf"
        return Response(
            pdf_bytes,
            mimetype="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)
