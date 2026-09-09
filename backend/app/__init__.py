import sys
import os

# Ensure backend directory is present in sys.path for static analysis and imports
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from flask import Flask
from flask_cors import CORS
from app.config import config_by_name
from app.data.database import db, bcrypt, jwt, mail, socketio
from flask_socketio import join_room
from app.presentation.error_handlers import register_error_handlers
from app.presentation.controllers.public_controller import public_bp
from app.presentation.controllers.auth_controller import auth_bp
from app.presentation.controllers.dashboard_controller import dashboard_bp
from app.presentation.controllers.search_controller import search_bp
from app.presentation.controllers.bus_controller import bus_bp
from app.presentation.controllers.route_option_controller import route_option_bp
from app.presentation.controllers.driver_option_controller import driver_option_bp
from app.presentation.controllers.driver_controller import driver_bp
from app.presentation.controllers.route_controller import route_bp
from app.presentation.controllers.profile_controller import profile_bp
from app.presentation.controllers.settings_controller import settings_bp
from app.presentation.controllers.police_settings_controller import police_settings_bp
from app.presentation.controllers.police_system_log_controller import police_system_log_bp
from app.presentation.controllers.police_device_controller import police_device_bp
from app.presentation.controllers.police_roadside_alert_controller import police_roadside_alert_bp
from app.presentation.controllers.police_bus_alert_controller import police_bus_alert_bp
from app.presentation.controllers.police_uturn_controller import police_uturn_bp
from app.presentation.controllers.police_dashboard_controller import police_dashboard_bp
from app.presentation.controllers.user_controller import user_bp, police_user_bp
from app.presentation.controllers.report_controller import report_bp
from app.commands.password_commands import hash_existing_passwords_command

def create_app(config_name="development"):
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    # Enable CORS for React Vite frontend (port 3000 / 5173 / 5174)
    CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173", "http://10.207.162.17:3000"]}}, supports_credentials=True)

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    socketio.init_app(app, cors_allowed_origins="*", async_mode='threading')

    @socketio.on('join_sltb_admin')
    def handle_join_sltb_admin():
        join_room('sltb_admin')

    @socketio.on('join_police_admin')
    def handle_join_police_admin():
        join_room('police_admin')

    # Register blueprints
    app.register_blueprint(public_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(police_dashboard_bp)
    app.register_blueprint(search_bp)
    app.register_blueprint(bus_bp)
    app.register_blueprint(route_bp)
    app.register_blueprint(route_option_bp)
    app.register_blueprint(driver_option_bp)
    app.register_blueprint(driver_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(settings_bp)
    app.register_blueprint(police_settings_bp)
    app.register_blueprint(police_system_log_bp)
    app.register_blueprint(police_device_bp)
    app.register_blueprint(police_roadside_alert_bp)
    app.register_blueprint(police_bus_alert_bp)
    app.register_blueprint(police_uturn_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(police_user_bp)
    app.register_blueprint(report_bp)


    # Register CLI commands
    app.cli.add_command(hash_existing_passwords_command)

    # Register global error handlers
    register_error_handlers(app)

    return app
