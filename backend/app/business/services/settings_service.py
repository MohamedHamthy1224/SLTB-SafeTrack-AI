from app.data.repositories.user_repository import UserRepository
from app.data.repositories.activity_log_repository import ActivityLogRepository
from app.business.validators.theme_preference_validator import ThemePreferenceValidator
from app.business.exceptions.application_exceptions import ApplicationError, ValidationError
from app.data.database import db
from sqlalchemy.exc import SQLAlchemyError
import logging

logger = logging.getLogger(__name__)

class SettingsService:

    AVAILABLE_THEMES = [
        {'value': 'light', 'label': 'Light'},
        {'value': 'dark', 'label': 'Dark'},
        {'value': 'system', 'label': 'System Default'}
    ]

    def __init__(self, user_repo=None, activity_log_repo=None, theme_validator=None):
        self.user_repo = user_repo or UserRepository()
        self.activity_log_repo = activity_log_repo or ActivityLogRepository()
        self.theme_validator = theme_validator or ThemePreferenceValidator()

    def get_user_theme(self, user_id):
        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise ApplicationError("User account not found.", status_code=404)

        current_pref = user.theme_preference or 'light'
        return {
            'themePreference': current_pref,
            'availableThemes': self.AVAILABLE_THEMES
        }

    def update_user_theme(self, user_id, new_theme):
        # 1. Validate payload
        errors = self.theme_validator.validate({'theme_preference': new_theme})
        if errors:
            raise ValidationError("Invalid theme preference payload.", errors=errors)

        normalized_theme = str(new_theme).strip().lower()

        try:
            # 2. Retrieve user
            user = self.user_repo.get_by_id(user_id)
            if not user:
                raise ApplicationError("User account not found.", status_code=404)

            previous_theme = user.theme_preference or 'light'

            # If theme did not change, return current preference without error or log
            if previous_theme == normalized_theme:
                return {
                    'themePreference': normalized_theme,
                    'availableThemes': self.AVAILABLE_THEMES
                }

            # 3. Update theme preference in database (uncommitted)
            self.user_repo.update_theme_preference(user_id, normalized_theme, commit=False)

            # 4. Create activity log entry (uncommitted)
            log_msg = f"Theme preference changed from {previous_theme} to {normalized_theme}."
            self.activity_log_repo.create({
                'user_id': user_id,
                'activity': log_msg
            }, commit=False)

            # 5. Commit single transaction
            db.session.commit()

            return {
                'themePreference': normalized_theme,
                'availableThemes': self.AVAILABLE_THEMES
            }

        except SQLAlchemyError as error:
            db.session.rollback()
            logger.exception("Theme preference transaction failed in database.")
            raise ApplicationError("Failed to update theme preference due to a database error.", status_code=500) from error
