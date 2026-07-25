from typing import Any, Dict
from app.business.validators.base_validator import BaseValidator

class ThemePreferenceValidator(BaseValidator):
    ALLOWED_THEMES = ('light', 'dark', 'system')

    def validate(self, data: Any, *args: Any, **kwargs: Any) -> Dict[str, str]:
        errors = {}
        if not isinstance(data, dict):
            errors['theme_preference'] = "Invalid payload format."
            return errors

        theme = data.get('theme_preference') or data.get('themePreference')
        if not theme:
            errors['theme_preference'] = "Theme preference is required."
            return errors

        val = str(theme).strip().lower()
        if val not in self.ALLOWED_THEMES:
            errors['theme_preference'] = f"Select a valid theme ({', '.join(self.ALLOWED_THEMES)})."

        return errors
