"""
Hardware Sensor Controller
==========================
Device-to-device API endpoints for ESP32 sensor data ingestion.

Endpoints (no JWT required — device-to-device communication):
  POST /api/v1/hardware/uturn-sensor-data
  POST /api/v1/hardware/bus-sensor-data

Protected endpoints (JWT required — for police officers):
  GET  /api/v1/police/notifications
"""

from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity

from app.presentation.response_factory import ResponseFactory
from app.business.services.hardware_sensor_service import (
    HardwareSensorService,
    HardwareSensorServiceError
)
from app.data.models.police_officer_model import PoliceOfficerModel
from app.data.database import db

hardware_sensor_bp = Blueprint(
    'hardware_sensor',
    __name__,
    url_prefix='/api/v1/hardware'
)

# Reuse the police_notifications route on the same controller blueprint
# with a different URL prefix alias set below
police_notif_bp = Blueprint(
    'police_notifications',
    __name__,
    url_prefix='/api/v1/police'
)

_sensor_service = HardwareSensorService()


# ==============================================================================
# U-TURN SENSOR DATA  — POST /api/v1/hardware/uturn-sensor-data
# ==============================================================================

@hardware_sensor_bp.route('/uturn-sensor-data', methods=['POST'])
def uturn_sensor_data():
    """
    Receives U-Turn ESP32 sensor data and executes the full pipeline:
    sensor_data → roadside_alerts → notifications → notification_recipients → Socket.IO

    No JWT authentication required (device-to-device).
    """
    data = request.get_json(silent=True)

    if not data:
        return ResponseFactory.error(
            message="Request body must be valid JSON.",
            errors={"body": "No JSON payload received."},
            status_code=400
        )

    try:
        result = _sensor_service.process_uturn_sensor_data(data)
        return ResponseFactory.success(
            data=result,
            message="U-Turn sensor data processed successfully.",
            status_code=201
        )
    except HardwareSensorServiceError as e:
        return ResponseFactory.error(
            message=e.message,
            errors=e.errors,
            status_code=e.status_code
        )
    except Exception as e:
        return ResponseFactory.error(
            message=f"Internal server error: {str(e)}",
            status_code=500
        )


# ==============================================================================
# BUS SENSOR DATA  — POST /api/v1/hardware/bus-sensor-data
# ==============================================================================

@hardware_sensor_bp.route('/bus-sensor-data', methods=['POST'])
def bus_sensor_data():
    """
    Receives Bus ESP32 sensor data and executes the full pipeline:
    sensor_data → bus_alerts → notifications → notification_recipients → Socket.IO

    No JWT authentication required (device-to-device).
    """
    data = request.get_json(silent=True)

    if not data:
        return ResponseFactory.error(
            message="Request body must be valid JSON.",
            errors={"body": "No JSON payload received."},
            status_code=400
        )

    try:
        result = _sensor_service.process_bus_sensor_data(data)
        return ResponseFactory.success(
            data=result,
            message="Bus sensor data processed successfully.",
            status_code=201
        )
    except HardwareSensorServiceError as e:
        return ResponseFactory.error(
            message=e.message,
            errors=e.errors,
            status_code=e.status_code
        )
    except Exception as e:
        return ResponseFactory.error(
            message=f"Internal server error: {str(e)}",
            status_code=500
        )


# ==============================================================================
# POLICE NOTIFICATIONS  — GET /api/v1/police/notifications
# ==============================================================================

def _get_police_officer_id(user_id):
    """
    Resolve user_id → officer_id via police_officers.user_id FK.
    Returns officer_id or None.
    """
    officer = db.session.query(PoliceOfficerModel).filter(
        PoliceOfficerModel.user_id == int(user_id)
    ).first()
    return officer.officer_id if officer else None


@police_notif_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_police_notifications():
    """
    Return recent notifications for the authenticated police officer.
    Joins notification_recipients → notifications.
    Query param: limit (default 10, max 50)
    """
    claims = get_jwt()
    role = claims.get('role')
    if role not in ['Police Admin', 'Traffic Police Officer']:
        return ResponseFactory.error(
            message="Access restricted to Police Admin accounts.",
            status_code=403
        )

    current_user_id = get_jwt_identity()
    officer_id = _get_police_officer_id(current_user_id)

    if not officer_id:
        return ResponseFactory.error(
            message="No police officer profile found for this user.",
            status_code=404
        )

    try:
        limit = request.args.get('limit', default=10, type=int)
        limit = max(1, min(limit, 50))  # clamp between 1 and 50

        notifications = _sensor_service.get_officer_notifications(
            officer_id=officer_id,
            limit=limit
        )
        return ResponseFactory.success(
            data=notifications,
            message="Notifications retrieved successfully."
        )
    except HardwareSensorServiceError as e:
        return ResponseFactory.error(
            message=e.message,
            status_code=e.status_code
        )
    except Exception as e:
        return ResponseFactory.error(
            message=f"Failed to retrieve notifications: {str(e)}",
            status_code=500
        )
