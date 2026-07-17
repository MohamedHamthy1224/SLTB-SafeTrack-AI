from app.presentation.response_factory import ResponseFactory
from app.business.exceptions.application_exceptions import ApplicationError, ValidationError
from sqlalchemy.exc import SQLAlchemyError
from jwt.exceptions import PyJWTError

def register_error_handlers(app):

    @app.errorhandler(ValidationError)
    def handle_validation_error(e):
        return ResponseFactory.error(message=e.message, errors=e.errors, status_code=e.status_code)

    @app.errorhandler(ApplicationError)
    def handle_application_error(e):
        return ResponseFactory.error(message=e.message, status_code=e.status_code)

    @app.errorhandler(SQLAlchemyError)
    def handle_database_error(e):
        app.logger.error(f"Database error: {str(e)}")
        return ResponseFactory.error(message="A database error occurred. Transaction rolled back.", status_code=500)

    @app.errorhandler(PyJWTError)
    def handle_jwt_error(e):
        return ResponseFactory.error(message="Invalid or expired authentication session.", status_code=401)

    @app.errorhandler(404)
    def handle_not_found(e):
        return ResponseFactory.error(message="Requested resource not found.", status_code=404)

    @app.errorhandler(500)
    def handle_internal_error(e):
        app.logger.error(f"Internal server error: {str(e)}")
        return ResponseFactory.error(message="An unexpected server error occurred.", status_code=500)
