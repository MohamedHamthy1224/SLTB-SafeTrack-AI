from app.data.database import db
from datetime import datetime, timezone

class BusAssignmentHistoryModel(db.Model):
    __tablename__ = 'bus_assignment_history'
    __allow_unmapped__ = True

    assignment_history_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    bus_id = db.Column(db.Integer, db.ForeignKey('buses.bus_id'), nullable=False)
    driver_id = db.Column(db.Integer, db.ForeignKey('drivers.driver_id'), nullable=False)
    route_id = db.Column(db.Integer, db.ForeignKey('routes.route_id'), nullable=False)
    start_datetime = db.Column(db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    end_datetime = db.Column(db.DateTime, nullable=True)
    assigned_by = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=True)

    bus = db.relationship('BusModel', backref='assignment_histories', lazy=True)
    driver = db.relationship('DriverModel', backref='assignment_histories', lazy=True)
    route = db.relationship('RouteModel', backref='assignment_histories', lazy=True)

    def to_dict(self):
        return {
            'assignment_history_id': self.assignment_history_id,
            'bus_id': self.bus_id,
            'driver_id': self.driver_id,
            'route_id': self.route_id,
            'start_datetime': self.start_datetime.strftime('%Y-%m-%d %H:%M:%S') if self.start_datetime else None,
            'end_datetime': self.end_datetime.strftime('%Y-%m-%d %H:%M:%S') if self.end_datetime else 'Ongoing',
            'assigned_by': self.assigned_by
        }
