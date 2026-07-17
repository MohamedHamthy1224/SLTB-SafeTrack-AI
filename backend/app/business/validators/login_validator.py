from app.business.validators.base_validator import BaseValidator

class LoginValidator(BaseValidator):

    def validate(self, data):
        errors = {}
        if not data:
            return {'general': 'Request body is required.'}

        identifier = data.get('identifier', '').strip()
        password = data.get('password', '')

        if not identifier:
            errors['identifier'] = 'Username or email address is required.'
        elif len(identifier) > 100:
            errors['identifier'] = 'Username or email cannot exceed 100 characters.'

        if not password:
            errors['password'] = 'Password is required.'
        elif len(password) > 128:
            errors['password'] = 'Password cannot exceed 128 characters.'

        return errors
