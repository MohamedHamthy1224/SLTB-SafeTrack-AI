from flask_socketio import emit
from app.data.database import socketio as global_socketio

class WebSocketService:

    def __init__(self, socketio=None):
        self.socketio = socketio or global_socketio

    def _emit_event(self, event_name, payload, room=None):
        try:
            if self.socketio:
                if room:
                    self.socketio.emit(event_name, payload, to=room)
                else:
                    self.socketio.emit(event_name, payload)
            else:
                emit(event_name, payload, broadcast=True)
        except Exception:
            pass

    def emit_bus_registered(self, bus_data):
        self._emit_event('bus_registered', bus_data, room='sltb_admin')

    def emit_bus_updated(self, bus_data):
        self._emit_event('bus_updated', bus_data, room='sltb_admin')

    def emit_bus_deactivated(self, deactivate_data):
        self._emit_event('bus_deactivated', deactivate_data, room='sltb_admin')

    def emit_bus_summary_updated(self, summary_data):
        self._emit_event('bus_summary_updated', summary_data, room='sltb_admin')

    def emit_bus_assignment_updated(self, assignment_data):
        self._emit_event('bus_assignment_updated', assignment_data, room='sltb_admin')

    def emit_assignment_history_created(self, history_data):
        self._emit_event('assignment_history_created', history_data, room='sltb_admin')

    def emit_route_registered(self, route_data):
        self._emit_event('route_registered', route_data, room='sltb_admin')

    def emit_route_updated(self, route_data):
        self._emit_event('route_updated', route_data, room='sltb_admin')

    def emit_route_deactivated(self, deactivate_data):
        self._emit_event('route_deactivated', deactivate_data, room='sltb_admin')

    def emit_route_summary_updated(self, summary_data):
        self._emit_event('route_summary_updated', summary_data, room='sltb_admin')

    def emit_recent_activity_created(self, activity_data):
        self._emit_event('recent_activity_created', activity_data, room='sltb_admin')

    def emit_driver_registered(self, driver_data):
        self._emit_event('driver_registered', driver_data, room='sltb_admin')

    def emit_driver_updated(self, driver_data):
        self._emit_event('driver_updated', driver_data, room='sltb_admin')

    def emit_driver_deactivated(self, deactivate_data):
        self._emit_event('driver_deactivated', deactivate_data, room='sltb_admin')

    def emit_driver_summary_updated(self, summary_data):
        self._emit_event('driver_summary_updated', summary_data, room='sltb_admin')

    def emit_bus_alert_created(self, alert_data):
        self._emit_event('bus_alert_created', alert_data)

    def emit_bus_alert_updated(self, alert_data):
        self._emit_event('bus_alert_updated', alert_data)

    def emit_profile_updated(self, profile_data):
        self._emit_event('profile_updated', profile_data)

    def emit_theme_updated(self, theme_data):
        self._emit_event('theme_updated', theme_data)

    def emit_system_log_created(self, log_data):
        self._emit_event('system_log_created', log_data)

    def emit_device_created(self, device_data):
        self._emit_event('device_created', device_data)
        self._emit_event('device_created', device_data, room='police_admin')

    def emit_device_updated(self, device_data):
        self._emit_event('device_updated', device_data)
        self._emit_event('device_updated', device_data, room='police_admin')

    def emit_device_status_changed(self, status_data):
        self._emit_event('device_status_changed', status_data)
        self._emit_event('device_status_changed', status_data, room='police_admin')

    def emit_device_assignment_changed(self, assignment_data):
        self._emit_event('device_assignment_changed', assignment_data)
        self._emit_event('device_assignment_changed', assignment_data, room='police_admin')

    def emit_device_online_status_changed(self, online_data):
        self._emit_event('device_online_status_changed', online_data)
        self._emit_event('device_online_status_changed', online_data, room='police_admin')

    def emit_device_summary_updated(self, summary_data):
        self._emit_event('device_summary_updated', summary_data)
        self._emit_event('device_summary_updated', summary_data, room='police_admin')

    def emit_roadside_alert_created(self, alert_data):
        self._emit_event('roadside_alert_created', alert_data)
        self._emit_event('roadside_alert_created', alert_data, room='police_admin')

    def emit_roadside_alert_summary_updated(self, summary_data):
        self._emit_event('roadside_alert_summary_updated', summary_data)
        self._emit_event('roadside_alert_summary_updated', summary_data, room='police_admin')

