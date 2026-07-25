from app.data.database import db

class SLTBUserModel(db.Model):
    __tablename__ = 'sltb_users'

    sltb_user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False, unique=True)
    full_name = db.Column(db.String(100), nullable=False)
    employee_id = db.Column(db.String(50), nullable=False, unique=True)
    department = db.Column(db.String(100), nullable=True)
    designation = db.Column(db.String(100), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    joined_date = db.Column(db.Date, nullable=True)

    def __init__(self, user_id=None, full_name=None, employee_id=None, department=None, designation=None, phone=None, joined_date=None, **kwargs):
        super().__init__(
            user_id=user_id,
            full_name=full_name,
            employee_id=employee_id,
            department=department,
            designation=designation,
            phone=phone,
            joined_date=joined_date,
            **kwargs
        )

    def to_dict(self):
        return {
            'sltb_user_id': self.sltb_user_id,
            'user_id': self.user_id,
            'full_name': self.full_name,
            'employee_id': self.employee_id,
            'department': self.department,
            'designation': self.designation,
            'phone': self.phone,
            'joined_date': str(self.joined_date) if self.joined_date else None
        }
