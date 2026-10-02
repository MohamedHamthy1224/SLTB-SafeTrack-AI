"""
Comprehensive U-Turn Alert Flooding & Deduplication Test Suite
=============================================================
Tests all required event-based detection scenarios (A through J),
telemetry preservation, recipient deduplication, and backend restart recovery.

Scenarios tested:
  A. Low → Low                                (0 alerts)
  B. Low → High                               (1 alert)
  C. High → High                              (still 1 alert)
  D. High → High → High                       (still 1 alert)
  E. High → Low → High                        (2 alerts)
  F. Low → Medium → Medium                    (1 alert)
  G. Medium → High                            (still 1 alert)
  H. High left + High right                   (1 alert)
  I. Same request repeated many times (20x)   (1 alert for continuous event)
  J. Backend restart followed by High         (no duplicate alert for continuous event)
"""

import sys
import os
import unittest
from unittest.mock import MagicMock

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app import create_app
from app.data.database import db
from app.data.models.sensor_data_model import SensorDataModel
from app.data.models.roadside_alert_model import RoadsideAlertModel
from app.data.models.notification_model import NotificationModel
from app.data.models.notification_recipient_model import NotificationRecipientModel
from app.business.services.hardware_sensor_service import HardwareSensorService
from app.data.repositories.sensor_data_repository import SensorDataRepository


