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

class PoliceDashboardEndpointsTestCase(unittest.TestCase):
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

    # 1. GET /api/v1/police/dashboard
    def test_01_get_dashboard_data(self):
        res = self.client.get('/api/v1/police/dashboard', headers=self.police_headers)
        self.assertEqual(res.status_code, 200)
        body = res.get_json()
        self.assertTrue(body['success'])
        data = body['data']

        # Verify all top-level sections exist
        self.assertIn('statistics', data)
        self.assertIn('busSafety', data)
        self.assertIn('uturnSafety', data)
        self.assertIn('alertsOverview', data)
        self.assertIn('systemStatus', data)

        # Verify all 10 KPI statistics
        stats = data['statistics']
        expected_kpis = [
            'totalBuses', 'totalDrivers', 'totalRoutes', 'busDevices',
            'uturnDevices', 'totalDevices', 'busAlerts', 'uturnAlerts',
            'policeOfficers', 'sltbUsers'
        ]
        for kpi in expected_kpis:
            self.assertIn(kpi, stats)
            self.assertIsInstance(stats[kpi], int)

        print(f"[OK] Test 01 Passed: GET /api/v1/police/dashboard returned live KPIs: {stats}")

    # 2. GET /api/v1/police/dashboard/charts with date filters
    def test_02_get_dashboard_charts(self):
        periods = ['This Week', 'Last Week', '2 Weeks Ago', 'This Month', 'Today']
        for p in periods:
            res = self.client.get(f'/api/v1/police/dashboard/charts?period={p}', headers=self.police_headers)
            self.assertEqual(res.status_code, 200)
            body = res.get_json()
            self.assertTrue(body['success'])
            chart_data = body['data']
            self.assertIn('chartData', chart_data)
            self.assertIsInstance(chart_data['chartData'], list)
            print(f"[OK] Test 02 Passed: Period '{p}' returned {len(chart_data['chartData'])} daily data points.")

    # 3. GET /api/v1/police/dashboard/safety-monitors
    def test_03_get_safety_monitors(self):
        res = self.client.get('/api/v1/police/dashboard/safety-monitors', headers=self.police_headers)
        self.assertEqual(res.status_code, 200)
        body = res.get_json()
        self.assertTrue(body['success'])
        data = body['data']
        self.assertIn('busSafety', data)
        self.assertIn('uturnSafety', data)
        print(f"[OK] Test 03 Passed: Safety monitors telemetry loaded.")

    # 4. Security: 401 Unauthenticated
    def test_04_unauthenticated_request(self):
        res = self.client.get('/api/v1/police/dashboard')
        self.assertEqual(res.status_code, 401)
        print("[OK] Test 04 Passed: 401 returned for unauthenticated request.")

    # 5. Security: 403 Unauthorized role
    def test_05_unauthorized_role(self):
        res = self.client.get('/api/v1/police/dashboard', headers=self.sltb_headers)
        self.assertEqual(res.status_code, 403)
        print("[OK] Test 05 Passed: 403 returned for SLTB Admin requesting Police resource.")

if __name__ == '__main__':
    unittest.main()
