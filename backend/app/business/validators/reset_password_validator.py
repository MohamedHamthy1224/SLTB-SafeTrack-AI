import re
from app.business.validators.base_validator import BaseValidator

class ResetPasswordValidator(BaseValidator):

    def validate(self, data):
        errors = {}
        if not data:
            return {'general': 'Request body is required.'}

        token = data.get('token', '').strip()
        new_password = data.get('new_password', '')
        confirm_password = data.get('confirm_password', '')

        if not token:
            errors['token'] = 'Reset token is required.'

        if not new_password:
            errors['new_password'] = 'New password is required.'
        elif len(new_password) < 8:
            errors['new_password'] = 'Password must be at least 8 characters long.'
        elif len(new_password) > 128:
            errors['new_password'] = 'Password cannot exceed 128 characters.'
        elif not re.search(r'\d', new_password):
            errors['new_password'] = 'Password must contain at least one number.'
        elif not re.search(r'[!@#$%^&*(),.?":{}|<>]', new_password):
            errors['new_password'] = 'Password must contain at least one special character.'

        if not confirm_password:
            errors['confirm_password'] = 'Password confirmation is required.'
        elif new_password != confirm_password:
            errors['confirm_password'] = 'Passwords do not match.'

        return errors
