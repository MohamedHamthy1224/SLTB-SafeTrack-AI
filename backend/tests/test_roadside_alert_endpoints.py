import sys
import os
import unittest
import json

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app import create_app
from app.data.database import db
from flask_jwt_extended import create_access_token

class RoadsideAlertEndpointsTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app('development')
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()

        # Police Admin Token
        with self.app.app_context():
            self.police_token = create_access_token(
                identity="1",
                additional_claims={'role': 'Police Admin', 'username': 'police_admin'}
            )
            # Unauthorized SLTB Admin Token attempting police route
            self.sltb_token = create_access_token(
                identity="2",
                additional_claims={'role': 'SLTB Admin', 'username': 'sltb_user'}
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

    def test_01_get_alerts(self):
        res = self.client.get('/api/v1/police/u-turn-alerts', headers=self.police_headers)
        self.assertEqual(res.status_code, 200)
        body = res.get_json()
        self.assertTrue(body['success'])
        self.assertIsInstance(body['data'], list)
        print("[OK] Test 01: GET /api/v1/police/u-turn-alerts ->", len(body['data']), "alerts")

    def test_02_get_summary(self):
        res = self.client.get('/api/v1/police/u-turn-alerts/summary', headers=self.police_headers)
        self.assertEqual(res.status_code, 200)
        body = res.get_json()
        self.assertTrue(body['success'])
        stats = body['data']
        self.assertIn('totalAlerts', stats)
        self.assertIn('highAlerts', stats)
        self.assertIn('mediumAlerts', stats)
        self.assertIn('lowAlerts', stats)
        print("[OK] Test 02: GET /api/v1/police/u-turn-alerts/summary ->", stats)

    def test_03_get_priorities(self):
        res = self.client.get('/api/v1/police/u-turn-alerts/priorities', headers=self.police_headers)
        self.assertEqual(res.status_code, 200)
        body = res.get_json()
        self.assertTrue(body['success'])
        self.assertIsInstance(body['data'], list)
        self.assertIn('High', body['data'])
        print("[OK] Test 03: GET /api/v1/police/u-turn-alerts/priorities ->", body['data'])

    def test_04_get_charts(self):
        res = self.client.get('/api/v1/police/u-turn-alerts/charts', headers=self.police_headers)
        self.assertEqual(res.status_code, 200)
        body = res.get_json()
        self.assertTrue(body['success'])
        charts = body['data']
        self.assertIn('priorityDistribution', charts)
        self.assertIn('weeklyOverview', charts)
        self.assertIsInstance(charts['priorityDistribution'], list)
        self.assertIsInstance(charts['weeklyOverview'], list)
        print("[OK] Test 04: GET /api/v1/police/u-turn-alerts/charts ->", len(charts['priorityDistribution']), "priority items,", len(charts['weeklyOverview']), "days")

    def test_05_get_recent_notifications(self):
        res = self.client.get('/api/v1/police/u-turn-alerts/recent?limit=5', headers=self.police_headers)
        self.assertEqual(res.status_code, 200)
        body = res.get_json()
        self.assertTrue(body['success'])
        self.assertIsInstance(body['data'], list)
        print("[OK] Test 05: GET /api/v1/police/u-turn-alerts/recent ->", len(body['data']), "recent items")

    def test_06_export_pdf(self):
        res = self.client.get('/api/v1/police/u-turn-alerts/export/pdf', headers=self.police_headers)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.mimetype, 'application/pdf')
        self.assertTrue(res.data.startswith(b'%PDF'))
        print("[OK] Test 06: GET /api/v1/police/u-turn-alerts/export/pdf -> Valid PDF bytes returned (len:", len(res.data), ")")

    def test_07_alert_details(self):
        # First get list of alerts
        res = self.client.get('/api/v1/police/u-turn-alerts', headers=self.police_headers)
        alerts = res.get_json()['data']
        if alerts:
            first_id = alerts[0]['roadsideAlertId']
            detail_res = self.client.get(f'/api/v1/police/u-turn-alerts/{first_id}', headers=self.police_headers)
            self.assertEqual(detail_res.status_code, 200)
            detail_body = detail_res.get_json()
            self.assertTrue(detail_body['success'])
            self.assertEqual(detail_body['data']['roadsideAlertId'], first_id)
            print(f"[OK] Test 07: GET /api/v1/police/u-turn-alerts/{first_id} -> Found details successfully")
        else:
            # 404 test with non-existent id
            detail_res = self.client.get('/api/v1/police/u-turn-alerts/999999', headers=self.police_headers)
            self.assertEqual(detail_res.status_code, 404)
            print("[OK] Test 07: GET /api/v1/police/u-turn-alerts/999999 -> 404 as expected for non-existent ID")

    def test_08_authorization(self):
        # SLTB Admin should be forbidden (403)
        res = self.client.get('/api/v1/police/u-turn-alerts', headers=self.sltb_headers)
        self.assertEqual(res.status_code, 403)
        # Unauthenticated request should be unauthorized (401)
        res_no_auth = self.client.get('/api/v1/police/u-turn-alerts')
        self.assertEqual(res_no_auth.status_code, 401)
        print("[OK] Test 08: Authorization check -> 403 Forbidden for SLTB Admin, 401 for unauthenticated")

if __name__ == '__main__':
    unittest.main()
