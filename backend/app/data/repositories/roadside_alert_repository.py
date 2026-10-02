from app.data.database import db
from app.data.models.roadside_alert_model import RoadsideAlertModel
from app.data.models.roadside_unit_model import RoadsideUnitModel
from app.data.models.notification_model import NotificationModel
from app.data.models.sensor_data_model import SensorDataModel
from app.data.repositories.base_repository import BaseRepository
from sqlalchemy import func, distinct
from datetime import datetime, timedelta

class RoadsideAlertRepository(BaseRepository):

    def get_by_id(self, entity_id):
        alert = db.session.query(RoadsideAlertModel).filter(
            RoadsideAlertModel.roadside_alert_id == entity_id
        ).first()

        if not alert:
            return None

        # Fetch unit
        unit = db.session.query(RoadsideUnitModel).filter(
            RoadsideUnitModel.roadside_unit_id == alert.roadside_unit_id
        ).first()

        # Fetch notification
        notif = db.session.query(NotificationModel).filter(
            NotificationModel.roadside_alert_id == alert.roadside_alert_id
        ).order_by(NotificationModel.notification_id.desc()).first()

        alert_time_str = alert.alert_time.strftime('%Y-%m-%d %H:%M:%S') if alert.alert_time else None

        result = {
            'roadsideAlertId': alert.roadside_alert_id,
            'roadside_alert_id': alert.roadside_alert_id,
            'roadsideUnitId': alert.roadside_unit_id,
            'roadside_unit_id': alert.roadside_unit_id,
            'deviceId': alert.device_id,
            'device_id': alert.device_id,
            'routeId': alert.route_id,
            'route_id': alert.route_id,
            'sensorDataId': alert.sensor_data_id,
            'sensor_data_id': alert.sensor_data_id,
            'alertTime': alert_time_str,
            'alert_time': alert_time_str,
            'notificationTitle': notif.title if notif else 'U-Turn Alert',
            'notification_title': notif.title if notif else 'U-Turn Alert',
            'priority': notif.priority if notif else 'Medium',
            'message': notif.message if notif else '',
            'alert': {
                'roadsideAlertId': alert.roadside_alert_id,
                'roadside_alert_id': alert.roadside_alert_id,
                'roadsideUnitId': alert.roadside_unit_id,
                'roadside_unit_id': alert.roadside_unit_id,
                'deviceId': alert.device_id,
                'device_id': alert.device_id,
                'routeId': alert.route_id,
                'route_id': alert.route_id,
                'sensorDataId': alert.sensor_data_id,
                'sensor_data_id': alert.sensor_data_id,
                'alertTime': alert_time_str,
                'alert_time': alert_time_str,
            },
            'location': unit.to_dict() if unit else None,
            'locationInfo': unit.to_dict() if unit else None,
            'notification': notif.to_dict() if notif else None,
            'notificationMessage': notif.to_dict() if notif else None
        }

        return result

    def get_all(self, priority=None):
        query = db.session.query(
            RoadsideAlertModel,
            NotificationModel.title,
            NotificationModel.priority,
            NotificationModel.message,
            RoadsideUnitModel.location_name
        ).outerjoin(
            NotificationModel,
            NotificationModel.roadside_alert_id == RoadsideAlertModel.roadside_alert_id
        ).outerjoin(
            RoadsideUnitModel,
            RoadsideUnitModel.roadside_unit_id == RoadsideAlertModel.roadside_unit_id
        )

        if priority and str(priority).strip() and str(priority).lower() != 'all':
            query = query.filter(NotificationModel.priority == priority.strip())

        query = query.order_by(RoadsideAlertModel.alert_time.desc(), RoadsideAlertModel.roadside_alert_id.desc())
        rows = query.all()

        results = []
        for alert, notif_title, notif_priority, notif_msg, loc_name in rows:
            alert_time_str = alert.alert_time.strftime('%Y-%m-%d %H:%M:%S') if alert.alert_time else None
            results.append({
                'id': alert.roadside_alert_id,
                'roadsideAlertId': alert.roadside_alert_id,
                'roadside_alert_id': alert.roadside_alert_id,
                'roadsideUnitId': alert.roadside_unit_id,
                'roadside_unit_id': alert.roadside_unit_id,
                'deviceId': alert.device_id,
                'device_id': alert.device_id,
                'routeId': alert.route_id,
                'route_id': alert.route_id,
                'sensorDataId': alert.sensor_data_id,
                'sensor_data_id': alert.sensor_data_id,
                'alertTime': alert_time_str,
                'alert_time': alert_time_str,
                'notificationTitle': notif_title or 'U-Turn Alert',
                'notification_title': notif_title or 'U-Turn Alert',
                'priority': notif_priority or 'Medium',
                'message': notif_msg or '',
                'locationName': loc_name or '—',
                'location_name': loc_name or '—'
            })

        return results

    def get_summary(self):
        total_alerts = db.session.query(func.count(RoadsideAlertModel.roadside_alert_id)).scalar() or 0

        # Subquery or join for priorities
        high_alerts = db.session.query(func.count(RoadsideAlertModel.roadside_alert_id)).join(
            NotificationModel, NotificationModel.roadside_alert_id == RoadsideAlertModel.roadside_alert_id
        ).filter(NotificationModel.priority == 'High').scalar() or 0

        medium_alerts = db.session.query(func.count(RoadsideAlertModel.roadside_alert_id)).join(
            NotificationModel, NotificationModel.roadside_alert_id == RoadsideAlertModel.roadside_alert_id
        ).filter(NotificationModel.priority == 'Medium').scalar() or 0

        low_alerts = db.session.query(func.count(RoadsideAlertModel.roadside_alert_id)).join(
            NotificationModel, NotificationModel.roadside_alert_id == RoadsideAlertModel.roadside_alert_id
        ).filter(NotificationModel.priority == 'Low').scalar() or 0

        return {
            'totalAlerts': total_alerts,
            'total': total_alerts,
            'highAlerts': high_alerts,
            'high': high_alerts,
            'mediumAlerts': medium_alerts,
            'medium': medium_alerts,
            'lowAlerts': low_alerts,
            'low': low_alerts
        }

    def get_priorities(self):
        return ["High", "Medium", "Low"]

    def get_priority_distribution(self):
        summary = self.get_summary()
        total = summary['totalAlerts']

        high = summary['highAlerts']
        med = summary['mediumAlerts']
        low = summary['lowAlerts']

        high_pct = f"{round((high / total * 100), 1)}%" if total > 0 else "0.0%"
        med_pct = f"{round((med / total * 100), 1)}%" if total > 0 else "0.0%"
        low_pct = f"{round((low / total * 100), 1)}%" if total > 0 else "0.0%"

        return [
            {'name': 'High', 'value': high, 'percentage': high_pct, 'color': '#EF4444'},
            {'name': 'Medium', 'value': med, 'percentage': med_pct, 'color': '#F97316'},
            {'name': 'Low', 'value': low, 'percentage': low_pct, 'color': '#10B981'},
        ]

    def get_weekly_overview(self):
        # Calculate daily counts for the last 7 days or by day of week
        days_order = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        counts_by_day = {d: 0 for d in days_order}

        alerts = db.session.query(RoadsideAlertModel.alert_time).all()
        for (a_time,) in alerts:
            if a_time:
                day_name = a_time.strftime('%a') # Mon, Tue, etc.
                if day_name in counts_by_day:
                    counts_by_day[day_name] += 1

        return [
            {'day': d, 'alerts': counts_by_day[d], 'count': counts_by_day[d]}
            for d in days_order
        ]

    def get_recent_notifications(self, limit=5):
        query = db.session.query(
            NotificationModel.notification_id,
            NotificationModel.title,
            NotificationModel.message,
            NotificationModel.priority,
            NotificationModel.created_at,
            NotificationModel.roadside_alert_id
        ).filter(
            NotificationModel.roadside_alert_id != None
        ).order_by(
            NotificationModel.created_at.desc(),
            NotificationModel.notification_id.desc()
        ).limit(limit)

        rows = query.all()
        results = []
        for notif_id, title, msg, priority, created_at, alert_id in rows:
            time_str = created_at.strftime('%I:%M %p') if created_at else ''
            results.append({
                'id': notif_id,
                'notificationId': notif_id,
                'title': title,
                'message': msg,
                'desc': msg,
                'priority': priority,
                'time': time_str,
                'createdAt': created_at.strftime('%Y-%m-%d %H:%M:%S') if created_at else '',
                'roadsideAlertId': alert_id
            })

        return results

    def create(self, data, commit=True):
        alert = RoadsideAlertModel(
            roadside_unit_id=data.get('roadsideUnitId') or data.get('roadside_unit_id'),
            device_id=data.get('deviceId') or data.get('device_id'),
            route_id=data.get('routeId') or data.get('route_id'),
            sensor_data_id=data.get('sensorDataId') or data.get('sensor_data_id'),
            alert_time=data.get('alertTime') or data.get('alert_time') or datetime.now()
        )
        db.session.add(alert)
        if commit:
            db.session.commit()
        else:
            db.session.flush()
        return alert

    def create_notification(self, data, commit=True):
        notif = NotificationModel(
            title=data.get('title', 'U-Turn Alert'),
            message=data.get('message', 'U-turn alert triggered.'),
            priority=data.get('priority', 'Medium'),
            roadside_alert_id=data.get('roadsideAlertId') or data.get('roadside_alert_id')
        )
        db.session.add(notif)
        if commit:
            db.session.commit()
        else:
            db.session.flush()
        return notif

    def update(self, entity_id, data, commit=True):
        alert = self.get_by_id(entity_id)
        # Alerts are historical logs, updates not standard
        return alert

    def delete(self, entity_id, commit=True):
        alert = db.session.query(RoadsideAlertModel).filter(
            RoadsideAlertModel.roadside_alert_id == entity_id
        ).first()
        if alert:
            db.session.delete(alert)
            if commit:
                db.session.commit()
            return True
        return False

    def get_latest_sensor_data(self, device_id: int, roadside_unit_id: int, exclude_sensor_data_id: int = None):
        """
        Query the latest sensor_data record for the given device_id and roadside_unit_id.
        Optionally excludes exclude_sensor_data_id to avoid selecting the current row.
        """
        query = db.session.query(SensorDataModel).filter(
            SensorDataModel.device_id == device_id,
            SensorDataModel.roadside_unit_id == roadside_unit_id
        )
        if exclude_sensor_data_id is not None:
            query = query.filter(SensorDataModel.sensor_data_id != exclude_sensor_data_id)
        return query.order_by(SensorDataModel.sensor_data_id.desc()).first()

