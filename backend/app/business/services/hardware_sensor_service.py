"""
Hardware Sensor Service
=======================
Implements the complete pipeline for processing ESP32 sensor data:

  ESP32 POST → Validate → sensor_data insert → alert generation
  → notification creation → notification_recipients → Socket.IO

This service handles both U-Turn (roadside) sensors and Bus sensors.
It does NOT require JWT; it is called from the hardware controller which
is a device-to-device API (no JWT enforced by default).
"""

from datetime import datetime, timezone, timedelta
import logging

from sqlalchemy.exc import SQLAlchemyError

from app.data.database import db
from app.data.models.sensor_data_model import SensorDataModel
from app.data.models.roadside_alert_model import RoadsideAlertModel
from app.data.models.bus_alert_model import BusAlertModel
from app.data.models.notification_model import NotificationModel
from app.data.models.notification_recipient_model import NotificationRecipientModel
from app.data.models.roadside_unit_model import RoadsideUnitModel
from app.data.models.device_registry_model import DeviceRegistryModel
from app.data.models.bus_model import BusModel
from app.data.models.police_officer_model import PoliceOfficerModel
from app.data.models.assignment_model import BusAssignmentModel
from app.data.repositories.roadside_alert_repository import RoadsideAlertRepository
from app.data.repositories.sensor_data_repository import SensorDataRepository
from app.business.services.websocket_service import WebSocketService

logger = logging.getLogger(__name__)

RISK_LEVELS = {'Low', 'Medium', 'High'}
ALERT_RISK_LEVELS = {'Medium', 'High'}


