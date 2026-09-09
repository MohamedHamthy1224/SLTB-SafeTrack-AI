from app.data.database import db
from app.data.models.bus_alert_model import BusAlertModel
from app.data.models.notification_model import NotificationModel
from app.data.repositories.bus_alert_repository import BusAlertRepository
from app.data.repositories.activity_log_repository import ActivityLogRepository
from app.business.services.pdf_generator_service import PDFGeneratorService
from app.business.services.websocket_service import WebSocketService
from app.business.exceptions.application_exceptions import NotFoundError, ValidationError, ApplicationError
from datetime import datetime, timezone

class BusAlertService:

    def __init__(self, repository=None, activity_repo=None, websocket_service=None):
        self.repository = repository or BusAlertRepository()
        self.activity_repo = activity_repo or ActivityLogRepository()
        self.ws_service = websocket_service or WebSocketService()

    def _format_alert(self, alert, bus=None, notif=None, sensor=None):
        alert_time_fmt = alert.alert_time.strftime('%d %b %Y, %H:%M:%S') if alert.alert_time else '—'
        alert_time_iso = alert.alert_time.strftime('%Y-%m-%d %H:%M:%S') if alert.alert_time else None
        created_at_fmt = notif.created_at.strftime('%d %b %Y, %H:%M:%S') if notif and notif.created_at else alert_time_fmt

        priority = notif.priority if notif and notif.priority else 'Medium'
        title = notif.title if notif and notif.title else 'Forward Object Detected'
        message = notif.message if notif and notif.message else 'Onboard sensor threshold alert triggered on vehicle.'

        bus_dict = None
        if bus:
            bus_dict = {
                'busId': bus.bus_id,
                'bus_id': bus.bus_id,
                'registrationNumber': bus.registration_number or '—',
                'registration_number': bus.registration_number or '—',
                'busNumber': bus.bus_number or '—',
                'bus_number': bus.bus_number or '—',
                'serviceType': bus.service_type or 'Public Service',
                'service_type': bus.service_type or 'Public Service',
                'depot': bus.depot or '—',
                'model': bus.model or '—',
                'chassisNumber': bus.chassis_number or '—',
                'chassis_number': bus.chassis_number or '—',
                'engineNumber': bus.engine_number or '—',
                'engine_number': bus.engine_number or '—',
                'capacity': bus.capacity if bus.capacity is not None else '—',
                'standingCapacity': bus.standing_capacity if bus.standing_capacity is not None else '—',
                'standing_capacity': bus.standing_capacity if bus.standing_capacity is not None else '—',
                'fuelType': bus.fuel_type or 'Diesel',
                'fuel_type': bus.fuel_type or 'Diesel',
                'manufactureYear': bus.manufacture_year or '—',
                'manufacture_year': bus.manufacture_year or '—',
                'status': bus.status or 'Active',
                'createdAt': bus.created_at.strftime('%d %b %Y, %H:%M:%S') if bus.created_at else '—',
                'created_at': bus.created_at.strftime('%Y-%m-%d %H:%M:%S') if bus.created_at else None
            }
        else:
            bus_dict = {
                'busId': alert.bus_id,
                'bus_id': alert.bus_id,
                'registrationNumber': '—',
                'busNumber': f"Bus #{alert.bus_id}",
                'serviceType': 'Public Service',
                'depot': '—',
                'model': '—',
                'chassisNumber': '—',
                'engineNumber': '—',
                'capacity': '—',
                'standingCapacity': '—',
                'fuelType': 'Diesel',
                'manufactureYear': '—',
                'status': 'Active',
                'createdAt': '—'
            }

        return {
            'id': alert.bus_alert_id,
            'busAlertId': alert.bus_alert_id,
            'bus_alert_id': alert.bus_alert_id,
            'busId': alert.bus_id,
            'bus_id': alert.bus_id,
            'busNumber': bus.bus_number if bus else f"Bus #{alert.bus_id}",
            'bus_number': bus.bus_number if bus else f"Bus #{alert.bus_id}",
            'registrationNumber': bus.registration_number if bus else '—',
            'registration_number': bus.registration_number if bus else '—',
            'deviceId': alert.device_id,
            'device_id': alert.device_id,
            'assignmentId': alert.assignment_id if alert.assignment_id else '—',
            'assignment_id': alert.assignment_id,
            'sensorDataId': alert.sensor_data_id if alert.sensor_data_id else '—',
            'sensor_data_id': alert.sensor_data_id,
            'alertTime': alert_time_fmt,
            'alert_time': alert_time_iso,
            'notificationTitle': title,
            'notification_title': title,
            'priority': priority,
            'message': message,
            'description': message,
            'actionRequired': 'Please take immediate action to ensure passenger safety. This is an automated message from SLTB SafeTrack AI.',
            'createdAt': created_at_fmt,
            'created_at': created_at_fmt,
            'busDetails': bus_dict,
            'sensorData': sensor.to_dict() if sensor else None
        }

    def get_alerts(self, params=None):
        params = params or {}
        page = params.get('page')
        per_page = params.get('per_page') or params.get('limit') or 10

        filters = {
            'priority': params.get('priority'),
            'search': params.get('search'),
            'bus_id': params.get('bus_id') or params.get('busId'),
            'device_id': params.get('device_id') or params.get('deviceId'),
            'start_date': params.get('start_date') or params.get('startDate'),
            'end_date': params.get('end_date') or params.get('endDate')
        }

        result = self.repository.get_filtered(filters=filters, page=page, per_page=per_page)

        formatted_items = []
        for alert, bus, notif, sensor in result['items']:
            formatted_items.append(self._format_alert(alert, bus, notif, sensor))

        return {
            'items': formatted_items,
            'total': result['total'],
            'totalItems': result['total'],
            'page': result['page'],
            'perPage': result['per_page'],
            'totalPages': result['total_pages']
        }

    def get_alert_by_id(self, alert_id):
        row = self.repository.get_by_id(alert_id)
        if not row:
            raise NotFoundError(f"Bus Alert with ID {alert_id} not found.")

        alert, bus, notif, sensor = row
        return self._format_alert(alert, bus, notif, sensor)

    def get_summary(self):
        return self.repository.get_summary()

    def get_recent(self, limit=5):
        rows = self.repository.get_recent(limit=limit)
        results = []
        for alert, notif in rows:
            notif_title = notif.title if notif and notif.title else 'Forward Object Detected'
            notif_msg = notif.message if notif and notif.message else 'Onboard proximity threshold triggered.'
            notif_priority = notif.priority if notif and notif.priority else 'Medium'

            # Derive notification type
            t_lower = notif_title.lower()
            n_type = 'alert'
            if 'headlight' in t_lower or 'light' in t_lower or 'ldr' in t_lower:
                n_type = 'headlight'
            elif 'motion' in t_lower or 'pir' in t_lower:
                n_type = 'motion'
            elif 'distance' in t_lower or 'proximity' in t_lower:
                n_type = 'distance'

            # Relative / short time string
            time_str = alert.alert_time.strftime('%I:%M %p') if alert.alert_time else '—'

            results.append({
                'id': alert.bus_alert_id,
                'title': notif_title,
                'priority': notif_priority,
                'desc': notif_msg,
                'time': time_str,
                'type': n_type
            })

        return results

    def get_charts_data(self):
        return self.repository.get_charts_data()

    def export_pdf(self, params=None, request_user_id=None):
        params = params or {}
        filters = {
            'priority': params.get('priority'),
            'search': params.get('search'),
            'bus_id': params.get('bus_id') or params.get('busId'),
            'device_id': params.get('device_id') or params.get('deviceId'),
            'start_date': params.get('start_date') or params.get('startDate'),
            'end_date': params.get('end_date') or params.get('endDate')
        }

        rows = self.repository.get_alerts_for_export(filters=filters)

        formatted_rows = []
        for alert, bus, notif, sensor in rows:
            formatted_rows.append({
                'busAlertId': f"BA-{alert.bus_alert_id:04d}",
                'busId': f"BUS-{alert.bus_id:04d}",
                'busNumber': bus.bus_number if bus and bus.bus_number else f"Bus #{alert.bus_id}",
                'regNumber': bus.registration_number if bus and bus.registration_number else '—',
                'deviceId': f"DEV-{alert.device_id:04d}",
                'alertTime': alert.alert_time.strftime('%Y-%m-%d %H:%M:%S') if alert.alert_time else '—',
                'priority': notif.priority if notif and notif.priority else 'Medium',
                'title': notif.title if notif and notif.title else 'Bus Alert'
            })

        cols = [
            {'header': 'Alert ID', 'key': 'busAlertId', 'width': 9, 'align': 'left'},
            {'header': 'Bus ID', 'key': 'busId', 'width': 8, 'align': 'left'},
            {'header': 'Bus Number', 'key': 'busNumber', 'width': 12, 'align': 'left'},
            {'header': 'Registration', 'key': 'regNumber', 'width': 14, 'align': 'left'},
            {'header': 'Device ID', 'key': 'deviceId', 'width': 10, 'align': 'left'},
            {'header': 'Alert Time', 'key': 'alertTime', 'width': 19, 'align': 'left'},
            {'header': 'Priority', 'key': 'priority', 'width': 9, 'align': 'left'},
            {'header': 'Notification Title', 'key': 'title', 'width': 18, 'align': 'left'},
        ]

        if request_user_id:
            try:
                self.activity_repo.log_activity(request_user_id, "Exported Police Bus Alerts PDF report.")
            except Exception:
                pass

        filter_priority = filters.get('priority')
        pdf_bytes = PDFGeneratorService.generate_report_pdf(
            title="SLTB SAFETRACK AI - POLICE BUS ALERTS REPORT",
            columns=cols,
            rows=formatted_rows,
            summary_metrics={'Total Alerts': len(formatted_rows)},
            filter_info={
                'Priority': filter_priority if filter_priority and filter_priority.lower() != 'all' else 'All Priorities',
                'Search': filters.get('search') or None
            },
            user_info=f"User #{request_user_id}" if request_user_id else "Police Admin"
        )

        return pdf_bytes

    def create_bus_alert(self, data):
        try:
            alert = BusAlertModel(
                bus_id=data.get('bus_id'),
                device_id=data.get('device_id'),
                assignment_id=data.get('assignment_id'),
                sensor_data_id=data.get('sensor_data_id'),
                alert_time=data.get('alert_time') or datetime.now(timezone.utc)
            )
            db.session.add(alert)
            db.session.flush()

            notif = None
            if data.get('title') or data.get('message') or data.get('priority'):
                notif = NotificationModel(
                    title=data.get('title', 'Onboard Sensor Alert'),
                    message=data.get('message', 'Vehicle safety threshold triggered.'),
                    priority=data.get('priority', 'Medium'),
                    bus_alert_id=alert.bus_alert_id,
                    created_at=datetime.now(timezone.utc)
                )
                db.session.add(notif)
                db.session.flush()

            db.session.commit()

            formatted = self.get_alert_by_id(alert.bus_alert_id)

            # Emit Real-Time Socket Event
            try:
                self.ws_service.emit_bus_alert_created(formatted)
                self.ws_service.emit_bus_summary_updated(self.get_summary())
            except Exception:
                pass

            return formatted
        except Exception:
            db.session.rollback()
            raise
