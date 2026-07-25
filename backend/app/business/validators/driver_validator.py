from abc import ABC
from app.business.validators.base_validator import BaseValidator
from datetime import datetime, date
import re

class DriverValidator(BaseValidator):

    def validate(self, data, *args, **kwargs):
        errors = {}
        if not data or not isinstance(data, dict):
            return {"general": "Invalid data format."}

        full_name = data.get("full_name")
        if not full_name or not str(full_name).strip():
            errors["full_name"] = "Full name is required."
        elif len(str(full_name).strip()) > 100:
            errors["full_name"] = "Full name cannot exceed 100 characters."

        license_number = data.get("license_number")
        if not license_number or not str(license_number).strip():
            errors["license_number"] = "Licence number is required."
        elif len(str(license_number).strip()) > 50:
            errors["license_number"] = "Licence number cannot exceed 50 characters."

        dob_val = data.get("date_of_birth")
        dob_date = None
        if dob_val:
            try:
                dob_date = dob_val if isinstance(dob_val, date) else datetime.strptime(str(dob_val), "%Y-%m-%d").date()
                if dob_date > date.today():
                    errors["date_of_birth"] = "Date of birth cannot be in the future."
                else:
                    age = (date.today() - dob_date).days // 365
                    if age < 18:
                        errors["date_of_birth"] = "Driver must be at least 18 years old."
            except ValueError:
                errors["date_of_birth"] = "Invalid date format for date of birth (YYYY-MM-DD)."

        gender = data.get("gender")
        if gender and gender not in ("Male", "Female", ""):
            errors["gender"] = "Gender must be Male or Female."

        issue_val = data.get("issue_date")
        issue_date = None
        if issue_val:
            try:
                issue_date = issue_val if isinstance(issue_val, date) else datetime.strptime(str(issue_val), "%Y-%m-%d").date()
            except ValueError:
                errors["issue_date"] = "Invalid date format for issue date."

        expiry_val = data.get("expiry_date")
        if expiry_val:
            try:
                expiry_date = expiry_val if isinstance(expiry_val, date) else datetime.strptime(str(expiry_val), "%Y-%m-%d").date()
                if issue_date and expiry_date <= issue_date:
                    errors["expiry_date"] = "Expiry date must be after issue date."
            except ValueError:
                errors["expiry_date"] = "Invalid date format for expiry date."

        nic = data.get("nic")
        if nic and len(str(nic).strip()) > 20:
            errors["nic"] = "NIC number cannot exceed 20 characters."

        phone = data.get("phone")
        if phone and len(str(phone).strip()) > 20:
            errors["phone"] = "Phone number cannot exceed 20 characters."

        alt_phone = data.get("alternative_phone_number")
        if alt_phone:
            if len(str(alt_phone).strip()) > 20:
                errors["alternative_phone_number"] = "Alternative phone number cannot exceed 20 characters."
            elif phone and str(alt_phone).strip() == str(phone).strip():
                errors["alternative_phone_number"] = "Alternative phone number cannot equal primary phone number."

        email = data.get("email_address")
        if email:
            if len(str(email).strip()) > 100:
                errors["email_address"] = "Email address cannot exceed 100 characters."
            elif not re.match(r"^[^@]+@[^@]+\.[^@]+$", str(email).strip()):
                errors["email_address"] = "Invalid email address format."

        exp_years = data.get("experience_years")
        if exp_years is not None:
            try:
                exp_int = int(exp_years)
                if exp_int < 0:
                    errors["experience_years"] = "Experience years cannot be negative."
            except (ValueError, TypeError):
                errors["experience_years"] = "Experience years must be a valid integer."

        status = data.get("status")
        if status and status not in ("Active", "Inactive"):
            errors["status"] = "Status must be Active or Inactive."

        return errors


class DriverFilterValidator(BaseValidator):

    def validate(self, data, *args, **kwargs):
        errors = {}
        if not data or not isinstance(data, dict):
            return errors

        status = data.get("status")
        if status and status not in ("All Status", "Active", "Inactive"):
            errors["status"] = "Invalid status filter value."

        gender = data.get("gender")
        if gender and gender not in ("All Gender", "Male", "Female"):
            errors["gender"] = "Invalid gender filter value."

        page = data.get("page")
        if page is not None:
            try:
                if int(page) < 1:
                    errors["page"] = "Page number must be at least 1."
            except (ValueError, TypeError):
                errors["page"] = "Page number must be an integer."

        per_page = data.get("per_page")
        if per_page is not None:
            try:
                if int(per_page) < 1 or int(per_page) > 100:
                    errors["per_page"] = "Per page value must be between 1 and 100."
            except (ValueError, TypeError):
                errors["per_page"] = "Per page value must be an integer."

        return errors


class DriverAssignmentValidator(BaseValidator):

    def validate(self, data, *args, **kwargs):
        errors = {}
        if not data or not isinstance(data, dict):
            return errors

        bus_id = data.get("bus_id")
        route_id = data.get("route_id")

        if (bus_id is not None and route_id is None) or (bus_id is None and route_id is not None):
            errors["assignment"] = "Both bus and route must be selected together, or both left unassigned."

        return errors
