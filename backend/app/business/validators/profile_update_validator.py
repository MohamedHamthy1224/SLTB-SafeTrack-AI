from app.business.validators.base_validator import BaseValidator
from datetime import datetime, date
import re

class ProfileUpdateValidator(BaseValidator):

    def validate(self, data, *args, **kwargs):
        errors = {}
        if not data or not isinstance(data, dict):
            return {"general": "Invalid data format."}

        full_name = data.get("full_name")
        if not full_name or not str(full_name).strip():
            errors["full_name"] = "Full name is required."
        elif len(str(full_name).strip()) > 100:
            errors["full_name"] = "Full name cannot exceed 100 characters."

        email = data.get("email_address") or data.get("email")
        if not email or not str(email).strip():
            errors["email_address"] = "Email address is required."
        elif len(str(email).strip()) > 100:
            errors["email_address"] = "Email address cannot exceed 100 characters."
        elif not re.match(r"^[^@]+@[^@]+\.[^@]+$", str(email).strip()):
            errors["email_address"] = "Invalid email address format."

        employee_id = data.get("employee_id")
        if employee_id and len(str(employee_id).strip()) > 50:
            errors["employee_id"] = "Employee ID cannot exceed 50 characters."

        phone = data.get("phone")
        if phone and len(str(phone).strip()) > 20:
            errors["phone"] = "Phone number cannot exceed 20 characters."

        department = data.get("department")
        if department and len(str(department).strip()) > 100:
            errors["department"] = "Department cannot exceed 100 characters."

        designation = data.get("designation")
        if designation and len(str(designation).strip()) > 100:
            errors["designation"] = "Designation cannot exceed 100 characters."

        joined_val = data.get("joined_date")
        if joined_val:
            try:
                j_date = joined_val if isinstance(joined_val, date) else datetime.strptime(str(joined_val), "%Y-%m-%d").date()
                if j_date > date.today():
                    errors["joined_date"] = "Joined date cannot be in the future."
            except ValueError:
                errors["joined_date"] = "Invalid date format for joined date (YYYY-MM-DD)."

        return errors
