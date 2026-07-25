from typing import Optional

class ProfileUpdateData:
    def __init__(
        self,
        full_name: str = "",
        email_address: str = "",
        employee_id: str = "",
        phone: str = "",
        department: str = "",
        designation: str = "",
        joined_date: Optional[str] = None
    ):
        self.full_name = full_name
        self.email_address = email_address
        self.employee_id = employee_id
        self.phone = phone
        self.department = department
        self.designation = designation
        self.joined_date = joined_date

    def to_dict(self):
        return {
            'full_name': self.full_name,
            'email_address': self.email_address,
            'employee_id': self.employee_id,
            'phone': self.phone,
            'department': self.department,
            'designation': self.designation,
            'joined_date': self.joined_date
        }
