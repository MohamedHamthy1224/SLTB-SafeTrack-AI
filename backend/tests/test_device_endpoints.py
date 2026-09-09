import sys
import os
import unittest
import json
import uuid

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app import create_app
from app.data.database import db
from flask_jwt_extended import create_access_token

class ComprehensiveDeviceTestCase(unittest.TestCase):
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

    def test_01_get_devices(self):
        res = self.client.get('/api/v1/police/devices', headers=self.police_headers)
        self.assertEqual(res.status_code, 200)
        body = res.get_json()
        self.assertTrue(body['success'])
        self.assertIsInstance(body['data'], list)
        print("[OK] Test 01 Passed: GET /api/v1/police/devices returned", len(body['data']), "records")

    def test_02_get_summary(self):
        res = self.client.get('/api/v1/police/devices/summary', headers=self.police_headers)
        self.assertEqual(res.status_code, 200)
        body = res.get_json()
        self.assertTrue(body['success'])
        stats = body['data']
        self.assertIn('total', stats)
        self.assertIn('busUnits', stats)
        self.assertIn('roadsideUnits', stats)
        self.assertIn('online', stats)
        self.assertIn('maintenance', stats)
        print("[OK] Test 02 Passed: GET /api/v1/police/devices/summary ->", stats)

    def test_03_dropdown_metadata_endpoints(self):
        # 1. Types
        res_types = self.client.get('/api/v1/police/devices/types', headers=self.police_headers)
        self.assertEqual(res_types.status_code, 200)
        self.assertIn('Bus Unit', res_types.get_json()['data'])
        self.assertIn('Roadside Unit', res_types.get_json()['data'])

        # 2. Statuses
        res_statuses = self.client.get('/api/v1/police/devices/statuses', headers=self.police_headers)
        self.assertEqual(res_statuses.status_code, 200)
        self.assertIn('Active', res_statuses.get_json()['data'])

        # 3. Bus device statuses
        res_bus_statuses = self.client.get('/api/v1/police/devices/bus-statuses', headers=self.police_headers)
        self.assertEqual(res_bus_statuses.status_code, 200)
        self.assertIn('Active', res_bus_statuses.get_json()['data'])

        # 4. Buses list
        res_buses = self.client.get('/api/v1/police/devices/buses', headers=self.police_headers)
        self.assertEqual(res_buses.status_code, 200)
        buses = res_buses.get_json()['data']
        self.assertIsInstance(buses, list)
        self.assertTrue(len(buses) > 0)
        print(f"[OK] Test 03 Passed: Metadata endpoints loaded successfully ({len(buses)} buses found)")

    def test_04_create_and_manage_roadside_unit(self):
        code = f"RSU-TEST-{uuid.uuid4().hex[:6].upper()}"
        mac = f"00:1A:{uuid.uuid4().hex[:2]}:{uuid.uuid4().hex[:2]}:{uuid.uuid4().hex[:2]}:{uuid.uuid4().hex[:2]}".upper()

        payload = {
            'deviceCode': code,
            'deviceName': 'Highway Junction Unit 12',
            'deviceType': 'Roadside Unit',
            'macAddress': mac,
            'ipAddress': '192.168.10.20',
            'firmwareVersion': 'v1.4.2',
            'installationDate': '2026-06-15',
            'status': 'Active',
            'isOnline': True
        }

        # POST
        res_post = self.client.post('/api/v1/police/devices', headers=self.police_headers, data=json.dumps(payload))
        self.assertEqual(res_post.status_code, 201)
        created = res_post.get_json()['data']
        dev_id = created['deviceId']
        self.assertEqual(created['deviceCode'], code)
        self.assertEqual(created['deviceType'], 'Roadside Unit')

        # GET by ID
        res_get = self.client.get(f'/api/v1/police/devices/{dev_id}', headers=self.police_headers)
        self.assertEqual(res_get.status_code, 200)
        fetched = res_get.get_json()['data']
        self.assertEqual(fetched['deviceName'], 'Highway Junction Unit 12')
        self.assertIsNone(fetched['assignment'])

        # PUT Update
        update_payload = {
            'deviceCode': code,
            'deviceName': 'Highway Junction Unit 12 - Upgraded',
            'deviceType': 'Roadside Unit',
            'macAddress': mac,
            'ipAddress': '192.168.10.21',
            'firmwareVersion': 'v1.5.0',
            'installationDate': '2026-06-15',
            'status': 'Maintenance',
            'isOnline': False
        }
        res_put = self.client.put(f'/api/v1/police/devices/{dev_id}', headers=self.police_headers, data=json.dumps(update_payload))
        self.assertEqual(res_put.status_code, 200)
        updated = res_put.get_json()['data']
        self.assertEqual(updated['deviceName'], 'Highway Junction Unit 12 - Upgraded')
        self.assertEqual(updated['status'], 'Maintenance')

        # PUT /inactive (Stop icon action)
        res_inact = self.client.put(f'/api/v1/police/devices/{dev_id}/inactive', headers=self.police_headers)
        self.assertEqual(res_inact.status_code, 200)
        self.assertEqual(res_inact.get_json()['data']['status'], 'Inactive')
        print(f"[OK] Test 04 Passed: Roadside Unit CRUD (ID={dev_id}) successful")

    def test_05_create_and_manage_bus_unit_with_assignment(self):
        code = f"BUS-TEST-{uuid.uuid4().hex[:6].upper()}"
        mac = f"00:1B:{uuid.uuid4().hex[:2]}:{uuid.uuid4().hex[:2]}:{uuid.uuid4().hex[:2]}:{uuid.uuid4().hex[:2]}".upper()

        payload = {
            'deviceCode': code,
            'deviceName': 'Express Bus Cabin Sensor',
            'deviceType': 'Bus Unit',
            'macAddress': mac,
            'ipAddress': '10.20.1.88',
            'firmwareVersion': 'v3.0.1',
            'installationDate': '2026-07-20',
            'status': 'Active',
            'isOnline': True,
            'assignment': {
                'busId': 1,
                'installationLocation': 'Front Windshield Console',
                'installedDate': '2026-07-20',
                'status': 'Active'
            }
        }

        # POST (Dual-table transaction)
        res_post = self.client.post('/api/v1/police/devices', headers=self.police_headers, data=json.dumps(payload))
        self.assertEqual(res_post.status_code, 201)
        created = res_post.get_json()['data']
        dev_id = created['deviceId']
        self.assertEqual(created['deviceType'], 'Bus Unit')
        self.assertIsNotNone(created['assignment'])
        self.assertEqual(created['assignment']['busId'], 1)
        self.assertEqual(created['assignment']['installationLocation'], 'Front Windshield Console')

        # GET by ID
        res_get = self.client.get(f'/api/v1/police/devices/{dev_id}', headers=self.police_headers)
        self.assertEqual(res_get.status_code, 200)
        fetched = res_get.get_json()['data']
        self.assertIsNotNone(fetched['assignment'])
        self.assertEqual(fetched['assignment']['busId'], 1)

        # PUT Update (Both tables)
        update_payload = {
            'deviceCode': code,
            'deviceName': 'Express Bus Cabin Sensor - Reassigned',
            'deviceType': 'Bus Unit',
            'macAddress': mac,
            'ipAddress': '10.20.1.89',
            'firmwareVersion': 'v3.1.0',
            'installationDate': '2026-07-20',
            'status': 'Active',
            'isOnline': True,
            'assignment': {
                'busId': 2,
                'installationLocation': 'Driver Dashboard Left',
                'installedDate': '2026-07-25',
                'status': 'Active'
            }
        }
        res_put = self.client.put(f'/api/v1/police/devices/{dev_id}', headers=self.police_headers, data=json.dumps(update_payload))
        self.assertEqual(res_put.status_code, 200)
        updated = res_put.get_json()['data']
        self.assertEqual(updated['assignment']['busId'], 2)
        self.assertEqual(updated['assignment']['installationLocation'], 'Driver Dashboard Left')
        print(f"[OK] Test 05 Passed: Bus Unit dual-table transaction CRUD (ID={dev_id}) successful")

    def test_06_validation_uniqueness_and_errors(self):
        # 1. Missing required fields
        res_bad = self.client.post('/api/v1/police/devices', headers=self.police_headers, data=json.dumps({}))
        self.assertEqual(res_bad.status_code, 400)
        self.assertFalse(res_bad.get_json()['success'])

        # 2. Duplicate device code
        res_all = self.client.get('/api/v1/police/devices', headers=self.police_headers)
        devices = res_all.get_json()['data']
        if devices:
            first_code = devices[0]['deviceCode']
            dup_payload = {
                'deviceCode': first_code,
                'deviceName': 'Duplicate Device Name',
                'deviceType': 'Roadside Unit',
                'status': 'Active'
            }
            res_dup = self.client.post('/api/v1/police/devices', headers=self.police_headers, data=json.dumps(dup_payload))
            self.assertEqual(res_dup.status_code, 400)
            self.assertFalse(res_dup.get_json()['success'])
            self.assertIn('deviceCode', res_dup.get_json().get('errors', {}))

        # 3. Invalid device ID
        res_not_found = self.client.get('/api/v1/police/devices/999999', headers=self.police_headers)
        self.assertEqual(res_not_found.status_code, 404)
        print("[OK] Test 06 Passed: Input validation and error handling verified")

    def test_07_authorization_security(self):
        # SLTB Admin should be rejected with 403 on Police Device route
        res = self.client.get('/api/v1/police/devices', headers=self.sltb_headers)
        self.assertEqual(res.status_code, 403)
        self.assertFalse(res.get_json()['success'])

        # Unauthenticated request rejected with 401
        res_no_auth = self.client.get('/api/v1/police/devices')
        self.assertEqual(res_no_auth.status_code, 401)
        print("[OK] Test 07 Passed: Authorization and role restriction verified")

    def test_08_search_and_filtering(self):
        res = self.client.get('/api/v1/police/devices?device_type=Bus Unit', headers=self.police_headers)
        self.assertEqual(res.status_code, 200)
        data = res.get_json()['data']
        for d in data:
            self.assertEqual(d['deviceType'], 'Bus Unit')

        res_stat = self.client.get('/api/v1/police/devices?status=Active', headers=self.police_headers)
        self.assertEqual(res_stat.status_code, 200)
        for d in res_stat.get_json()['data']:
            self.assertEqual(d['status'], 'Active')
        print("[OK] Test 08 Passed: Query parameter filtering verified")

if __name__ == '__main__':
    unittest.main()