class HardwareSensorServiceError(Exception):
    def __init__(self, message, status_code=400, errors=None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.errors = errors or {}


class HardwareSensorService:

    def __init__(self, websocket_service=None, sensor_data_repository=None, roadside_alert_repository=None):
        self.ws = websocket_service or WebSocketService()
        self.sensor_data_repo = sensor_data_repository or SensorDataRepository()
        self.roadside_alert_repo = roadside_alert_repository or RoadsideAlertRepository()

    def _is_danger_level(self, risk_level):
        """Returns True if the risk level is Medium or High."""
        if not risk_level:
            return False
        return str(risk_level).strip().capitalize() in ALERT_RISK_LEVELS

    # ------------------------------------------------------------------
    # Validation Helpers
    # ------------------------------------------------------------------

    def _validate_device_id(self, device_id):
        """Verify device_id exists in device_registry."""
        if not device_id:
            raise HardwareSensorServiceError(
                "device_id is required.",
                status_code=400,
                errors={"device_id": "This field is required."}
            )
        device = db.session.query(DeviceRegistryModel).filter(
            DeviceRegistryModel.device_id == int(device_id)
        ).first()
        if not device:
            raise HardwareSensorServiceError(
                f"device_id={device_id} does not exist in device_registry.",
                status_code=404,
                errors={"device_id": "Device not found in registry."}
            )
        return device

    def _validate_roadside_unit_id(self, roadside_unit_id):
        """Verify roadside_unit_id exists in roadside_units."""
        if not roadside_unit_id:
            raise HardwareSensorServiceError(
                "roadside_unit_id is required.",
                status_code=400,
                errors={"roadside_unit_id": "This field is required."}
            )
        unit = db.session.query(RoadsideUnitModel).filter(
            RoadsideUnitModel.roadside_unit_id == int(roadside_unit_id)
        ).first()
        if not unit:
            raise HardwareSensorServiceError(
                f"roadside_unit_id={roadside_unit_id} does not exist in roadside_units.",
                status_code=404,
                errors={"roadside_unit_id": "Roadside unit not found."}
            )
        return unit

    def _validate_bus_id(self, bus_id):
        """Verify bus_id exists in buses."""
        if not bus_id:
            raise HardwareSensorServiceError(
                "bus_id is required.",
                status_code=400,
                errors={"bus_id": "This field is required."}
            )
        bus = db.session.query(BusModel).filter(
            BusModel.bus_id == int(bus_id)
        ).first()
        if not bus:
            raise HardwareSensorServiceError(
                f"bus_id={bus_id} does not exist in buses.",
                status_code=404,
                errors={"bus_id": "Bus not found."}
            )
        return bus

    def _validate_risk_level(self, value, field_name):
        """Validate that a risk level string is a known value."""
        if value and str(value) not in RISK_LEVELS:
            raise HardwareSensorServiceError(
                f"Invalid {field_name}: '{value}'. Must be one of: {', '.join(RISK_LEVELS)}.",
                status_code=400,
                errors={field_name: f"Must be one of: {', '.join(RISK_LEVELS)}."}
            )

    # ------------------------------------------------------------------
    # Notification Recipients
    # ------------------------------------------------------------------

    def _create_notification_recipients(self, notification_id):
        """
        Insert notification_recipients rows for ALL police officers.
        Skips if the (notification_id, officer_id) pair already exists
        (respects the UNIQUE constraint uq_notification_officer).
        Returns count of new rows inserted.
        """
        officers = db.session.query(PoliceOfficerModel).all()
        inserted = 0
        for officer in officers:
            existing = db.session.query(NotificationRecipientModel).filter(
                NotificationRecipientModel.notification_id == notification_id,
                NotificationRecipientModel.officer_id == officer.officer_id
            ).first()
            if not existing:
                recipient = NotificationRecipientModel(
                    notification_id=notification_id,
                    officer_id=officer.officer_id,
                    sent_at=datetime.now(timezone.utc)
                )
                db.session.add(recipient)
                inserted += 1
        db.session.flush()
        return inserted

    # ------------------------------------------------------------------
    # Socket.IO Emission (safe — never crashes the API)
    # ------------------------------------------------------------------

    def _emit_notification(self, notification):
        """Safely emit new_notification to police_admin room."""
        try:
            created_at_str = None
            if notification.created_at:
                created_at_str = notification.created_at.strftime('%Y-%m-%d %H:%M:%S')
            payload = {
                'notification_id': notification.notification_id,
                'title': notification.title,
                'message': notification.message,
                'priority': notification.priority,
                'created_at': created_at_str
            }
            self.ws.emit_new_notification(payload)
        except Exception as e:
            # Socket.IO failure must NOT rollback committed DB data
            import logging
            logging.getLogger(__name__).warning(
                "Socket.IO emit_new_notification failed: %s", str(e)
            )

    # ------------------------------------------------------------------
    # U-Turn Notification Content
    # ------------------------------------------------------------------

    def _build_uturn_notification(self, left_risk, right_risk):
        """Determine notification title, message and priority for U-Turn sensor data."""
        left_is_alert = self._is_danger_level(left_risk)
        right_is_alert = self._is_danger_level(right_risk)

        # Determine overall priority (worst case)
        norm_left = str(left_risk or '').strip().capitalize()
        norm_right = str(right_risk or '').strip().capitalize()
        all_risk_levels = [r for r in [norm_left, norm_right] if r in ALERT_RISK_LEVELS]
        priority = 'High' if 'High' in all_risk_levels else 'Medium'

        # Build message
        if left_is_alert and right_is_alert:
            side = 'both left and right side approaches'
        elif left_is_alert:
            side = 'left side approach'
        else:
            side = 'right side approach'

        if priority == 'High':
            title = 'U-Turn Vehicle Detected'
            message = (
                f"Vehicle detected from {side} at U-turn area. "
                f"Left risk: {left_risk or 'N/A'}, Right risk: {right_risk or 'N/A'}. "
                "Immediate attention required."
            )
        else:
            title = 'Traffic Monitoring Alert'
            message = (
                f"Abnormal traffic condition detected from {side} by roadside sensor. "
                f"Left risk: {left_risk or 'N/A'}, Right risk: {right_risk or 'N/A'}."
            )

        return title, message, priority

    # ------------------------------------------------------------------
    # Bus Notification Content
    # ------------------------------------------------------------------

    def _build_bus_notification(self, front_risk, pir_detected, ldr_detected):
        """Determine notification title, message and priority for Bus sensor data."""
        if str(front_risk or '').strip() == 'High':
            priority = 'High'
            title = 'Front Collision Warning'
            message = (
                f"Front ultrasonic sensor detected a possible collision risk. "
                f"Risk level: {front_risk}. "
            )
        else:
            priority = 'Medium'
            title = 'Monitoring Warning'
            message = (
                f"Continuous monitoring required for this bus. "
                f"Front proximity risk level: {front_risk}. "
            )

        # Append PIR/LDR context if relevant
        extras = []
        if str(pir_detected or '').strip() == 'Detected':
            extras.append("motion detected by PIR sensor")
        if str(ldr_detected or '').strip() == 'Detected':
            extras.append("headlight/LDR alert active")
        if extras:
            message += "Additional: " + ", ".join(extras) + "."

        return title, message, priority

    # ==========================================================================
    # U-TURN SENSOR PIPELINE
    # ==========================================================================

    def process_uturn_sensor_data(self, data: dict) -> dict:
        """
        Full pipeline:
          Validate → sensor_data → roadside_alert → notification → recipients → Socket.IO

        Returns a summary dict with inserted IDs.
        """
        # ---- Validate IDs ----
        device_id_raw = data.get('device_id')
        roadside_unit_id_raw = data.get('roadside_unit_id')

        if not device_id_raw:
            raise HardwareSensorServiceError(
                "device_id is required.",
                status_code=400,
                errors={"device_id": "This field is required."}
            )
        if not roadside_unit_id_raw:
            raise HardwareSensorServiceError(
                "roadside_unit_id is required.",
                status_code=400,
                errors={"roadside_unit_id": "This field is required."}
            )

        try:
            device_id = int(device_id_raw)
        except (ValueError, TypeError):
            raise HardwareSensorServiceError(
                "device_id must be an integer.",
                status_code=400,
                errors={"device_id": "Must be an integer."}
            )

        try:
            roadside_unit_id = int(roadside_unit_id_raw)
        except (ValueError, TypeError):
            raise HardwareSensorServiceError(
                "roadside_unit_id must be an integer.",
                status_code=400,
                errors={"roadside_unit_id": "Must be an integer."}
            )

        self._validate_device_id(device_id)
        unit = self._validate_roadside_unit_id(roadside_unit_id)

        # ---- Validate risk levels ----
        left_risk = str(data.get('left_risk_level', '') or '').strip()
        right_risk = str(data.get('right_risk_level', '') or '').strip()
        if left_risk:
            self._validate_risk_level(left_risk, 'left_risk_level')
        if right_risk:
            self._validate_risk_level(right_risk, 'right_risk_level')

        # ---- Parse timestamp ----
        device_timestamp = None
        raw_ts = data.get('device_timestamp')
        if raw_ts:
            try:
                device_timestamp = datetime.strptime(str(raw_ts), '%Y-%m-%d %H:%M:%S')
            except ValueError:
                pass
        if not device_timestamp:
            device_timestamp = datetime.now(timezone.utc)

        # ---- Convert booleans to int (SmallInteger in model) ----
        def to_tinyint(val):
            if val is None:
                return None
            return 1 if val else 0

        try:
            # =========================================================
            # STEP 0 — Query previous sensor_data reading for deduplication
            # =========================================================
            # Find the immediately previous sensor_data record for the SAME device_id and roadside_unit_id
            prev_sensor = self.sensor_data_repo.get_latest_uturn_reading(
                device_id=device_id,
                roadside_unit_id=roadside_unit_id
            )

            # =========================================================
            # STEP 1 — Insert sensor_data (telemetry storage is preserved)
            # =========================================================
            sensor = SensorDataModel(
                device_id=device_id,
                bus_id=None,
                roadside_unit_id=roadside_unit_id,
                left_distance_cm=data.get('left_distance_cm'),
                left_risk_percentage=data.get('left_risk_percentage'),
                left_risk_level=left_risk or None,
                left_led_status=to_tinyint(data.get('left_led_status')),
                left_detection_status=data.get('left_detection_status'),
                right_distance_cm=data.get('right_distance_cm'),
                right_risk_percentage=data.get('right_risk_percentage'),
                right_risk_level=right_risk or None,
                right_led_status=to_tinyint(data.get('right_led_status')),
                right_detection_status=data.get('right_detection_status'),
                device_timestamp=device_timestamp
            )
            db.session.add(sensor)
            db.session.flush()  # get sensor_data_id before commit

            sensor_data_id = sensor.sensor_data_id

            # =========================================================
            # STEP 2 — Event-based alert deduplication logic
            # =========================================================
            # Determine currentDanger:
            # (left_risk_level is Medium/High OR right_risk_level is Medium/High)
            current_danger = self._is_danger_level(left_risk) or self._is_danger_level(right_risk)

            # Determine previousDanger from previous sensor_data record:
            # (previous left_risk_level is Medium/High OR previous right_risk_level is Medium/High)
            # If there is no previous record (first-ever reading), treat previousDanger as false.
            if prev_sensor is None:
                previous_danger = False
            else:
                previous_danger = (
                    self._is_danger_level(prev_sensor.left_risk_level) or
                    self._is_danger_level(prev_sensor.right_risk_level)
                )

            # Create a new roadside alert ONLY when:
            # previousDanger == false AND currentDanger == true (SAFE → DANGER)
            is_new_detection_event = (not previous_danger) and current_danger

            alert_id = None
            notification_id = None
            recipients_created = 0

            if is_new_detection_event:
                logger.info(
                    "U-Turn detection event triggered (SAFE -> DANGER): device_id=%s, roadside_unit_id=%s",
                    device_id, roadside_unit_id
                )
                # Fetch route_id from roadside_unit
                route_id = unit.route_id

                alert = RoadsideAlertModel(
                    roadside_unit_id=roadside_unit_id,
                    device_id=device_id,
                    route_id=route_id,
                    sensor_data_id=sensor_data_id,
                    alert_time=datetime.now(timezone.utc)
                )
                db.session.add(alert)
                db.session.flush()
                alert_id = alert.roadside_alert_id

                # =====================================================
                # STEP 3 — Notification
                # =====================================================
                title, message, priority = self._build_uturn_notification(left_risk, right_risk)

                notification = NotificationModel(
                    title=title,
                    message=message,
                    priority=priority,
                    roadside_alert_id=alert_id,
                    bus_alert_id=None
                )
                db.session.add(notification)
                db.session.flush()
                notification_id = notification.notification_id

                # =====================================================
                # STEP 4 — Notification recipients (all officers)
                # =====================================================
                recipients_created = self._create_notification_recipients(notification_id)
            elif previous_danger and current_danger:
                logger.debug(
                    "U-Turn continuous danger reading suppressed for alert generation (DANGER -> DANGER): device_id=%s, roadside_unit_id=%s",
                    device_id, roadside_unit_id
                )
            elif previous_danger and not current_danger:
                logger.info(
                    "U-Turn danger cleared, returned to safe state (DANGER -> SAFE): device_id=%s, roadside_unit_id=%s",
                    device_id, roadside_unit_id
                )

            # =========================================================
            # COMMIT — all or nothing for this pipeline
            # =========================================================
            db.session.commit()

            # =========================================================
            # STEP 5 — Socket.IO (after commit, never roll back for this)
            # =========================================================

            # --- 5a: Emit new_notification to police notification bell ---
            if notification_id:
                # Re-fetch the notification to get accurate created_at
                notif_obj = db.session.query(NotificationModel).filter(
                    NotificationModel.notification_id == notification_id
                ).first()
                if notif_obj:
                    self._emit_notification(notif_obj)

            # --- 5b: Emit roadside_alert_created for U-Turn Alerts page ---
            if alert_id:
                try:
                    alert_obj = db.session.query(RoadsideAlertModel).filter(
                        RoadsideAlertModel.roadside_alert_id == alert_id
                    ).first()
                    notif_ref = db.session.query(NotificationModel).filter(
                        NotificationModel.roadside_alert_id == alert_id
                    ).first()
                    # Fetch location name from the roadside unit
                    loc_name = unit.location_name if unit and hasattr(unit, 'location_name') else None

                    alert_payload = {
                        # Identification
                        'roadsideAlertId': alert_id,
                        'id': alert_id,
                        # Foreign keys (all columns shown by UTurnAlertTable)
                        'roadsideUnitId': roadside_unit_id,
                        'deviceId': device_id,
                        'routeId': alert_obj.route_id if alert_obj else (unit.route_id if unit else None),
                        'sensorDataId': sensor_data_id,
                        # Time
                        'alertTime': alert_obj.alert_time.strftime('%Y-%m-%d %H:%M:%S') if alert_obj and alert_obj.alert_time else None,
                        # Location
                        'locationName': loc_name or '—',
                        # Notification fields
                        'notificationId': notification_id,
                        'notificationTitle': notif_ref.title if notif_ref else 'U-Turn Alert',
                        'priority': notif_ref.priority if notif_ref else 'Medium',
                        'message': notif_ref.message if notif_ref else 'U-Turn detected by roadside sensor.',
                    }
                    self.ws.emit_roadside_alert_created(alert_payload)

                    # --- 5c: Emit updated summary stats for KPI cards ---
                    try:
                        summary = self.roadside_alert_repo.get_summary()
                        self.ws.emit_roadside_alert_summary_updated(summary)
                    except Exception:
                        pass

                except Exception as e:
                    logger.warning("Socket.IO roadside_alert_created emit failed: %s", str(e))

            # --- 5d: Always emit uturn_sensor_update for real-time dashboard card ---
            try:
                def fmt(val):
                    return str(val) if val is not None else '—'

                sensor_update_payload = {
                    'deviceId': device_id,
                    'roadsideUnitId': roadside_unit_id,
                    'leftSensor': {
                        'status': data.get('left_detection_status', 'SAFE'),
                        'ledStatus': 'ON' if data.get('left_led_status') else 'OFF',
                        'distance': fmt(data.get('left_distance_cm')),
                        'riskPercentage': f"{data.get('left_risk_percentage', 0)}%",
                        'riskLevel': (data.get('left_risk_level') or 'LOW').upper(),
                    },
                    'rightSensor': {
                        'status': data.get('right_detection_status', 'SAFE'),
                        'ledStatus': 'ON' if data.get('right_led_status') else 'OFF',
                        'distance': fmt(data.get('right_distance_cm')),
                        'riskPercentage': f"{data.get('right_risk_percentage', 0)}%",
                        'riskLevel': (data.get('right_risk_level') or 'LOW').upper(),
                    },
                    'timestamp': datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S'),
                    'alertGenerated': is_new_detection_event,
                }
                self.ws.emit_uturn_sensor_update(sensor_update_payload)
            except Exception as e:
                logger.warning("Socket.IO uturn_sensor_update emit failed: %s", str(e))

            return {
                'sensor_data_id': sensor_data_id,
                'alert_id': alert_id,
                'notification_id': notification_id,
                'recipients_created': recipients_created,
                'alert_generated': is_new_detection_event,
                'device_id': device_id,
                'roadside_unit_id': roadside_unit_id
            }

        except HardwareSensorServiceError:
            db.session.rollback()
            raise
        except SQLAlchemyError as e:
            db.session.rollback()
            raise HardwareSensorServiceError(
                f"Database error during U-Turn sensor processing: {str(e)}",
                status_code=500
            )
        except Exception as e:
            db.session.rollback()
            raise HardwareSensorServiceError(
                f"Unexpected error processing U-Turn sensor data: {str(e)}",
                status_code=500
            )

    # ==========================================================================
    # BUS SENSOR PIPELINE
    # ==========================================================================

    def process_bus_sensor_data(self, data: dict) -> dict:
        """
        Full pipeline:
          Validate → sensor_data → bus_alert → notification → recipients → Socket.IO

        Returns a summary dict with inserted IDs.
        """
        # ---- Validate IDs ----
        device_id_raw = data.get('device_id')
        bus_id_raw = data.get('bus_id')

        if not device_id_raw:
            raise HardwareSensorServiceError(
                "device_id is required.",
                status_code=400,
                errors={"device_id": "This field is required."}
            )
        if not bus_id_raw:
            raise HardwareSensorServiceError(
                "bus_id is required.",
                status_code=400,
                errors={"bus_id": "This field is required."}
            )

        try:
            device_id = int(device_id_raw)
        except (ValueError, TypeError):
            raise HardwareSensorServiceError(
                "device_id must be an integer.",
                status_code=400,
                errors={"device_id": "Must be an integer."}
            )

        try:
            bus_id = int(bus_id_raw)
        except (ValueError, TypeError):
            raise HardwareSensorServiceError(
                "bus_id must be an integer.",
                status_code=400,
                errors={"bus_id": "Must be an integer."}
            )

        self._validate_device_id(device_id)
        self._validate_bus_id(bus_id)

        # ---- Validate front_risk_level ----
        front_risk = str(data.get('front_risk_level', '') or '').strip()
        if front_risk:
            self._validate_risk_level(front_risk, 'front_risk_level')

        # ---- Parse timestamp ----
        device_timestamp = None
        raw_ts = data.get('device_timestamp')
        if raw_ts:
            try:
                device_timestamp = datetime.strptime(str(raw_ts), '%Y-%m-%d %H:%M:%S')
            except ValueError:
                pass
        if not device_timestamp:
            device_timestamp = datetime.now(timezone.utc)

        # ---- Convert booleans to int (SmallInteger in model) ----
        def to_tinyint(val):
            if val is None:
                return None
            return 1 if val else 0

        try:
            # =========================================================
            # STEP 1 — Insert sensor_data
            # =========================================================
            sensor = SensorDataModel(
                device_id=device_id,
                bus_id=bus_id,
                roadside_unit_id=None,
                pir_detection_status=data.get('pir_detection_status'),
                pir_buzzer_status=to_tinyint(data.get('pir_buzzer_status')),
                ldr_detection_status=data.get('ldr_detection_status'),
                ldr_led_status=to_tinyint(data.get('ldr_led_status')),
                front_distance_cm=data.get('front_distance_cm'),
                front_risk_percentage=data.get('front_risk_percentage'),
                front_risk_level=front_risk or None,
                front_led_status=to_tinyint(data.get('front_led_status')),
                front_detection_status=data.get('front_detection_status'),
                device_timestamp=device_timestamp
            )
            db.session.add(sensor)
            db.session.flush()

            sensor_data_id = sensor.sensor_data_id

            # =========================================================
            # STEP 2 — Alert generation (only if Medium or High risk)
            # =========================================================
            alert_id = None
            notification_id = None
            recipients_created = 0

            needs_alert = front_risk in ALERT_RISK_LEVELS

            if needs_alert:
                # Fetch latest Active assignment for this bus
                assignment = db.session.query(BusAssignmentModel).filter(
                    BusAssignmentModel.bus_id == bus_id,
                    BusAssignmentModel.status == 'Active'
                ).order_by(BusAssignmentModel.assignment_id.desc()).first()

                assignment_id = assignment.assignment_id if assignment else None

                bus_alert = BusAlertModel(
                    bus_id=bus_id,
                    device_id=device_id,
                    assignment_id=assignment_id,
                    sensor_data_id=sensor_data_id,
                    alert_time=datetime.now(timezone.utc)
                )
                db.session.add(bus_alert)
                db.session.flush()
                alert_id = bus_alert.bus_alert_id

                # =====================================================
                # STEP 3 — Notification
                # =====================================================
                pir_status = data.get('pir_detection_status')
                ldr_status = data.get('ldr_detection_status')
                title, message, priority = self._build_bus_notification(
                    front_risk, pir_status, ldr_status
                )

                notification = NotificationModel(
                    title=title,
                    message=message,
                    priority=priority,
                    bus_alert_id=alert_id,
                    roadside_alert_id=None
                )
                db.session.add(notification)
                db.session.flush()
                notification_id = notification.notification_id

                # =====================================================
                # STEP 4 — Notification recipients (all officers)
                # =====================================================
                recipients_created = self._create_notification_recipients(notification_id)

            # =========================================================
            # COMMIT
            # =========================================================
            db.session.commit()

            # =========================================================
            # STEP 5 — Socket.IO (after commit)
            # =========================================================
            if notification_id:
                notif_obj = db.session.query(NotificationModel).filter(
                    NotificationModel.notification_id == notification_id
                ).first()
                if notif_obj:
                    self._emit_notification(notif_obj)

            return {
                'sensor_data_id': sensor_data_id,
                'alert_id': alert_id,
                'notification_id': notification_id,
                'recipients_created': recipients_created,
                'alert_generated': needs_alert,
                'device_id': device_id,
                'bus_id': bus_id
            }

        except HardwareSensorServiceError:
            db.session.rollback()
            raise
        except SQLAlchemyError as e:
            db.session.rollback()
            raise HardwareSensorServiceError(
                f"Database error during Bus sensor processing: {str(e)}",
                status_code=500
            )
        except Exception as e:
            db.session.rollback()
            raise HardwareSensorServiceError(
                f"Unexpected error processing Bus sensor data: {str(e)}",
                status_code=500
            )

    # ==========================================================================
    # NOTIFICATIONS FETCH (for police officer bell)
    # ==========================================================================

    def get_officer_notifications(self, officer_id: int, limit: int = 10) -> list:
        """
        Return recent notifications where the given officer is a recipient.
        Joins: notification_recipients → notifications.
        """
        try:
            rows = db.session.query(NotificationModel).join(
                NotificationRecipientModel,
                NotificationRecipientModel.notification_id == NotificationModel.notification_id
            ).filter(
                NotificationRecipientModel.officer_id == officer_id
            ).order_by(
                NotificationModel.created_at.desc(),
                NotificationModel.notification_id.desc()
            ).limit(limit).all()

            results = []
            for notif in rows:
                created_str = None
                if notif.created_at:
                    created_str = notif.created_at.strftime('%Y-%m-%d %H:%M:%S')
                results.append({
                    'notification_id': notif.notification_id,
                    'title': notif.title,
                    'message': notif.message,
                    'priority': notif.priority,
                    'created_at': created_str,
                    'bus_alert_id': notif.bus_alert_id,
                    'roadside_alert_id': notif.roadside_alert_id
                })
            return results
        except SQLAlchemyError as e:
            raise HardwareSensorServiceError(
                f"Failed to fetch officer notifications: {str(e)}",
                status_code=500
            )
