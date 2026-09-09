class ApplicationError(Exception):
    def __init__(self, message="An unexpected application error occurred.", status_code=500):
        super().__init__(message)
        self.message = message
        self.status_code = status_code

class ValidationError(ApplicationError):
    def __init__(self, message="Validation failed.", errors=None):
        super().__init__(message, status_code=400)
        self.errors = errors or {}

class InvalidCredentialsError(ApplicationError):
    def __init__(self, message="Invalid username/email or password."):
        super().__init__(message, status_code=401)

class InactiveAccountError(ApplicationError):
    def __init__(self, message="This account is inactive. Contact the system administrator."):
        super().__init__(message, status_code=403)

class UnauthorizedRoleError(ApplicationError):
    def __init__(self, message="This account is not authorized to access the SLTB Admin dashboard."):
        super().__init__(message, status_code=403)

class ResetTokenInvalidError(ApplicationError):
    def __init__(self, message="Invalid or expired reset token."):
        super().__init__(message, status_code=400)

class NotFoundError(ApplicationError):
    def __init__(self, message="Requested resource not found."):
        super().__init__(message, status_code=404)
