import sys
import os
import unittest

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app import create_app
from app.data.database import db
from app.data.models.activity_log_model import UserActivityLogModel
from flask_jwt_extended import create_access_token

class AllExportEndpointsTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app('development')
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()

        with self.app.app_context():
            # Police Admin Token (User 1 exists in DB)
            self.police_token = create_access_token(
                identity="1",
                additional_claims={'role': 'Police Admin', 'username': 'police_admin'}
            )
            # SLTB Admin Token (User 4 exists in DB)
            self.sltb_token = create_access_token(
                identity="4",
                additional_claims={'role': 'SLTB Admin', 'username': 'sltb_admin'}
            )
            # General User Token (User 3 exists in DB)
            self.user_token = create_access_token(
                identity="3",
                additional_claims={'role': 'Traffic Police Officer', 'username': 'timekeeper_user'}
            )

        self.police_headers = {'Authorization': f'Bearer {self.police_token}'}
        self.sltb_headers = {'Authorization': f'Bearer {self.sltb_token}'}
        self.user_headers = {'Authorization': f'Bearer {self.user_token}'}

    def tearDown(self):
        self.app_context.pop()

    def _verify_pdf_response(self, res, expected_filename_prefix):
        self.assertEqual(res.status_code, 200)
        self.assertIn('application/pdf', res.headers.get('Content-Type', ''))
        content_disp = res.headers.get('Content-Disposition', '')
        self.assertIn('attachment', content_disp)
        self.assertIn('.pdf', content_disp)
        if expected_filename_prefix:
            self.assertIn(expected_filename_prefix.lower(), content_disp.lower())
        
        # Verify valid PDF binary structure
        data = res.data
        self.assertTrue(len(data) > 100, f"PDF body too short: {len(data)} bytes")
        self.assertTrue(data.startswith(b'%PDF-'), f"PDF does not start with %PDF- header: {data[:20]}")
        self.assertIn(b'%%EOF', data, "PDF does not contain standard EOF marker")

    # =========================================================================
    # 1. POLICE ADMIN — U-TURN ALERTS EXPORT
    # =========================================================================
    def test_01_police_uturn_alerts_pdf_export(self):
        endpoint = '/api/v1/police/u-turn-alerts/export/pdf'
        
        # 401 unauthenticated
        res_401 = self.client.get(endpoint)
        self.assertEqual(res_401.status_code, 401)

        # 403 unauthorized role
        res_403 = self.client.get(endpoint, headers=self.sltb_headers)
        self.assertEqual(res_403.status_code, 403)

        # 200 authenticated Police Admin
        res_200 = self.client.get(endpoint, headers=self.police_headers)
        self._verify_pdf_response(res_200, 'u_turn_alerts')

        # Filtered export
        res_filtered = self.client.get(f"{endpoint}?priority=High", headers=self.police_headers)
        self._verify_pdf_response(res_filtered, 'u_turn_alerts')

        # Check activity log created
        last_log = UserActivityLogModel.query.order_by(UserActivityLogModel.activity_id.desc()).first()
        self.assertIsNotNone(last_log)
        self.assertIn("U-Turn Alerts", last_log.activity)
        print("[OK] Test 01 Passed: Police U-Turn Alerts PDF export verified.")

    # =========================================================================
    # 2. POLICE ADMIN — SYSTEM LOGS EXPORT
    # =========================================================================
    def test_02_police_system_logs_pdf_export(self):
        endpoint = '/api/v1/police/system-logs/export/pdf'

        # 401 unauthenticated
        res_401 = self.client.get(endpoint)
        self.assertEqual(res_401.status_code, 401)

        # 403 unauthorized role
        res_403 = self.client.get(endpoint, headers=self.sltb_headers)
        self.assertEqual(res_403.status_code, 403)

        # 200 authenticated Police Admin
        res_200 = self.client.get(endpoint, headers=self.police_headers)
        self._verify_pdf_response(res_200, 'system_logs')

        # Filtered export
        res_filtered = self.client.get(f"{endpoint}?search=admin", headers=self.police_headers)
        self._verify_pdf_response(res_filtered, 'system_logs')
        print("[OK] Test 02 Passed: Police System Logs PDF export verified.")

    # =========================================================================
    # 3. POLICE ADMIN — USER MANAGEMENT EXPORT
    # =========================================================================
    def test_03_police_users_pdf_export(self):
        for endpoint in ['/api/v1/police/users/export/pdf', '/api/v1/users/export/pdf']:
            # 401 unauthenticated
            res_401 = self.client.get(endpoint)
            self.assertEqual(res_401.status_code, 401)

            # 403 unauthorized role
            res_403 = self.client.get(endpoint, headers=self.user_headers)
            self.assertEqual(res_403.status_code, 403)

            # 200 authenticated Police Admin
            res_200 = self.client.get(endpoint, headers=self.police_headers)
            self._verify_pdf_response(res_200, 'user_management')

            # Filtered export
            res_filtered = self.client.get(f"{endpoint}?role=Police+Admin", headers=self.police_headers)
            self._verify_pdf_response(res_filtered, 'user_management')
        print("[OK] Test 03 Passed: Police User Management PDF export verified.")

    # =========================================================================
    # 4. POLICE ADMIN — BUS ALERTS EXPORT
    # =========================================================================
    def test_04_police_bus_alerts_pdf_export(self):
        endpoint = '/api/v1/police/bus-alerts/export/pdf'

        # 401 unauthenticated
        res_401 = self.client.get(endpoint)
        self.assertEqual(res_401.status_code, 401)

        # 403 unauthorized role
        res_403 = self.client.get(endpoint, headers=self.sltb_headers)
        self.assertEqual(res_403.status_code, 403)

        # 200 authenticated Police Admin
        res_200 = self.client.get(endpoint, headers=self.police_headers)
        self._verify_pdf_response(res_200, 'bus_alerts')

        # Filtered export
        res_filtered = self.client.get(f"{endpoint}?priority=Medium", headers=self.police_headers)
        self._verify_pdf_response(res_filtered, 'bus_alerts')
        print("[OK] Test 04 Passed: Police Bus Alerts PDF export verified.")

    # =========================================================================
    # 5. POLICE ADMIN — U-TURN MANAGEMENT EXPORT
    # =========================================================================
    def test_05_police_uturn_units_pdf_export(self):
        endpoint = '/api/v1/police/uturn-units/export/pdf'

        # 401 unauthenticated
        res_401 = self.client.get(endpoint)
        self.assertEqual(res_401.status_code, 401)

        # 403 unauthorized role
        res_403 = self.client.get(endpoint, headers=self.sltb_headers)
        self.assertEqual(res_403.status_code, 403)

        # 200 authenticated Police Admin
        res_200 = self.client.get(endpoint, headers=self.police_headers)
        self._verify_pdf_response(res_200, 'uturn_units')

        # Filtered export
        res_filtered = self.client.get(f"{endpoint}?status=Active", headers=self.police_headers)
        self._verify_pdf_response(res_filtered, 'uturn_units')
        print("[OK] Test 05 Passed: Police U-Turn Units PDF export verified.")

    # =========================================================================
    # 6. SLTB ADMIN — BUSES REPORT EXPORT
    # =========================================================================
    def test_06_sltb_buses_pdf_export(self):
        for endpoint in ['/api/v1/sltb/reports/buses/export/pdf', '/api/v1/sltb/reports/buses/export']:
            # 401 unauthenticated
            res_401 = self.client.get(endpoint)
            self.assertEqual(res_401.status_code, 401)

            # 403 unauthorized role (Police admin cannot access SLTB reports)
            res_403 = self.client.get(endpoint, headers=self.police_headers)
            self.assertEqual(res_403.status_code, 403)

            # 200 authenticated SLTB Admin
            res_200 = self.client.get(endpoint, headers=self.sltb_headers)
            self._verify_pdf_response(res_200, 'buses')

            # Filtered export
            res_filtered = self.client.get(f"{endpoint}?status=Active", headers=self.sltb_headers)
            self._verify_pdf_response(res_filtered, 'buses')
        print("[OK] Test 06 Passed: SLTB Buses Report PDF export verified.")

    # =========================================================================
    # 7. SLTB ADMIN — ROUTES REPORT EXPORT
    # =========================================================================
    def test_07_sltb_routes_pdf_export(self):
        for endpoint in ['/api/v1/sltb/reports/routes/export/pdf', '/api/v1/sltb/reports/routes/export']:
            # 401 unauthenticated
            res_401 = self.client.get(endpoint)
            self.assertEqual(res_401.status_code, 401)

            # 403 unauthorized role
            res_403 = self.client.get(endpoint, headers=self.police_headers)
            self.assertEqual(res_403.status_code, 403)

            # 200 authenticated SLTB Admin
            res_200 = self.client.get(endpoint, headers=self.sltb_headers)
            self._verify_pdf_response(res_200, 'routes')

            # Filtered export
            res_filtered = self.client.get(f"{endpoint}?status=Active", headers=self.sltb_headers)
            self._verify_pdf_response(res_filtered, 'routes')
        print("[OK] Test 07 Passed: SLTB Routes Report PDF export verified.")

    # =========================================================================
    # 8. SLTB ADMIN — DRIVERS REPORT EXPORT
    # =========================================================================
    def test_08_sltb_drivers_pdf_export(self):
        for endpoint in ['/api/v1/sltb/reports/drivers/export/pdf', '/api/v1/sltb/reports/drivers/export']:
            # 401 unauthenticated
            res_401 = self.client.get(endpoint)
            self.assertEqual(res_401.status_code, 401)

            # 403 unauthorized role
            res_403 = self.client.get(endpoint, headers=self.police_headers)
            self.assertEqual(res_403.status_code, 403)

            # 200 authenticated SLTB Admin
            res_200 = self.client.get(endpoint, headers=self.sltb_headers)
            self._verify_pdf_response(res_200, 'drivers')

            # Filtered export
            res_filtered = self.client.get(f"{endpoint}?status=Active", headers=self.sltb_headers)
            self._verify_pdf_response(res_filtered, 'drivers')
        print("[OK] Test 08 Passed: SLTB Drivers Report PDF export verified.")

    # =========================================================================
    # 9. SLTB ADMIN — ASSIGNMENT HISTORY REPORT EXPORT
    # =========================================================================
    def test_09_sltb_assignment_history_pdf_export(self):
        for endpoint in ['/api/v1/sltb/reports/assignment-history/export/pdf', '/api/v1/sltb/reports/assignment-history/export']:
            # 401 unauthenticated
            res_401 = self.client.get(endpoint)
            self.assertEqual(res_401.status_code, 401)

            # 403 unauthorized role
            res_403 = self.client.get(endpoint, headers=self.police_headers)
            self.assertEqual(res_403.status_code, 403)

            # 200 authenticated SLTB Admin
            res_200 = self.client.get(endpoint, headers=self.sltb_headers)
            self._verify_pdf_response(res_200, 'assignment_history')
        print("[OK] Test 09 Passed: SLTB Assignment History Report PDF export verified.")

    # =========================================================================
    # 10. SLTB ADMIN — SENSORS & ALERTS REPORT EXPORT
    # =========================================================================
    def test_10_sltb_sensors_alerts_pdf_export(self):
        for endpoint in ['/api/v1/sltb/reports/sensors-alerts/export/pdf', '/api/v1/sltb/reports/sensors-alerts/export']:
            # 401 unauthenticated
            res_401 = self.client.get(endpoint)
            self.assertEqual(res_401.status_code, 401)

            # 403 unauthorized role
            res_403 = self.client.get(endpoint, headers=self.police_headers)
            self.assertEqual(res_403.status_code, 403)

            # 200 authenticated SLTB Admin
            res_200 = self.client.get(endpoint, headers=self.sltb_headers)
            self._verify_pdf_response(res_200, 'sensors_alerts')
        print("[OK] Test 10 Passed: SLTB Sensors & Alerts Report PDF export verified.")

if __name__ == '__main__':
    unittest.main()