class UTurnAlertDeduplicationTestCase(unittest.TestCase):

    def setUp(self):
        self.app = create_app('development')
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()

        # Device and unit configured for test
        self.device_id = 2
        self.roadside_unit_id = 1

        # Reset state to SAFE (Low / Low) before each test to guarantee deterministic state
        self._send_reading(left_risk='Low', right_risk='Low')

    def tearDown(self):
        self.app_context.pop()

    def _send_reading(self, left_risk='Low', right_risk='Low', left_dist=50.0, right_dist=50.0):
        """Helper to post reading through the API endpoint."""
        payload = {
            'device_id': self.device_id,
            'roadside_unit_id': self.roadside_unit_id,
            'left_distance_cm': left_dist,
            'left_risk_percentage': 85 if left_risk == 'High' else (50 if left_risk == 'Medium' else 10),
            'left_risk_level': left_risk,
            'left_led_status': left_risk in ('Medium', 'High'),
            'left_detection_status': 'Detected' if left_risk in ('Medium', 'High') else 'Safe',
            'right_distance_cm': right_dist,
            'right_risk_percentage': 85 if right_risk == 'High' else (50 if right_risk == 'Medium' else 10),
            'right_risk_level': right_risk,
            'right_led_status': right_risk in ('Medium', 'High'),
            'right_detection_status': 'Detected' if right_risk in ('Medium', 'High') else 'Safe',
        }
        res = self.client.post('/api/v1/hardware/uturn-sensor-data', json=payload)
        self.assertEqual(res.status_code, 201)
        return res.get_json()['data']

    # ------------------------------------------------------------------
    # TEST A: Low → Low => 0 alerts
    # ------------------------------------------------------------------
    def test_scenario_A_low_to_low(self):
        """Scenario A: Safe condition followed by safe condition produces 0 alerts."""
        r1 = self._send_reading(left_risk='Low', right_risk='Low')
        self.assertFalse(r1['alert_generated'])
        self.assertIsNone(r1['alert_id'])
        self.assertIsNone(r1['notification_id'])

        r2 = self._send_reading(left_risk='Low', right_risk='Low')
        self.assertFalse(r2['alert_generated'])
        self.assertIsNone(r2['alert_id'])
        self.assertIsNone(r2['notification_id'])

    # ------------------------------------------------------------------
    # TEST B: Low → High => 1 alert
    # ------------------------------------------------------------------
    def test_scenario_B_low_to_high(self):
        """Scenario B: Safe to High transition triggers exactly 1 alert."""
        r1 = self._send_reading(left_risk='Low', right_risk='Low')
        self.assertFalse(r1['alert_generated'])

        r2 = self._send_reading(left_risk='High', right_risk='Low')
        self.assertTrue(r2['alert_generated'])
        self.assertIsNotNone(r2['alert_id'])
        self.assertIsNotNone(r2['notification_id'])
        self.assertGreater(r2['recipients_created'], 0)

    # ------------------------------------------------------------------
    # TEST C: High → High => still 1 alert
    # ------------------------------------------------------------------
    def test_scenario_C_high_to_high(self):
        """Scenario C: Continuous High reading does not generate a second alert."""
        r1 = self._send_reading(left_risk='High', right_risk='Low')
        self.assertTrue(r1['alert_generated'])
        alert_id_1 = r1['alert_id']

        r2 = self._send_reading(left_risk='High', right_risk='Low')
        self.assertFalse(r2['alert_generated'])
        self.assertIsNone(r2['alert_id'])
        self.assertIsNone(r2['notification_id'])
        self.assertEqual(r2['recipients_created'], 0)

    # ------------------------------------------------------------------
    # TEST D: High → High → High => still 1 alert
    # ------------------------------------------------------------------
    def test_scenario_D_high_high_high(self):
        """Scenario D: 3 consecutive High readings produce only 1 alert."""
        r1 = self._send_reading(left_risk='High', right_risk='Low')
        self.assertTrue(r1['alert_generated'])

        r2 = self._send_reading(left_risk='High', right_risk='Low')
        self.assertFalse(r2['alert_generated'])

        r3 = self._send_reading(left_risk='High', right_risk='Low')
        self.assertFalse(r3['alert_generated'])

    # ------------------------------------------------------------------
    # TEST E: High → Low → High => 2 alerts
    # ------------------------------------------------------------------
    def test_scenario_E_high_low_high(self):
        """Scenario E: Danger clears (Safe) and new Danger triggers a 2nd alert."""
        r1 = self._send_reading(left_risk='High', right_risk='Low')
        self.assertTrue(r1['alert_generated'])
        alert_id_1 = r1['alert_id']

        # Clear to safe
        r2 = self._send_reading(left_risk='Low', right_risk='Low')
        self.assertFalse(r2['alert_generated'])
        self.assertIsNone(r2['alert_id'])

        # New danger event
        r3 = self._send_reading(left_risk='High', right_risk='Low')
        self.assertTrue(r3['alert_generated'])
        alert_id_2 = r3['alert_id']

        self.assertNotEqual(alert_id_1, alert_id_2)

    # ------------------------------------------------------------------
    # TEST F: Low → Medium → Medium => 1 alert
    # ------------------------------------------------------------------
    def test_scenario_F_low_medium_medium(self):
        """Scenario F: Low to Medium triggers 1 alert; second Medium triggers 0."""
        r1 = self._send_reading(left_risk='Medium', right_risk='Low')
        self.assertTrue(r1['alert_generated'])

        r2 = self._send_reading(left_risk='Medium', right_risk='Low')
        self.assertFalse(r2['alert_generated'])

    # ------------------------------------------------------------------
    # TEST G: Medium → High => still 1 alert (continuous event)
    # ------------------------------------------------------------------
    def test_scenario_G_medium_to_high(self):
        """Scenario G: Medium to High within same continuous event does not duplicate alert."""
        r1 = self._send_reading(left_risk='Medium', right_risk='Low')
        self.assertTrue(r1['alert_generated'])

        r2 = self._send_reading(left_risk='High', right_risk='Low')
        self.assertFalse(r2['alert_generated'])

    # ------------------------------------------------------------------
    # TEST H: High left + High right => exactly 1 alert
    # ------------------------------------------------------------------
    def test_scenario_H_both_sides_high(self):
        """Scenario H: Both sides High during same detection event triggers exactly 1 alert."""
        r1 = self._send_reading(left_risk='High', right_risk='High')
        self.assertTrue(r1['alert_generated'])
        self.assertIsNotNone(r1['alert_id'])
        self.assertIsNotNone(r1['notification_id'])

        # Notification message should mention both approaches
        notif = db.session.query(NotificationModel).filter_by(
            notification_id=r1['notification_id']
        ).first()
        self.assertIsNotNone(notif)
        self.assertIn('both left and right', notif.message.lower())
        self.assertEqual(notif.priority, 'High')

    # ------------------------------------------------------------------
    # TEST I: Repeated readings (20x) => exactly 1 alert, 20 sensor_data rows
    # ------------------------------------------------------------------
    def test_scenario_I_continuous_flooding_prevention(self):
        """Scenario I: 20 continuous High readings store 20 sensor rows but ONLY 1 alert."""
        count_sd_before = db.session.query(SensorDataModel).filter_by(
            device_id=self.device_id, roadside_unit_id=self.roadside_unit_id
        ).count()
        count_alerts_before = db.session.query(RoadsideAlertModel).filter_by(
            device_id=self.device_id, roadside_unit_id=self.roadside_unit_id
        ).count()

        alerts_generated = 0
        for _ in range(20):
            res = self._send_reading(left_risk='High', right_risk='Low')
            if res['alert_generated']:
                alerts_generated += 1

        count_sd_after = db.session.query(SensorDataModel).filter_by(
            device_id=self.device_id, roadside_unit_id=self.roadside_unit_id
        ).count()
        count_alerts_after = db.session.query(RoadsideAlertModel).filter_by(
            device_id=self.device_id, roadside_unit_id=self.roadside_unit_id
        ).count()

        # Exactly 1 new alert created out of 20 continuous danger readings
        self.assertEqual(alerts_generated, 1)
        self.assertEqual(count_alerts_after - count_alerts_before, 1)

        # All 20 sensor_data telemetry rows MUST be stored
        self.assertEqual(count_sd_after - count_sd_before, 20)

    # ------------------------------------------------------------------
    # TEST J: Backend restart recovery from database state
    # ------------------------------------------------------------------
    def test_scenario_J_backend_restart_recovery(self):
        """
        Scenario J: After backend restart (fresh service instance with zero in-memory state),
        continued High readings do not duplicate alerts because state is recovered from DB.
        """
        mock_ws = MagicMock()
        service1 = HardwareSensorService(websocket_service=mock_ws)

        # Reading 1: High -> generates alert
        r1 = service1.process_uturn_sensor_data({
            'device_id': self.device_id,
            'roadside_unit_id': self.roadside_unit_id,
            'left_risk_level': 'High',
            'right_risk_level': 'Low'
        })
        self.assertTrue(r1['alert_generated'])
        self.assertIsNotNone(r1['alert_id'])
        self.assertEqual(mock_ws.emit_new_notification.call_count, 1)

        # SIMULATE BACKEND RESTART:
        # Create brand-new service instance with independent state
        mock_ws2 = MagicMock()
        service2 = HardwareSensorService(websocket_service=mock_ws2)

        # Reading 2: Continued High after restart -> MUST NOT generate alert
        r2 = service2.process_uturn_sensor_data({
            'device_id': self.device_id,
            'roadside_unit_id': self.roadside_unit_id,
            'left_risk_level': 'High',
            'right_risk_level': 'Low'
        })
        self.assertFalse(r2['alert_generated'])
        self.assertIsNone(r2['alert_id'])
        self.assertIsNone(r2['notification_id'])
        self.assertEqual(mock_ws2.emit_new_notification.call_count, 0)

        # Reading 3: Continued High -> still no alert
        r3 = service2.process_uturn_sensor_data({
            'device_id': self.device_id,
            'roadside_unit_id': self.roadside_unit_id,
            'left_risk_level': 'High',
            'right_risk_level': 'Low'
        })
        self.assertFalse(r3['alert_generated'])
        self.assertEqual(mock_ws2.emit_new_notification.call_count, 0)

    # ------------------------------------------------------------------
    # TEST: Left / Right Danger Transfer (Left High -> Right High)
    # ------------------------------------------------------------------
    def test_left_to_right_danger_transfer(self):
        """Transfer of danger from left side to right side in same event triggers 1 alert total."""
        # 1. Left High, Right Low -> 1 alert
        r1 = self._send_reading(left_risk='High', right_risk='Low')
        self.assertTrue(r1['alert_generated'])

        # 2. Left Low, Right High -> still dangerous, NO new alert
        r2 = self._send_reading(left_risk='Low', right_risk='High')
        self.assertFalse(r2['alert_generated'])

        # 3. Left Low, Right Low -> Clear
        r3 = self._send_reading(left_risk='Low', right_risk='Low')
        self.assertFalse(r3['alert_generated'])

        # 4. Right High, Left Low -> NEW alert after recovery
        r4 = self._send_reading(left_risk='Low', right_risk='High')
        self.assertTrue(r4['alert_generated'])

    # ------------------------------------------------------------------
    # TEST: Socket.IO emission behavior
    # ------------------------------------------------------------------
    def test_socketio_emissions_on_deduplication(self):
        """Socket.IO emit_new_notification is called ONLY for new events; telemetry emitted for all."""
        mock_ws = MagicMock()
        service = HardwareSensorService(websocket_service=mock_ws)

        # Event 1: First High -> new alert
        service.process_uturn_sensor_data({
            'device_id': self.device_id,
            'roadside_unit_id': self.roadside_unit_id,
            'left_risk_level': 'High',
            'right_risk_level': 'Low'
        })
        self.assertEqual(mock_ws.emit_new_notification.call_count, 1)
        self.assertEqual(mock_ws.emit_roadside_alert_created.call_count, 1)
        self.assertEqual(mock_ws.emit_uturn_sensor_update.call_count, 1)

        # Event 2: Repeat High -> duplicate danger, suppressed alert
        service.process_uturn_sensor_data({
            'device_id': self.device_id,
            'roadside_unit_id': self.roadside_unit_id,
            'left_risk_level': 'High',
            'right_risk_level': 'Low'
        })
        # Notification and alert_created MUST NOT be emitted again
        self.assertEqual(mock_ws.emit_new_notification.call_count, 1)
        self.assertEqual(mock_ws.emit_roadside_alert_created.call_count, 1)
        # Telemetry MUST be emitted
        self.assertEqual(mock_ws.emit_uturn_sensor_update.call_count, 2)


if __name__ == '__main__':
    unittest.main()
