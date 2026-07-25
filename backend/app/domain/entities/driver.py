from datetime import datetime, date, timezone
from typing import Optional

class Driver:
    def __init__(
        self,
        driver_id: Optional[int] = None,
        full_name: str = "",
        date_of_birth: Optional[date] = None,
        gender: Optional[str] = None,
        address: str = "",
        profile_picture: Optional[str] = None,
        license_number: str = "",
        issue_date: Optional[date] = None,
        expiry_date: Optional[date] = None,
        nic: str = "",
        phone: str = "",
        alternative_phone_number: str = "",
        email_address: str = "",
        experience_years: int = 0,
        join_date: Optional[date] = None,
        status: str = "Active",
        created_at: Optional[datetime] = None
    ):
        self._driver_id = driver_id
        self._full_name = ""
        self.full_name = full_name
        self._date_of_birth = date_of_birth
        self._gender = None
        self.gender = gender
        self._address = address
        self._profile_picture = profile_picture
        self._license_number = ""
        self.license_number = license_number
        self._issue_date: Optional[date] = None
        self.issue_date = issue_date
        self._expiry_date: Optional[date] = None
        self.expiry_date = expiry_date
        self._nic = nic
        self._phone = phone
        self._alternative_phone_number = alternative_phone_number
        self._email_address = email_address
        self._experience_years = 0
        self.experience_years = experience_years
        self._join_date = join_date
        self._status = "Active"
        self.status = status
        self._created_at = created_at or datetime.now(timezone.utc)


    @property
    def driver_id(self):
        return self._driver_id

    @property
    def full_name(self):
        return self._full_name

    @full_name.setter
    def full_name(self, value):
        if value is not None and not str(value).strip():
            raise ValueError("Driver full name cannot be blank.")
        self._full_name = str(value).strip() if value else ""

    @property
    def date_of_birth(self):
        return self._date_of_birth

    @date_of_birth.setter
    def date_of_birth(self, value):
        if value is not None:
            val_date = value if isinstance(value, date) else datetime.strptime(str(value), "%Y-%m-%d").date()
            if val_date > date.today():
                raise ValueError("Date of birth cannot be in the future.")
            self._date_of_birth = val_date
        else:
            self._date_of_birth = None

    @property
    def gender(self):
        return self._gender

    @gender.setter
    def gender(self, value):
        if value is not None and value not in ("Male", "Female", ""):
            raise ValueError("Gender must be 'Male' or 'Female'.")
        self._gender = value

    @property
    def address(self):
        return self._address

    @address.setter
    def address(self, value):
        self._address = str(value).strip() if value else ""

    @property
    def profile_picture(self):
        return self._profile_picture

    @profile_picture.setter
    def profile_picture(self, value):
        self._profile_picture = value

    @property
    def license_number(self):
        return self._license_number

    @license_number.setter
    def license_number(self, value):
        if value is not None and not str(value).strip():
            raise ValueError("Licence number cannot be blank.")
        self._license_number = str(value).strip() if value else ""

    @property
    def issue_date(self):
        return self._issue_date

    @issue_date.setter
    def issue_date(self, value):
        if value is not None:
            self._issue_date = value if isinstance(value, date) else datetime.strptime(str(value), "%Y-%m-%d").date()
        else:
            self._issue_date = None

    @property
    def expiry_date(self):
        return self._expiry_date

    @expiry_date.setter
    def expiry_date(self, value):
        if value is not None:
            val_date = value if isinstance(value, date) else datetime.strptime(str(value), "%Y-%m-%d").date()
            if self._issue_date and val_date <= self._issue_date:
                raise ValueError("Expiry date must be after issue date.")
            self._expiry_date = val_date
        else:
            self._expiry_date = None

    @property
    def nic(self):
        return self._nic

    @nic.setter
    def nic(self, value):
        self._nic = str(value).strip() if value else ""

    @property
    def phone(self):
        return self._phone

    @phone.setter
    def phone(self, value):
        self._phone = str(value).strip() if value else ""

    @property
    def alternative_phone_number(self):
        return self._alternative_phone_number

    @alternative_phone_number.setter
    def alternative_phone_number(self, value):
        self._alternative_phone_number = str(value).strip() if value else ""

    @property
    def email_address(self):
        return self._email_address

    @email_address.setter
    def email_address(self, value):
        self._email_address = str(value).strip() if value else ""

    @property
    def experience_years(self):
        return self._experience_years

    @experience_years.setter
    def experience_years(self, value):
        if value is not None and int(value) < 0:
            raise ValueError("Driver experience years cannot be negative.")
        self._experience_years = int(value) if value is not None else 0

    @property
    def join_date(self):
        return self._join_date

    @join_date.setter
    def join_date(self, value):
        if value is not None:
            self._join_date = value if isinstance(value, date) else datetime.strptime(str(value), "%Y-%m-%d").date()
        else:
            self._join_date = None

    @property
    def status(self):
        return self._status

    @status.setter
    def status(self, value):
        if value not in ("Active", "Inactive"):
            raise ValueError("Driver status must be 'Active' or 'Inactive'.")
        self._status = value

    @property
    def created_at(self):
        return self._created_at

    @property
    def is_license_expired(self):
        if not self._expiry_date:
            return False
        return self._expiry_date < date.today()

    def to_dict(self):
        return {
            'driver_id': self._driver_id,
            'full_name': self._full_name,
            'date_of_birth': str(self._date_of_birth) if self._date_of_birth else None,
            'gender': self._gender,
            'address': self._address,
            'profile_picture': self._profile_picture,
            'license_number': self._license_number,
            'issue_date': str(self._issue_date) if self._issue_date else None,
            'expiry_date': str(self._expiry_date) if self._expiry_date else None,
            'nic': self._nic,
            'phone': self._phone,
            'alternative_phone_number': self._alternative_phone_number,
            'email_address': self._email_address,
            'experience_years': self._experience_years,
            'join_date': str(self._join_date) if self._join_date else None,
            'status': self._status,
            'is_license_expired': self.is_license_expired,
            'created_at': self._created_at.strftime('%Y-%m-%d %H:%M:%S') if isinstance(self._created_at, datetime) else str(self._created_at)
        }

