from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt
from app.presentation.response_factory import ResponseFactory
from app.data.repositories.driver_repository import DriverRepository
from app.data.repositories.assignment_repository import AssignmentRepository
from app.business.exceptions.application_exceptions import UnauthorizedRoleError

driver_option_bp = Blueprint('driver_option', __name__, url_prefix='/api/v1/sltb')
driver_repo = DriverRepository()
assignment_repo = AssignmentRepository()

def _check_sltb_admin_role():
    claims = get_jwt()
    if claims.get('role') != 'SLTB Admin':
        raise UnauthorizedRoleError("This account is not authorized to access SLTB Admin resources.")

@driver_option_bp.route('/drivers/options', methods=['GET'])
@jwt_required()
def get_driver_options():
    _check_sltb_admin_role()
    try:
        exclude_bus_id = request.args.get('exclude_bus_id')
        if exclude_bus_id:
            try:
                exclude_bus_id = int(exclude_bus_id)
            except (ValueError, TypeError):
                exclude_bus_id = None

        drivers = driver_repo.get_active_drivers()
        options = []
        seen_ids = set()

        for d in drivers:
            if not d or d.driver_id in seen_ids or d.status != 'Active':
                continue
            seen_ids.add(d.driver_id)

            is_assigned = assignment_repo.is_driver_assigned_active(d.driver_id, exclude_bus_id=exclude_bus_id)
            options.append({
                'driver_id': d.driver_id,
                'full_name': d.full_name,
                'license_number': d.license_number,
                'status': d.status,
                'is_available': not is_assigned,
                # Aliases for camelCase compatibility
                'driverId': d.driver_id,
                'fullName': d.full_name,
                'licenseNumber': d.license_number,
                'isAvailable': not is_assigned
            })
        return ResponseFactory.success(data=options, message="Driver options fetched successfully.")
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)
