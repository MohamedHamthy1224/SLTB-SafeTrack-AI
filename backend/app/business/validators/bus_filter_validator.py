from app.business.validators.base_validator import BaseValidator
from app.domain.entities.bus import Bus

class BusFilterValidator(BaseValidator):

    def validate(self, data):
        errors = {}

        status = data.get('status')
        if status and status != 'All Status' and status not in Bus.ALLOWED_STATUSES:
            errors['status'] = f"Invalid status filter value: {status}"

        page = data.get('page')
        if page is not None:
            try:
                p = int(page)
                if p <= 0:
                    errors['page'] = "Page number must be greater than zero."
            except (ValueError, TypeError):
                errors['page'] = "Page number must be an integer."

        per_page = data.get('per_page')
        if per_page is not None:
            try:
                pp = int(per_page)
                if pp not in [10, 25, 50, 100]:
                    errors['per_page'] = "Per page must be one of: 10, 25, 50, 100."
            except (ValueError, TypeError):
                errors['per_page'] = "Per page must be an integer."

        return errors
