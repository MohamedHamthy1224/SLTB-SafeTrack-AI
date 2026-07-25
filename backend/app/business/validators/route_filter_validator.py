from app.business.validators.base_validator import BaseValidator
from typing import Dict, Any

class RouteFilterValidator(BaseValidator):
    """
    RouteFilterValidator verifying route list search and query string parameters.
    Inherits from BaseValidator and overrides validate().
    """

    def validate(self, data: Dict[str, Any], *args: Any, **kwargs: Any) -> Dict[str, str]:
        errors = {}

        search = data.get('search')
        if search and len(str(search)) > 100:
            errors['search'] = 'Search term cannot exceed 100 characters.'

        status = data.get('status')
        if status and str(status).strip() not in ('', 'all', 'All', 'All Status', 'Active', 'Inactive'):
            errors['status'] = 'Invalid status filter option.'

        page = data.get('page')
        if page is not None:
            try:
                page_val = int(page)
                if page_val < 1:
                    errors['page'] = 'Page number must be at least 1.'
            except (ValueError, TypeError):
                errors['page'] = 'Page number must be an integer.'

        per_page = data.get('per_page')
        if per_page is not None:
            try:
                per_page_val = int(per_page)
                if per_page_val not in (10, 25, 50, 100):
                    errors['per_page'] = 'Rows per page must be 10, 25, 50, or 100.'
            except (ValueError, TypeError):
                errors['per_page'] = 'Rows per page must be an integer.'

        return errors
