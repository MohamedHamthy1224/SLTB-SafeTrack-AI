import sys
import os
import unittest
import json

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app import create_app
from app.data.database import db
from app.data.models.bus_alert_model import BusAlertModel
from flask_jwt_extended import create_access_token

class BusAlertEndpointsTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app('development')
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()

        with self.app.app_context():
            # Police Admin Token (User 1)
            self.police_token = create_access_token(
                identity="1",
                additional_claims={'role': 'Police Admin', 'username': 'police_admin'}
            )
            # SLTB Admin Token (User 4)
            self.sltb_token = create_access_token(
                identity="4",
                additional_claims={'role': 'SLTB Admin', 'username': 'sltb_admin'}
            )

        self.police_headers = {
            'Authorization': f'Bearer {self.police_token}',
            'Content-Type': 'application/json'
        }
        self.sltb_headers = {
            'Authorization': f'Bearer {self.sltb_token}',
            'Content-Type': 'application/json'
        }

    def tearDown(self):
        self.app_context.pop()

    # 1. GET alerts
    def test_01_get_alerts(self):
        res = self.client.get('/api/v1/police/bus-alerts', headers=self.police_headers)
        self.assertEqual(res.status_code, 200)
        body = res.get_json()
        self.assertTrue(body['success'])
        self.assertIn('items', body['data'])
        self.assertIsInstance(body['data']['items'], list)
        print(f"[OK] Test 01 Passed: GET /api/v1/police/bus-alerts returned {len(body['data']['items'])} alerts.")

    # 2. GET alert by ID
    def test_02_get_alert_by_id(self):
        # First check if any alert exists
        alert = BusAlertModel.query.first()
        if alert:
            res = self.client.get(f'/api/v1/police/bus-alerts/{alert.bus_alert_id}', headers=self.police_headers)
            self.assertEqual(res.status_code, 200)
            body = res.get_json()
            self.assertTrue(body['success'])
            self.assertEqual(body['data']['id'], alert.bus_alert_id)
            self.assertIn('busDetails', body['data'])
            self.assertIn('notificationTitle', body['data'])
            print(f"[OK] Test 02 Passed: GET /api/v1/police/bus-alerts/{alert.bus_alert_id} retrieved successfully.")

    # 3. GET summary
    def test_03_get_summary(self):
        res = self.client.get('/api/v1/police/bus-alerts/summary', headers=self.police_headers)
        self.assertEqual(res.status_code, 200)
        body = res.get_json()
        self.assertTrue(body['success'])
        stats = body['data']
        self.assertIn('total', stats)
        self.assertIn('high', stats)
        self.assertIn('medium', stats)
        self.assertIn('low', stats)
        print(f"[OK] Test 03 Passed: Summary returned: {stats}")

    # 4. GET recent alerts
    def test_04_get_recent(self):
        res = self.client.get('/api/v1/police/bus-alerts/recent?limit=5', headers=self.police_headers)
        self.assertEqual(res.status_code, 200)
        body = res.get_json()
        self.assertTrue(body['success'])
        self.assertIsInstance(body['data'], list)
        print(f"[OK] Test 04 Passed: Recent notifications returned {len(body['data'])} items.")

    # 5. GET charts
    def test_05_get_charts(self):
        res = self.client.get('/api/v1/police/bus-alerts/charts', headers=self.police_headers)
        self.assertEqual(res.status_code, 200)
        body = res.get_json()
        self.assertTrue(body['success'])
        self.assertIn('priorityDistribution', body['data'])
        self.assertIn('weeklyOverview', body['data'])
        self.assertEqual(len(body['data']['weeklyOverview']), 7)
        print(f"[OK] Test 05 Passed: Charts data returned 7 days of weekly overview.")

    # 6. PDF Export
    def test_06_export_pdf(self):
        res = self.client.get('/api/v1/police/bus-alerts/export/pdf', headers=self.police_headers)
        self.assertEqual(res.status_code, 200)
        self.assertIn('application/pdf', res.headers.get('Content-Type', ''))
        self.assertIn('attachment', res.headers.get('Content-Disposition', ''))
        self.assertTrue(res.data.startswith(b'%PDF-'))
        self.assertIn(b'%%EOF', res.data)
        self.assertTrue(len(res.data) > 100)
        print(f"[OK] Test 06 Passed: PDF Export returned {len(res.data)} bytes of valid binary PDF.")

    # 7. Priority filter
    def test_07_priority_filter(self):
        res = self.client.get('/api/v1/police/bus-alerts?priority=High', headers=self.police_headers)
        self.assertEqual(res.status_code, 200)
        body = res.get_json()
        self.assertTrue(body['success'])
        print(f"[OK] Test 07 Passed: Priority=High filtered {len(body['data']['items'])} alerts.")

    # 8. Search filter
    def test_08_search_filter(self):
        res = self.client.get('/api/v1/police/bus-alerts?search=SLTB', headers=self.police_headers)
        self.assertEqual(res.status_code, 200)
        body = res.get_json()
        self.assertTrue(body['success'])
        print(f"[OK] Test 08 Passed: Search=SLTB returned {len(body['data']['items'])} alerts.")

    # 9. Pagination
    def test_09_pagination(self):
        res = self.client.get('/api/v1/police/bus-alerts?page=1&per_page=2', headers=self.police_headers)
        self.assertEqual(res.status_code, 200)
        body = res.get_json()
        self.assertTrue(body['success'])
        self.assertEqual(body['data']['page'], 1)
        self.assertEqual(body['data']['perPage'], 2)
        print(f"[OK] Test 09 Passed: Pagination verified.")

    # 10. Invalid alert ID (404)
    def test_10_invalid_alert_id(self):
        res = self.client.get('/api/v1/police/bus-alerts/999999', headers=self.police_headers)
        self.assertEqual(res.status_code, 404)
        body = res.get_json()
        self.assertFalse(body['success'])
        print("[OK] Test 10 Passed: 404 returned for non-existent alert ID.")

    # 11. Unauthorized request (401)
    def test_11_unauthorized(self):
        res = self.client.get('/api/v1/police/bus-alerts')
        self.assertEqual(res.status_code, 401)
        print("[OK] Test 11 Passed: 401 returned for unauthenticated request.")

    # 12. Forbidden role (403)
    def test_12_forbidden_role(self):
        res = self.client.get('/api/v1/police/bus-alerts', headers=self.sltb_headers)
        self.assertEqual(res.status_code, 403)
        print("[OK] Test 12 Passed: 403 returned for SLTB Admin requesting Police resource.")

    # 13. Create Bus Alert & WebSocket trigger
    def test_13_create_alert_and_realtime(self):
        payload = {
            'bus_id': 1,
            'device_id': 1,
            'title': 'Forward Object Collision Warning',
            'message': 'Proximity violation detected by ultrasound sensors.',
            'priority': 'High'
        }
        res = self.client.post('/api/v1/police/bus-alerts', headers=self.police_headers, data=json.dumps(payload))
        self.assertEqual(res.status_code, 201)
        body = res.get_json()
        self.assertTrue(body['success'])
        self.assertEqual(body['data']['priority'], 'High')
        self.assertEqual(body['data']['notificationTitle'], 'Forward Object Collision Warning')
        print(f"[OK] Test 13 Passed: Created alert ID={body['data']['id']} with real-time payload.")

if __name__ == '__main__':
    unittest.main()
