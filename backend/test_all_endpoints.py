import urllib.request
import urllib.parse
import urllib.error
import json
from typing import Any, Dict, Tuple, Optional

BASE_URL = "http://127.0.0.1:5001"

def api_call(
    path: str,
    method: str = "GET",
    data: Optional[Dict[str, Any]] = None,
    token: Optional[str] = None
) -> Tuple[int, Dict[str, Any]]:
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    body = None
    if data:
        body = json.dumps(data).encode("utf-8")
        
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            status = resp.status
            content = resp.read().decode("utf-8")
            parsed = json.loads(content)
            return status, parsed if isinstance(parsed, dict) else {"data": parsed}
    except urllib.error.HTTPError as e:
        content = e.read().decode("utf-8")
        try:
            parsed = json.loads(content)
            return e.code, parsed if isinstance(parsed, dict) else {"data": parsed}
        except Exception:
            return e.code, {"error": content}

def run_tests():
    print("==================================================")
    print("     TESTING ALL BACKEND REST API ENDPOINTS       ")
    print("==================================================")
    
    # 1. Health
    status, res = api_call("/api/v1/health")
    print(f"1. Health Check: {status} - {res.get('message')}")
    assert status == 200, "Health check failed"

    # 2. Login
    login_data = {
        "identifier": "sltbadmin",
        "password": "adminpassword"
    }
    status, res = api_call("/api/v1/auth/login", method="POST", data=login_data)
    print(f"2. Auth Login: {status}")
    assert status == 200, f"Login failed: {res}"
    token = res["data"]["token"]
    user = res["data"]["user"]
    print(f"   Logged in as: {user['username']} (Role: {user['role']})")

    # 3. Dashboard Summary
    status, res = api_call("/api/v1/sltb/dashboard/summary", token=token)
    summary_data = res.get('data', {})
    print(f"3. Dashboard Summary: {status} - Total Buses: {summary_data.get('totalBuses', summary_data.get('total_buses'))}, Active Drivers: {summary_data.get('activeDrivers', summary_data.get('active_drivers'))}")
    assert status == 200

    # 4. Bus Management
    status, res = api_call("/api/v1/sltb/buses", token=token)
    buses_list = res.get('data', {}).get('items', [])
    pagination = res.get('data', {}).get('pagination', {})
    total_buses = pagination.get('totalItems', len(buses_list))
    print(f"4. Buses List: {status} - Total in DB = {total_buses}, Page items = {len(buses_list)}")
    assert status == 200 and total_buses > 0

    # 5. Driver Management
    status, res = api_call("/api/v1/sltb/drivers", token=token)
    drivers_list = res.get('data', {}).get('items', [])
    pagination = res.get('data', {}).get('pagination', {})
    total_drivers = pagination.get('totalItems', len(drivers_list))
    print(f"5. Drivers List: {status} - Total in DB = {total_drivers}, Page items = {len(drivers_list)}")
    assert status == 200 and total_drivers > 0

    # 6. Route Management
    status, res = api_call("/api/v1/sltb/routes", token=token)
    routes_list = res.get('data', {}).get('items', [])
    pagination = res.get('data', {}).get('pagination', {})
    total_routes = pagination.get('totalItems', len(routes_list))
    print(f"6. Routes List: {status} - Total in DB = {total_routes}, Page items = {len(routes_list)}")
    assert status == 200 and total_routes > 0

    # 7. Report: Buses
    status, res = api_call("/api/v1/sltb/reports/buses", token=token)
    buses_report = res.get('data', {}).get('items', [])
    pagination = res.get('data', {}).get('pagination', {})
    total_report_buses = pagination.get('totalItems', len(buses_report))
    print(f"7. Report 1 (Buses): {status} - Total records = {total_report_buses}, Current page records = {len(buses_report)}")
    assert status == 200 and total_report_buses > 0

    # 8. Report: Routes
    status, res = api_call("/api/v1/sltb/reports/routes", token=token)
    routes_report = res.get('data', {}).get('items', [])
    pagination = res.get('data', {}).get('pagination', {})
    total_report_routes = pagination.get('totalItems', len(routes_report))
    print(f"8. Report 2 (Routes): {status} - Total records = {total_report_routes}, Current page records = {len(routes_report)}")
    assert status == 200 and total_report_routes > 0

    # 9. Report: Drivers
    status, res = api_call("/api/v1/sltb/reports/drivers", token=token)
    drivers_report = res.get('data', {}).get('items', [])
    pagination = res.get('data', {}).get('pagination', {})
    total_report_drivers = pagination.get('totalItems', len(drivers_report))
    print(f"9. Report 3 (Drivers): {status} - Total records = {total_report_drivers}, Current page records = {len(drivers_report)}")
    assert status == 200 and total_report_drivers > 0

    # 10. Report: Assignment History
    status, res = api_call("/api/v1/sltb/reports/assignment-history", token=token)
    assign_report = res.get('data', {}).get('items', [])
    pagination = res.get('data', {}).get('pagination', {})
    total_report_assign = pagination.get('totalItems', len(assign_report))
    print(f"10. Report 4 (Assignment History): {status} - Total records = {total_report_assign}, Current page records = {len(assign_report)}")
    assert status == 200 and total_report_assign > 0

    # 11. Report: Sensors and Alerts
    status, res = api_call("/api/v1/sltb/reports/sensors-alerts", token=token)
    alerts_report = res.get('data', {}).get('items', [])
    pagination = res.get('data', {}).get('pagination', {})
    total_report_alerts = pagination.get('totalItems', len(alerts_report))
    print(f"11. Report 5 (Sensors & Alerts): {status} - Total records = {total_report_alerts}, Current page records = {len(alerts_report)}")
    assert status == 200

    print("==================================================")
    print("     ALL 11 BACKEND API TESTS VERIFIED!           ")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
