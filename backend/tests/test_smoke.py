import sys
import os
import unittest
import json

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app import create_app

class SystemSmokeTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app('development')
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()

    def tearDown(self):
        self.app_context.pop()

    def test_01_health(self):
        res = self.client.get('/api/v1/health')
        self.assertEqual(res.status_code, 200)
        print("[OK] Health Check passed")

    def test_02_login_and_police_flow(self):
        # 1. Police Admin Login
        login_res = self.client.post('/api/v1/auth/login', data=json.dumps({
            "identifier": "policeadmin",
            "password": "adminpassword"
        }), content_type='application/json')
        
        # If user exists in DB, verify token
        if login_res.status_code == 200:
            token = login_res.get_json()['data']['token']
            headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}

            # Fetch devices
            res_dev = self.client.get('/api/v1/police/devices', headers=headers)
            self.assertEqual(res_dev.status_code, 200)

            # Fetch summary
            res_sum = self.client.get('/api/v1/police/devices/summary', headers=headers)
            self.assertEqual(res_sum.status_code, 200)
            print("[OK] Police Admin Login and Device endpoints passed")
        else:
            print("[INFO] Default policeadmin login status:", login_res.status_code)

if __name__ == '__main__':
    unittest.main()
