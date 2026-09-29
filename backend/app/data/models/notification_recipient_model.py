from app.data.database import db
from datetime import datetime, timezone


class NotificationRecipientModel(db.Model):
    """
    ORM mapping for the existing `notification_recipients` table.
    Table already exists in MySQL with UNIQUE KEY uq_notification_officer (notification_id, officer_id).
    __table_args__ extend_existing=True prevents duplicate-table SQLAlchemy errors.
    """
    __tablename__ = 'notification_recipients'
    __table_args__ = {'extend_existing': True}
    __allow_unmapped__ = True

    recipient_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    notification_id = db.Column(
        db.Integer,
        db.ForeignKey('notifications.notification_id', ondelete='CASCADE', onupdate='CASCADE'),
        nullable=False
    )
    officer_id = db.Column(
        db.Integer,
        db.ForeignKey('police_officers.officer_id'),
        nullable=False
    )
    sent_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=True
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def to_dict(self):
        return {
            'recipient_id': self.recipient_id,
            'notification_id': self.notification_id,
            'officer_id': self.officer_id,
            'sent_at': self.sent_at.strftime('%Y-%m-%d %H:%M:%S') if self.sent_at else None
        }
