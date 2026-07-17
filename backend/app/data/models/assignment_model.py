from app.data.database import db
from datetime import datetime

class BusAssignmentModel(db.Model):
    __tablename__ = 'bus_assignments'

    assignment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    bus_id = db.Column(db.Integer, db.ForeignKey('buses.bus_id'), nullable=False)
    driver_id = db.Column(db.Integer, db.ForeignKey('drivers.driver_id'), nullable=False)
    route_id = db.Column(db.Integer, db.ForeignKey('routes.route_id'), nullable=False)
    assigned_date = db.Column(db.Date, nullable=False)
    status = db.Column(db.Enum('Active', 'Completed', 'Cancelled'), default='Active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            'assignment_id': self.assignment_id,
            'bus_id': self.bus_id,
            'driver_id': self.driver_id,
            'route_id': self.route_id,
            'assigned_date': str(self.assigned_date) if self.assigned_date else None,
            'status': self.status,
            'bus': self.bus.to_dict() if self.bus else None,
            'driver': self.driver.to_dict() if self.driver else None,
            'route': self.route.to_dict() if self.route else None
        }
