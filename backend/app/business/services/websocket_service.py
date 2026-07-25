from flask_socketio import emit

class WebSocketService:

    def __init__(self, socketio=None):
        self.socketio = socketio

    def _emit_event(self, event_name, payload, room='sltb_admin'):
        try:
            if self.socketio:
                self.socketio.emit(event_name, payload, to=room)
            else:
                emit(event_name, payload, to=room, broadcast=True)
        except Exception:
            pass

    def emit_bus_registered(self, bus_data):
        self._emit_event('bus_registered', bus_data)

    def emit_bus_updated(self, bus_data):
        self._emit_event('bus_updated', bus_data)

    def emit_bus_summary_updated(self, summary_data):
        self._emit_event('bus_summary_updated', summary_data)

    def emit_bus_assignment_updated(self, assignment_data):
        self._emit_event('bus_assignment_updated', assignment_data)

    def emit_route_registered(self, route_data):
        self._emit_event('route_registered', route_data)

    def emit_route_updated(self, route_data):
        self._emit_event('route_updated', route_data)

    def emit_route_deactivated(self, deactivate_data):
        self._emit_event('route_deactivated', deactivate_data)

    def emit_route_summary_updated(self, summary_data):
        self._emit_event('route_summary_updated', summary_data)

    def emit_recent_activity_created(self, activity_data):
        self._emit_event('recent_activity_created', activity_data)

    def emit_driver_registered(self, driver_data):
        self._emit_event('driver_registered', driver_data)

    def emit_driver_updated(self, driver_data):
        self._emit_event('driver_updated', driver_data)

    def emit_driver_deactivated(self, deactivate_data):
        self._emit_event('driver_deactivated', deactivate_data)

    def emit_driver_summary_updated(self, summary_data):
        self._emit_event('driver_summary_updated', summary_data)

    def emit_profile_updated(self, profile_data):
        self._emit_event('profile_updated', profile_data)


