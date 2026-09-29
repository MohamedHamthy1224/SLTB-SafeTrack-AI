import sys
import os
import unittest
import json

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app import create_app
from app.data.database import db
from app.data.models.roadside_unit_model import RoadsideUnitModel
from app.data.models.device_registry_model import DeviceRegistryModel
from app.data.models.route_model import RouteModel
from flask_jwt_extended import create_access_token

class ComprehensiveUTurnManagementTestCase(unittest.TestCase):
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

        # Find or create a test device and route for testing
        with self.app.app_context():
            device = DeviceRegistryModel.query.filter_by(device_type='Roadside Unit').first()
            if not device:
                device = DeviceRegistryModel(
                    device_code='TEST-RSU-AUTO',
                    device_name='Auto Test Roadside Unit',
                    device_type='Roadside Unit',
                    status='Active'
                )
                db.session.add(device)
                db.session.commit()
            self.test_device_id = device.device_id

            route = RouteModel.query.first()
            self.test_route_id = route.route_id if route else None

    def tearDown(self):
        self.app_context.pop()

    def test_01_get_all_units(self):
        res = self.client.get('/api/v1/police/u-turn-management', headers=self.police_headers)
        self.assertEqual(res.status_code, 200)
        body = res.get_json()
        self.assertTrue(body['success'])
        self.assertIsInstance(body['data'], list)
        print(f"[OK] Test 01 Passed: GET /api/v1/police/u-turn-management returned {len(body['data'])} records")

    def test_02_get_summary(self):
        res = self.client.get('/api/v1/police/u-turn-management/summary', headers=self.police_headers)
        self.assertEqual(res.status_code, 200)
        body = res.get_json()
        self.assertTrue(body['success'])
        stats = body['data']
        self.assertIn('totalUnits', stats)
        self.assertIn('activeUnits', stats)
        self.assertIn('inactiveUnits', stats)
        self.assertIn('maintenanceUnits', stats)
        print(f"[OK] Test 02 Passed: Summary -> {stats}")

    def test_03_get_metadata_statuses_routes_devices(self):
        # Statuses
        res_stat = self.client.get('/api/v1/police/u-turn-management/statuses', headers=self.police_headers)
        self.assertEqual(res_stat.status_code, 200)
        body_stat = res_stat.get_json()
        self.assertTrue(body_stat['success'])
        self.assertIn('Active', body_stat['data'])

        # Routes
        res_routes = self.client.get('/api/v1/police/u-turn-management/routes', headers=self.police_headers)
        self.assertEqual(res_routes.status_code, 200)
        body_routes = res_routes.get_json()
        self.assertTrue(body_routes['success'])
        self.assertIsInstance(body_routes['data'], list)

        # Devices
        res_devices = self.client.get('/api/v1/police/u-turn-management/devices', headers=self.police_headers)
        self.assertEqual(res_devices.status_code, 200)
        body_devices = res_devices.get_json()
        self.assertTrue(body_devices['success'])
        self.assertIsInstance(body_devices['data'], list)
        print("[OK] Test 03 Passed: Statuses, Routes, and Devices endpoints loaded successfully")

    def test_04_create_get_update_deactivate_workflow(self):
        # 1. CREATE
        create_payload = {
            'deviceId': self.test_device_id,
            'routeId': self.test_route_id,
            'locationName': 'Test Kandy Expressway Junction',
            'latitude': 7.290571,
            'longitude': 80.633728,
            'installationDate': '2026-08-20',
            'status': 'Active'
        }
        res_create = self.client.post(
            '/api/v1/police/u-turn-management',
            headers=self.police_headers,
            data=json.dumps(create_payload)
        )
        self.assertEqual(res_create.status_code, 201)
        created_data = res_create.get_json()['data']
        unit_id = created_data['roadsideUnitId']
        self.assertEqual(created_data['locationName'], 'Test Kandy Expressway Junction')
        self.assertEqual(created_data['status'], 'Active')

        # 2. GET BY ID
        res_get = self.client.get(f'/api/v1/police/u-turn-management/{unit_id}', headers=self.police_headers)
        self.assertEqual(res_get.status_code, 200)
        get_data = res_get.get_json()['data']
        self.assertEqual(get_data['roadsideUnitId'], unit_id)
        self.assertEqual(get_data['locationName'], 'Test Kandy Expressway Junction')

        # 3. UPDATE
        update_payload = {
            'locationName': 'Updated Test Kandy Expressway Junction',
            'status': 'Maintenance',
            'latitude': 7.291000,
            'longitude': 80.634000
        }
        res_update = self.client.put(
            f'/api/v1/police/u-turn-management/{unit_id}',
            headers=self.police_headers,
            data=json.dumps(update_payload)
        )
        self.assertEqual(res_update.status_code, 200)
        updated_data = res_update.get_json()['data']
        self.assertEqual(updated_data['locationName'], 'Updated Test Kandy Expressway Junction')
        self.assertEqual(updated_data['status'], 'Maintenance')

        # 4. DEACTIVATE (Status -> Inactive, record preserved)
        res_deact = self.client.put(
            f'/api/v1/police/u-turn-management/{unit_id}/inactive',
            headers=self.police_headers
        )
        self.assertEqual(res_deact.status_code, 200)
        deact_data = res_deact.get_json()['data']
        self.assertEqual(deact_data['status'], 'Inactive')

        # Verify in DB that record still exists with Inactive status
        res_check = self.client.get(f'/api/v1/police/u-turn-management/{unit_id}', headers=self.police_headers)
        self.assertEqual(res_check.status_code, 200)
        self.assertEqual(res_check.get_json()['data']['status'], 'Inactive')

        # Clean up test record
        with self.app.app_context():
            u = RoadsideUnitModel.query.get(unit_id)
            if u:
                db.session.delete(u)
                db.session.commit()

        print(f"[OK] Test 04 Passed: Complete CRUD + Deactivate workflow (ID={unit_id}) succeeded")

    def test_05_search_and_filtering(self):
        # Test search query
        res_search = self.client.get('/api/v1/police/u-turn-management/search?keyword=Bend', headers=self.police_headers)
        self.assertEqual(res_search.status_code, 200)
        search_body = res_search.get_json()
        self.assertTrue(search_body['success'])

        # Test combined filtering
        res_filter = self.client.get('/api/v1/police/u-turn-management?status=Active', headers=self.police_headers)
        self.assertEqual(res_filter.status_code, 200)
        for unit in res_filter.get_json()['data']:
            self.assertEqual(unit['status'], 'Active')

        print("[OK] Test 05 Passed: Search and filtering queries verified")

    def test_06_validation_and_error_handling(self):
        # Missing required fields
        res_invalid = self.client.post(
            '/api/v1/police/u-turn-management',
            headers=self.police_headers,
            data=json.dumps({'locationName': ''})
        )
        self.assertEqual(res_invalid.status_code, 400)
        body = res_invalid.get_json()
        self.assertFalse(body['success'])
        self.assertIn('errors', body)

        # Invalid foreign key device ID
        res_bad_dev = self.client.post(
            '/api/v1/police/u-turn-management',
            headers=self.police_headers,
            data=json.dumps({
                'deviceId': 9999999,
                'locationName': 'Bad Device Location'
            })
        )
        self.assertEqual(res_bad_dev.status_code, 400)

        # 404 for non-existent unit ID
        res_404 = self.client.get('/api/v1/police/u-turn-management/9999999', headers=self.police_headers)
        self.assertEqual(res_404.status_code, 404)

        print("[OK] Test 06 Passed: Validation and 404/400 error handling verified")

    def test_07_authorization_and_role_restrictions(self):
        # No token -> 401
        res_no_token = self.client.get('/api/v1/police/u-turn-management')
        self.assertIn(res_no_token.status_code, [401, 422])

        # Wrong role (SLTB Admin) -> 403
        res_wrong_role = self.client.get('/api/v1/police/u-turn-management', headers=self.sltb_headers)
        self.assertEqual(res_wrong_role.status_code, 403)

        print("[OK] Test 07 Passed: Role restriction and authentication verified")

    def test_08_pdf_export(self):
        res_pdf = self.client.get('/api/v1/police/u-turn-management/export/pdf', headers=self.police_headers)
        self.assertEqual(res_pdf.status_code, 200)
        self.assertEqual(res_pdf.mimetype, 'application/pdf')
        self.assertTrue(len(res_pdf.data) > 100)
        print(f"[OK] Test 08 Passed: PDF export endpoint generated {len(res_pdf.data)} bytes")

if __name__ == '__main__':
    unittest.main()
