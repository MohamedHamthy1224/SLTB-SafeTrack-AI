from app.business.validators.base_validator import BaseValidator

class SearchValidator(BaseValidator):

    def validate(self, data):
        errors = {}
        if not data:
            return {'query': 'Search query parameters are required.'}

        query = str(data.get('q', '')).strip()

        if not query:
            errors['query'] = 'Search query string cannot be empty.'
        elif len(query) > 100:
            errors['query'] = 'Search query cannot exceed 100 characters.'

        return errors
