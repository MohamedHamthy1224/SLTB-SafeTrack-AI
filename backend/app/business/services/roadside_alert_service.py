from app.data.repositories.roadside_alert_repository import RoadsideAlertRepository
from app.business.services.websocket_service import WebSocketService
from app.business.exceptions.application_exceptions import ApplicationError
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timezone

class RoadsideAlertServiceError(ApplicationError):
    def __init__(self, message="Roadside alert service error occurred.", errors=None, status_code=400):
        super().__init__(message, status_code=status_code)
        self.errors = errors or {}

class RoadsideAlertService:

    def __init__(self, repository=None, websocket_service=None):
        self.repository = repository or RoadsideAlertRepository()
        self.websocket_service = websocket_service or WebSocketService()

    def get_all_alerts(self, priority=None):
        try:
            return self.repository.get_all(priority=priority)
        except SQLAlchemyError as e:
            raise RoadsideAlertServiceError("Failed to fetch U-Turn alerts from database.", status_code=500)

    def get_summary(self):
        try:
            return self.repository.get_summary()
        except SQLAlchemyError as e:
            raise RoadsideAlertServiceError("Failed to compute U-Turn alert summary statistics.", status_code=500)

    def get_priorities(self):
        try:
            return self.repository.get_priorities()
        except SQLAlchemyError as e:
            raise RoadsideAlertServiceError("Failed to load priorities.", status_code=500)

    def get_charts(self):
        try:
            priority_dist = self.repository.get_priority_distribution()
            weekly_overview = self.repository.get_weekly_overview()
            return {
                'priorityDistribution': priority_dist,
                'weeklyOverview': weekly_overview
            }
        except SQLAlchemyError as e:
            raise RoadsideAlertServiceError("Failed to load chart analytics data.", status_code=500)

    def get_recent_notifications(self, limit=5):
        try:
            return self.repository.get_recent_notifications(limit=limit)
        except SQLAlchemyError as e:
            raise RoadsideAlertServiceError("Failed to fetch recent notifications.", status_code=500)

    def get_alert_details(self, alert_id):
        try:
            alert = self.repository.get_by_id(alert_id)
            if not alert:
                raise RoadsideAlertServiceError(f"U-Turn alert with ID {alert_id} not found.", status_code=404)
            return alert
        except RoadsideAlertServiceError:
            raise
        except SQLAlchemyError as e:
            raise RoadsideAlertServiceError("Database error occurred while fetching alert details.", status_code=500)

    def create_alert(self, alert_data, notification_data=None):
        try:
            alert = self.repository.create(alert_data, commit=False)

            created_notif = None
            if notification_data:
                notif_payload = dict(notification_data)
                notif_payload['roadsideAlertId'] = alert.roadside_alert_id
                created_notif = self.repository.create_notification(notif_payload, commit=False)

            # Commit transaction
            from app.data.database import db
            db.session.commit()

            alert_dict = self.repository.get_by_id(alert.roadside_alert_id)

            # Post-commit Socket.IO broadcast
            try:
                self.websocket_service.emit_roadside_alert_created(alert_dict)
                summary = self.repository.get_summary()
                self.websocket_service.emit_roadside_alert_summary_updated(summary)
            except Exception:
                pass

            return alert_dict
        except SQLAlchemyError as e:
            from app.data.database import db
            db.session.rollback()
            raise RoadsideAlertServiceError("Database transaction failed while creating roadside alert.", status_code=500)

    def export_pdf(self, priority=None, user_id=None):
        alerts = self.repository.get_all(priority=priority)
        summary = self.repository.get_summary()

        cols = [
            {'header': 'Alert ID', 'key': 'roadsideAlertId', 'width': 9, 'align': 'left'},
            {'header': 'Unit ID', 'key': 'roadsideUnitId', 'width': 8, 'align': 'left'},
            {'header': 'Device', 'key': 'deviceId', 'width': 8, 'align': 'left'},
            {'header': 'Route', 'key': 'routeId', 'width': 6, 'align': 'left'},
            {'header': 'Location', 'key': 'locationName', 'width': 18, 'align': 'left'},
            {'header': 'Alert Time', 'key': 'alertTime', 'width': 19, 'align': 'left'},
            {'header': 'Priority', 'key': 'priority', 'width': 9, 'align': 'left'},
            {'header': 'Notification Title', 'key': 'notificationTitle', 'width': 22, 'align': 'left'},
        ]

        summary_metrics = {
            'Total Alerts': summary.get('totalAlerts', 0),
            'High Risk': summary.get('highAlerts', 0),
            'Medium Risk': summary.get('mediumAlerts', 0),
            'Low Risk': summary.get('lowAlerts', 0)
        }

        filter_info = {'Priority': priority if priority and priority != 'all' else 'All Priorities'}

        # Activity log
        if user_id:
            try:
                from app.data.repositories.activity_log_repository import ActivityLogRepository
                ActivityLogRepository().log_activity(user_id, "Exported U-Turn Alerts PDF report.")
            except Exception:
                pass

        from app.business.services.pdf_generator_service import PDFGeneratorService
        return PDFGeneratorService.generate_report_pdf(
            title="SLTB SAFETRACK AI - POLICE U-TURN ALERTS REPORT",
            columns=cols,
            rows=alerts,
            summary_metrics=summary_metrics,
            filter_info=filter_info,
            user_info=f"User #{user_id}" if user_id else "Police Admin"
        )

