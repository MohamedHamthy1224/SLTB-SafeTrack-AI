import traceback
from flask import Blueprint, current_app
from app.presentation.response_factory import ResponseFactory
from app.data.models.bus_model import BusModel
from app.data.models.route_model import RouteModel
from app.data.models.driver_model import DriverModel
from app.data.database import mail
from flask_mail import Message

public_bp = Blueprint('public', __name__, url_prefix='/api/v1')

@public_bp.route('/health', methods=['GET'])
def health_check():
    return ResponseFactory.success(data={'status': 'healthy'}, message='SLTB SafeTrack AI Backend API is active.')

@public_bp.route('/public/statistics', methods=['GET'])
def get_public_statistics():
    try:
        total_buses = BusModel.query.count()
        total_routes = RouteModel.query.count()
        active_buses = BusModel.query.filter_by(status='Active').count()
        total_drivers = DriverModel.query.count()

        data = {
            'totalBuses': total_buses,
            'totalRoutes': total_routes,
            'activeBuses': active_buses,
            'totalDrivers': total_drivers,
            'districtsCovered': 25,
            'safeJourneysPercentage': 98.6
        }
        return ResponseFactory.success(data=data, message="Public statistics loaded successfully.")
    except Exception as e:
        return ResponseFactory.error(message="Unable to load public statistics.", status_code=500)

@public_bp.route('/test-email', methods=['GET'])
def test_email():
    try:
        sender = current_app.config.get('MAIL_DEFAULT_SENDER')
        recipient = current_app.config.get('MAIL_USERNAME')
        
        msg = Message(
            subject="SLTB SafeTrack AI — SMTP Diagnostic Test",
            sender=sender,
            recipients=[recipient],
            body="This is a diagnostic test email to confirm Flask-Mail SMTP connectivity with Gmail."
        )
        
        mail.send(msg)
        return ResponseFactory.success(data={
            "smtp_connected": True,
            "smtp_login_success": True,
            "email_sent": True,
            "recipient": recipient
        }, message="Diagnostic test email successfully sent via Gmail SMTP.")
    except Exception as e:
        tb = traceback.format_exc()
        current_app.logger.error(f"Diagnostic test email failed: {tb}")
        return ResponseFactory.error(
            message=f"SMTP Diagnostic Error: {str(e)}",
            errors={"traceback": tb},
            status_code=500
        )
