from flask import Blueprint, request, Response
from flask_jwt_extended import jwt_required, get_jwt
from app.presentation.response_factory import ResponseFactory
from app.business.services.user_management_service import UserManagementService
from app.business.exceptions.application_exceptions import UnauthorizedRoleError, ValidationError, ApplicationError

user_bp = Blueprint('user', __name__, url_prefix='/api/v1/users')
user_service = UserManagementService()

def _check_police_admin_role():
    claims = get_jwt()
    if claims.get('role') != 'Police Admin':
        raise UnauthorizedRoleError("This action is restricted to Police Admin accounts.")

@user_bp.route('', methods=['GET'])
@user_bp.route('/', methods=['GET'])
@user_bp.route('/search', methods=['GET'])
@user_bp.route('/filter', methods=['GET'])
@jwt_required(optional=True)
def get_users():
    try:
        params = {
            'search': request.args.get('search', ''),
            'role': request.args.get('role'),
            'status': request.args.get('status'),
            'page': request.args.get('page', 1),
            'per_page': request.args.get('per_page', 50),
            'sort_by': request.args.get('sort_by', 'user_id'),
            'order': request.args.get('order', 'asc')
        }
        data = user_service.get_users(params)
        return ResponseFactory.success(data=data, message="Users loaded successfully.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@user_bp.route('/summary', methods=['GET'])
@jwt_required(optional=True)
def get_user_summary():
    try:
        stats = user_service.get_summary_stats()
        return ResponseFactory.success(data=stats, message="User summary statistics loaded successfully.")
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@user_bp.route('/export', methods=['GET'])
@jwt_required(optional=True)
def export_users():
    try:
        params = {
            'search': request.args.get('search', ''),
            'role': request.args.get('role'),
            'status': request.args.get('status')
        }
        csv_data = user_service.export_users_csv(params)
        return Response(
            csv_data,
            mimetype='text/csv',
            headers={'Content-Disposition': 'attachment; filename=users_export.csv'}
        )
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@user_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required(optional=True)
def get_user_by_id(user_id):
    try:
        user = user_service.get_user_by_id(user_id)
        return ResponseFactory.success(data=user, message="User details loaded successfully.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@user_bp.route('', methods=['POST'])
@jwt_required()
def create_user():
    _check_police_admin_role()
    data = request.get_json() or {}
    try:
        created_user = user_service.create_user(data)
        return ResponseFactory.success(data=created_user, message="User created successfully.", status_code=201)
    except ValidationError as ve:
        return ResponseFactory.error(message=ve.message, errors=ve.errors, status_code=400)
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@user_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    _check_police_admin_role()
    data = request.get_json() or {}
    try:
        updated_user = user_service.update_user(user_id, data)
        return ResponseFactory.success(data=updated_user, message="User updated successfully.")
    except ValidationError as ve:
        return ResponseFactory.error(message=ve.message, errors=ve.errors, status_code=400)
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)

@user_bp.route('/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    _check_police_admin_role()
    try:
        user_service.delete_user(user_id)
        return ResponseFactory.success(message="User deleted successfully.")
    except ApplicationError as ae:
        return ResponseFactory.error(message=ae.message, errors=getattr(ae, 'errors', None), status_code=ae.status_code)
    except Exception as e:
        return ResponseFactory.error(message=str(e), status_code=500)
