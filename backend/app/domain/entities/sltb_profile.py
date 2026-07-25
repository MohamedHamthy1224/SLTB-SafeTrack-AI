from datetime import date
from typing import Optional

class SLTBProfile:
    def __init__(
        self,
        sltb_user_id: Optional[int] = None,
        user_id: Optional[int] = None,
        full_name: str = "",
        employee_id: str = "",
        phone: str = "",
        department: str = "",
        designation: str = "",
        joined_date: Optional[date] = None
    ):
        self._sltb_user_id = sltb_user_id
        self._user_id = user_id
        self._full_name = full_name
        self._employee_id = employee_id
        self._phone = phone
        self._department = department
        self._designation = designation
        self._joined_date = joined_date

    @property
    def sltb_user_id(self):
        return self._sltb_user_id

    @property
    def user_id(self):
        return self._user_id

    @property
    def full_name(self):
        return self._full_name

    @full_name.setter
    def full_name(self, value):
        self._full_name = str(value).strip() if value else ""

    @property
    def employee_id(self):
        return self._employee_id

    @employee_id.setter
    def employee_id(self, value):
        self._employee_id = str(value).strip() if value else ""

    @property
    def phone(self):
        return self._phone

    @phone.setter
    def phone(self, value):
        self._phone = str(value).strip() if value else ""

    @property
    def department(self):
        return self._department

    @department.setter
    def department(self, value):
        self._department = str(value).strip() if value else ""

    @property
    def designation(self):
        return self._designation

    @designation.setter
    def designation(self, value):
        self._designation = str(value).strip() if value else ""

    @property
    def joined_date(self):
        return self._joined_date

    @joined_date.setter
    def joined_date(self, value):
        self._joined_date = value

    def to_dict(self):
        return {
            'sltb_user_id': self._sltb_user_id,
            'user_id': self._user_id,
            'full_name': self._full_name,
            'employee_id': self._employee_id,
            'phone': self._phone,
            'department': self._department,
            'designation': self._designation,
            'joined_date': str(self._joined_date) if self._joined_date else None
        }
