from app.business.validators.base_validator import BaseValidator

class ForgotPasswordValidator(BaseValidator):

    def validate(self, data):
        errors = {}
        if not data:
            return {'general': 'Request body is required.'}

        email = data.get('email', '').strip()

        if not email:
            errors['email'] = 'Email address is required.'
        elif '@' not in email or '.' not in email:
            errors['email'] = 'Please enter a valid email address.'
        elif len(email) > 100:
            errors['email'] = 'Email address cannot exceed 100 characters.'

        return errors
