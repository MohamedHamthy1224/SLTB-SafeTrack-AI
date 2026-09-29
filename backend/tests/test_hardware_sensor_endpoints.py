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


if __name__ == '__main__':
    unittest.main()
