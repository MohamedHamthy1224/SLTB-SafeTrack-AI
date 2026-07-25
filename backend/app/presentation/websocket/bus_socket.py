from flask_socketio import join_room, leave_room

def register_bus_socket_events(socketio):

    @socketio.on('join_sltb_admin')
    def handle_join_sltb_admin(data=None):
        join_room('sltb_admin')
        return {'status': 'joined', 'room': 'sltb_admin'}

    @socketio.on('leave_sltb_admin')
    def handle_leave_sltb_admin(data=None):
        leave_room('sltb_admin')
        return {'status': 'left', 'room': 'sltb_admin'}
