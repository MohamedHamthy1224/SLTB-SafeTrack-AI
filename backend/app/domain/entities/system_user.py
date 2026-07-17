from app.data.database import bcrypt

class SystemUser:
    def __init__(self, user_id=None, username="", email="", password_hash="", status="Active", role=""):
        self._user_id = user_id
        self.username = username
        self.email = email
        self._password_hash = password_hash
        self._status = status
        self._role = role

    @property
    def user_id(self):
        return self._user_id

    @property
    def username(self):
        return self._username

    @username.setter
    def username(self, value):
        if not value or not str(value).strip():
            raise ValueError("Username cannot be empty.")
        self._username = str(value).strip()

    @property
    def email(self):
        return self._email

    @email.setter
    def email(self, value):
        if not value or not str(value).strip() or "@" not in str(value):
            raise ValueError("Valid email is required.")
        self._email = str(value).strip().lower()

    @property
    def status(self):
        return self._status

    @status.setter
    def status(self, value):
        if value not in ["Active", "Inactive"]:
            raise ValueError("Status must be Active or Inactive.")
        self._status = value

    @property
    def role(self):
        return self._role

    @role.setter
    def role(self, value):
        self._role = value

    def set_password(self, password):
        if not password or len(password) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        self._password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        if not self._password_hash:
            return False
        return bcrypt.check_password_hash(self._password_hash, password)

    def is_password_hashed(self):
        return bool(self._password_hash and (self._password_hash.startswith("$2b$") or self._password_hash.startswith("$2a$")))

    def to_safe_dict(self):
        return {
            'user_id': self._user_id,
            'username': self._username,
            'email': self._email,
            'status': self._status,
            'role': self._role
        }

class SLTBAdmin(SystemUser):
    def __init__(self, user_id=None, username="", email="", password_hash="", status="Active", employee_id="", department=""):
        super().__init__(user_id, username, email, password_hash, status, role="SLTB Admin")
        self._employee_id = employee_id
        self._department = department

    @property
    def employee_id(self):
        return self._employee_id

    @property
    def department(self):
        return self._department

    def get_permissions(self):
        return [
            "sltb:dashboard:read",
            "sltb:buses:manage",
            "sltb:drivers:manage",
            "sltb:routes:manage",
            "sltb:reports:read"
        ]

    def to_safe_dict(self):
        base_dict = super().to_safe_dict()
        base_dict.update({
            'employee_id': self._employee_id,
            'department': self._department,
            'permissions': self.get_permissions()
        })
        return base_dict
