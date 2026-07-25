from app.business.validators.base_validator import BaseValidator
import re

class PasswordChangeValidator(BaseValidator):

    def validate(self, data, *args, **kwargs):
        errors = {}
        if not data or not isinstance(data, dict):
            return {"general": "Invalid data format."}

        current_pw = data.get("current_password")
        if not current_pw:
            errors["current_password"] = "Current password is required."

        new_pw = data.get("new_password")
        if not new_pw:
            errors["new_password"] = "New password is required."
        else:
            if len(new_pw) < 8:
                errors["new_password"] = "New password must be at least 8 characters long."
            elif len(new_pw) > 128:
                errors["new_password"] = "New password cannot exceed 128 characters."
            else:
                if not re.search(r"[A-Z]", new_pw):
                    errors["new_password"] = "New password must contain at least one uppercase letter."
                elif not re.search(r"[a-z]", new_pw):
                    errors["new_password"] = "New password must contain at least one lowercase letter."
                elif not re.search(r"[0-9]", new_pw):
                    errors["new_password"] = "New password must contain at least one number."
                elif not re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>/?]", new_pw):
                    errors["new_password"] = "New password must contain at least one special character."
                elif current_pw and new_pw == current_pw:
                    errors["new_password"] = "New password must differ from current password."

        confirm_pw = data.get("confirm_password")
        if not confirm_pw:
            errors["confirm_password"] = "Please confirm your new password."
        elif new_pw and confirm_pw != new_pw:
            errors["confirm_password"] = "New password and confirm password do not match."

        return errors
