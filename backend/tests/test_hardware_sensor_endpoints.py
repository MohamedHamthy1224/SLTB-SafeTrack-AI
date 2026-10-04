import sys
import os
import unittest
import json

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app import create_app


class HardwareSensorEndpointsTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app('development')
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()

    def tearDown(self):
        self.app_context.pop()

    def test_01_uturn_missing_payload(self):
        """Test sending empty or invalid body."""
        res = self.client.post('/api/v1/hardware/uturn-sensor-data', json={})
        self.assertIn(res.status_code, [400, 422])

    def test_02_uturn_validation_errors(self):
        """Test missing device_id or roadside_unit_id."""
        res = self.client.post('/api/v1/hardware/uturn-sensor-data', json={'roadside_unit_id': 1})
        self.assertEqual(res.status_code, 400)
        res_data = res.get_json()
        self.assertFalse(res_data['success'])

        res2 = self.client.post('/api/v1/hardware/uturn-sensor-data', json={'device_id': 2})
        self.assertEqual(res2.status_code, 400)

    def test_03_uturn_sensor_data_ingestion_with_alert(self):
        """Test valid U-turn sensor data ingestion triggering alert & notification."""
        # Ensure baseline state is SAFE before testing SAFE -> HIGH transition
        self.client.post('/api/v1/hardware/uturn-sensor-data', json={
            'device_id': 2,
            'roadside_unit_id': 1,
            'left_risk_level': 'Low',
            'right_risk_level': 'Low',
            'left_detection_status': 'Safe',
            'right_detection_status': 'Safe'
        })

        payload = {
            'device_id': 2,
            'roadside_unit_id': 1,
            'left_distance_cm': 32.4,
            'left_risk_percentage': 75,
            'left_risk_level': 'High',
            'left_led_status': True,
            'left_detection_status': 'Detected',
            'right_distance_cm': 85.0,
            'right_risk_percentage': 15,
            'right_risk_level': 'Low',
            'right_led_status': False,
            'right_detection_status': 'Safe'
        }
        res = self.client.post('/api/v1/hardware/uturn-sensor-data', json=payload)
        self.assertEqual(res.status_code, 201)
        data = res.get_json()['data']
        self.assertTrue(data['alert_generated'])
        self.assertIsNotNone(data['alert_id'])
        self.assertIsNotNone(data['notification_id'])
        self.assertGreater(data['recipients_created'], 0)

    def test_04_uturn_sensor_data_ingestion_low_risk(self):
        """Test Low risk sensor data does not create alert or notifications."""
        payload = {
            'device_id': 2,
            'roadside_unit_id': 1,
            'left_distance_cm': 95.0,
            'left_risk_percentage': 5,
            'left_risk_level': 'Low',
            'left_led_status': False,
            'left_detection_status': 'Safe',
            'right_distance_cm': 110.0,
            'right_risk_percentage': 5,
            'right_risk_level': 'Low',
            'right_led_status': False,
            'right_detection_status': 'Safe'
        }
        res = self.client.post('/api/v1/hardware/uturn-sensor-data', json=payload)
        self.assertEqual(res.status_code, 201)
        data = res.get_json()['data']
        self.assertFalse(data['alert_generated'])
        self.assertIsNone(data['alert_id'])
        self.assertIsNone(data['notification_id'])
        self.assertEqual(data['recipients_created'], 0)

    def test_05_bus_sensor_data_ingestion_with_alert(self):
        """Test valid bus sensor data ingestion with High risk alert."""
        payload = {
            'device_id': 1,
            'bus_id': 1,
            'pir_detection_status': 'Detected',
            'pir_buzzer_status': True,
            'ldr_detection_status': 'Safe',
            'ldr_led_status': False,
            'front_distance_cm': 12.0,
            'front_risk_percentage': 95,
            'front_risk_level': 'High',
            'front_led_status': True,
            'front_detection_status': 'Detected'
        }
        res = self.client.post('/api/v1/hardware/bus-sensor-data', json=payload)
        self.assertEqual(res.status_code, 201)
        data = res.get_json()['data']
        self.assertTrue(data['alert_generated'])
        self.assertIsNotNone(data['alert_id'])
        self.assertIsNotNone(data['notification_id'])
        self.assertGreater(data['recipients_created'], 0)

    def test_06_bus_sensor_data_ingestion_low_risk(self):
        """Test valid bus sensor data ingestion with Low risk (no alert)."""
        payload = {
            'device_id': 1,
            'bus_id': 1,
            'pir_detection_status': 'Safe',
            'pir_buzzer_status': False,
            'ldr_detection_status': 'Safe',
            'ldr_led_status': False,
            'front_distance_cm': 85.0,
            'front_risk_percentage': 10,
            'front_risk_level': 'Low',
            'front_led_status': False,
            'front_detection_status': 'Safe'
        }
        res = self.client.post('/api/v1/hardware/bus-sensor-data', json=payload)
        self.assertEqual(res.status_code, 201)
        data = res.get_json()['data']
        self.assertFalse(data['alert_generated'])
        self.assertIsNone(data['alert_id'])
        self.assertIsNone(data['notification_id'])
        self.assertEqual(data['recipients_created'], 0)

    def test_07_police_notifications_unauthorized(self):
        """Test getting notifications without JWT returns 401."""
        res = self.client.get('/api/v1/police/notifications')
        self.assertEqual(res.status_code, 401)

    def test_08_dedup_safe_to_high_and_repeated_ten_high(self):
        """
        Acceptance Test A & B & I & J:
        - Reset to SAFE.
        - Send SAFE -> HIGH: Exactly 1 sensor row, 1 alert, 1 notification.
        - Send HIGH -> HIGH repeated 10 times:
          sensor_data increases by 10, but roadside_alerts and notifications do NOT increase.
        """
        from app.data.database import db
        from app.data.models.sensor_data_model import SensorDataModel
        from app.data.models.roadside_alert_model import RoadsideAlertModel
        from app.data.models.notification_model import NotificationModel

        device_id = 2
        roadside_unit_id = 1

        # 1. Reset state to SAFE
        safe_payload = {
            'device_id': device_id,
            'roadside_unit_id': roadside_unit_id,
            'left_risk_level': 'Low',
            'right_risk_level': 'Low',
            'left_detection_status': 'Safe',
            'right_detection_status': 'Safe'
        }
        res_safe = self.client.post('/api/v1/hardware/uturn-sensor-data', json=safe_payload)
        self.assertEqual(res_safe.status_code, 201)
        self.assertFalse(res_safe.get_json()['data']['alert_generated'])

        # Snapshot baseline DB counts
        initial_sensor_count = db.session.query(SensorDataModel).count()
        initial_alert_count = db.session.query(RoadsideAlertModel).count()
        initial_notif_count = db.session.query(NotificationModel).count()

        # 2. Acceptance Test A: SAFE -> HIGH
        high_payload = {
            'device_id': device_id,
            'roadside_unit_id': roadside_unit_id,
            'left_distance_cm': 25.0,
            'left_risk_percentage': 85,
            'left_risk_level': 'High',
            'left_detection_status': 'Detected',
            'right_distance_cm': 90.0,
            'right_risk_percentage': 10,
            'right_risk_level': 'Low',
            'right_detection_status': 'Safe'
        }
        res_high_first = self.client.post('/api/v1/hardware/uturn-sensor-data', json=high_payload)
        self.assertEqual(res_high_first.status_code, 201)
        data_first = res_high_first.get_json()['data']

        self.assertTrue(data_first['alert_generated'])
        self.assertIsNotNone(data_first['alert_id'])
        self.assertIsNotNone(data_first['notification_id'])
        first_alert_id = data_first['alert_id']
        first_notif_id = data_first['notification_id']

        # Verify DB counts after SAFE -> HIGH
        count_after_first_sensor = db.session.query(SensorDataModel).count()
        count_after_first_alert = db.session.query(RoadsideAlertModel).count()
        count_after_first_notif = db.session.query(NotificationModel).count()

        self.assertEqual(count_after_first_sensor, initial_sensor_count + 1)
        self.assertEqual(count_after_first_alert, initial_alert_count + 1)
        self.assertEqual(count_after_first_notif, initial_notif_count + 1)

        # 3. Acceptance Test B: HIGH -> HIGH repeated 10 times
        for i in range(10):
            res_repeat = self.client.post('/api/v1/hardware/uturn-sensor-data', json=high_payload)
            self.assertEqual(res_repeat.status_code, 201)
            repeat_data = res_repeat.get_json()['data']
            self.assertFalse(repeat_data['alert_generated'], f"Iteration {i+1} should suppress alert")
            self.assertIsNone(repeat_data['alert_id'])
            self.assertIsNone(repeat_data['notification_id'])
            self.assertEqual(repeat_data['recipients_created'], 0)

        # Verify DB counts after 10 duplicate HIGH readings:
        final_sensor_count = db.session.query(SensorDataModel).count()
        final_alert_count = db.session.query(RoadsideAlertModel).count()
        final_notif_count = db.session.query(NotificationModel).count()

        # sensor_data increased by 10 (total 1 + 10 = 11 readings since baseline)
        self.assertEqual(final_sensor_count, count_after_first_sensor + 10)
        # roadside_alerts stayed EXACTLY identical (no new alerts created!)
        self.assertEqual(final_alert_count, count_after_first_alert)
        # notifications stayed EXACTLY identical (no new notifications created!)
        self.assertEqual(final_notif_count, count_after_first_notif)

    def test_09_dedup_high_to_medium_and_left_to_right(self):
        """
        Acceptance Test C & G:
        - HIGH -> MEDIUM: continuous danger, no new alert.
        - LEFT HIGH -> RIGHT HIGH: continuous danger, no duplicate alert.
        """
        from app.data.database import db
        from app.data.models.roadside_alert_model import RoadsideAlertModel

        device_id = 2
        roadside_unit_id = 1

        # Reset to SAFE
        self.client.post('/api/v1/hardware/uturn-sensor-data', json={
            'device_id': device_id,
            'roadside_unit_id': roadside_unit_id,
            'left_risk_level': 'Low',
            'right_risk_level': 'Low'
        })

        # SAFE -> HIGH (1 alert)
        res1 = self.client.post('/api/v1/hardware/uturn-sensor-data', json={
            'device_id': device_id,
            'roadside_unit_id': roadside_unit_id,
            'left_risk_level': 'High',
            'right_risk_level': 'Low'
        })
        self.assertTrue(res1.get_json()['data']['alert_generated'])
        alerts_before = db.session.query(RoadsideAlertModel).count()

        # HIGH -> MEDIUM (Acceptance Test C)
        res_med = self.client.post('/api/v1/hardware/uturn-sensor-data', json={
            'device_id': device_id,
            'roadside_unit_id': roadside_unit_id,
            'left_risk_level': 'Medium',
            'right_risk_level': 'Low'
        })
        self.assertFalse(res_med.get_json()['data']['alert_generated'])
        self.assertIsNone(res_med.get_json()['data']['alert_id'])
        self.assertEqual(db.session.query(RoadsideAlertModel).count(), alerts_before)

        # LEFT LOW / RIGHT HIGH (Acceptance Test G: Left High -> Right High)
        res_right = self.client.post('/api/v1/hardware/uturn-sensor-data', json={
            'device_id': device_id,
            'roadside_unit_id': roadside_unit_id,
            'left_risk_level': 'Low',
            'right_risk_level': 'High'
        })
        self.assertFalse(res_right.get_json()['data']['alert_generated'])
        self.assertIsNone(res_right.get_json()['data']['alert_id'])
        self.assertEqual(db.session.query(RoadsideAlertModel).count(), alerts_before)

    def test_10_dedup_high_to_safe_to_high_cycle(self):
        """
        Acceptance Test D, E, F:
        - HIGH -> SAFE: No new alert (resets event state).
        - SAFE -> HIGH again: Exactly 1 new alert.
        - Overall cycle (HIGH -> SAFE -> HIGH) creates exactly 2 total alerts.
        """
        from app.data.database import db
        from app.data.models.roadside_alert_model import RoadsideAlertModel

        device_id = 2
        roadside_unit_id = 1

        # Reset to SAFE
        self.client.post('/api/v1/hardware/uturn-sensor-data', json={
            'device_id': device_id,
            'roadside_unit_id': roadside_unit_id,
            'left_risk_level': 'Low',
            'right_risk_level': 'Low'
        })

        initial_alerts = db.session.query(RoadsideAlertModel).count()

        # Step 1: SAFE -> HIGH (Alert #1)
        r1 = self.client.post('/api/v1/hardware/uturn-sensor-data', json={
            'device_id': device_id,
            'roadside_unit_id': roadside_unit_id,
            'left_risk_level': 'High',
            'right_risk_level': 'Low'
        })
        self.assertTrue(r1.get_json()['data']['alert_generated'])
        self.assertEqual(db.session.query(RoadsideAlertModel).count(), initial_alerts + 1)

        # Step 2: HIGH -> SAFE (Acceptance Test D: no alert)
        r2 = self.client.post('/api/v1/hardware/uturn-sensor-data', json={
            'device_id': device_id,
            'roadside_unit_id': roadside_unit_id,
            'left_risk_level': 'Low',
            'right_risk_level': 'Low'
        })
        self.assertFalse(r2.get_json()['data']['alert_generated'])
        self.assertIsNone(r2.get_json()['data']['alert_id'])
        self.assertEqual(db.session.query(RoadsideAlertModel).count(), initial_alerts + 1)

        # Step 3: SAFE -> HIGH again (Acceptance Test E: exactly 1 new alert)
        r3 = self.client.post('/api/v1/hardware/uturn-sensor-data', json={
            'device_id': device_id,
            'roadside_unit_id': roadside_unit_id,
            'left_risk_level': 'High',
            'right_risk_level': 'Low'
        })
        self.assertTrue(r3.get_json()['data']['alert_generated'])
        self.assertIsNotNone(r3.get_json()['data']['alert_id'])

        # Total alerts generated across cycle is exactly 2 (Acceptance Test F)
        self.assertEqual(db.session.query(RoadsideAlertModel).count(), initial_alerts + 2)

    def test_11_backend_restart_persistence(self):
        """
        Acceptance Test H:
        - When danger is active in DB, a new service instance (simulating backend restart)
          reading the next HIGH reading must NOT create a duplicate alert.
        """
        from app.data.database import db
        from app.data.models.roadside_alert_model import RoadsideAlertModel
        from app.business.services.hardware_sensor_service import HardwareSensorService

        device_id = 2
        roadside_unit_id = 1

        # Reset to SAFE
        self.client.post('/api/v1/hardware/uturn-sensor-data', json={
            'device_id': device_id,
            'roadside_unit_id': roadside_unit_id,
            'left_risk_level': 'Low',
            'right_risk_level': 'Low'
        })

        # Trigger HIGH
        r1 = self.client.post('/api/v1/hardware/uturn-sensor-data', json={
            'device_id': device_id,
            'roadside_unit_id': roadside_unit_id,
            'left_risk_level': 'High',
            'right_risk_level': 'Low'
        })
        self.assertTrue(r1.get_json()['data']['alert_generated'])
        alerts_before = db.session.query(RoadsideAlertModel).count()

        # Simulate backend restart: create a completely brand new service instance
        new_service_after_restart = HardwareSensorService()

        # Send next HIGH reading through the brand new service instance
        result = new_service_after_restart.process_uturn_sensor_data({
            'device_id': device_id,
            'roadside_unit_id': roadside_unit_id,
            'left_risk_level': 'High',
            'right_risk_level': 'Low'
        })

        self.assertFalse(result['alert_generated'])
        self.assertIsNone(result['alert_id'])
        self.assertIsNone(result['notification_id'])
        # Confirms alert count did NOT increase
        self.assertEqual(db.session.query(RoadsideAlertModel).count(), alerts_before)


if __name__ == '__main__':
    unittest.main()

