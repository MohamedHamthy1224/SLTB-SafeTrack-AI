from flask import Blueprint, request
from app.presentation.response_factory import ResponseFactory
from app.business.services.global_search_service import GlobalSearchService
from app.business.validators.search_validator import SearchValidator
from app.business.exceptions.application_exceptions import ValidationError, UnauthorizedRoleError
from flask_jwt_extended import jwt_required, get_jwt

search_bp = Blueprint('search', __name__, url_prefix='/api/v1/sltb')
search_service = GlobalSearchService()
search_validator = SearchValidator()

@search_bp.route('/search', methods=['GET'])
@jwt_required()
def search():
    claims = get_jwt()
    if claims.get('role') != 'SLTB Admin':
        raise UnauthorizedRoleError()

    query_param = request.args.get('q', '').strip()
    errors = search_validator.validate({'q': query_param})
    if errors:
        raise ValidationError("Validation failed.", errors=errors)

    # Check if query is pure integer to trigger singledispatchmethod exact Binary Search
    if query_param.isdigit():
        results = search_service.search(int(query_param))
    else:
        results = search_service.search(query_param)

    return ResponseFactory.success(data=results, message="Search results retrieved successfully.")
