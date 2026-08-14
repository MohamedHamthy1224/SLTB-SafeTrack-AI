import urllib.request
import json

url = "http://127.0.0.1:5001/api/v1/auth/login"
payload = {
    "identifier": "sltbadmin",
    "password": "adminpassword"
}

req = urllib.request.Request(
    url,
    data=json.dumps(payload).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)

try:
    with urllib.request.urlopen(req) as resp:
        print("STATUS CODE:", resp.status)
        print("RESPONSE BODY:", resp.read().decode("utf-8"))
except urllib.error.HTTPError as e:
    print("HTTP ERROR CODE:", e.code)
    print("HTTP ERROR BODY:", e.read().decode("utf-8"))
