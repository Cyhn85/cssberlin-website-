"""Quick login test"""
import requests

API_BASE = "http://localhost:8000"

payload = {
    "email": "demo@cssberlin.de",
    "password": "demo123"
}

print("Testing login endpoint...")
print(f"URL: {API_BASE}/api/auth/login")
print(f"Payload: {payload}")

try:
    r = requests.post(f"{API_BASE}/api/auth/login", json=payload)
    print(f"\nStatus Code: {r.status_code}")
    print(f"Response Headers: {dict(r.headers)}")
    print(f"Response Body: {r.text}")
    
    if r.status_code == 200:
        data = r.json()
        print(f"\n✅ SUCCESS!")
        print(f"Token: {data.get('access_token', 'N/A')[:100]}...")
        print(f"User: {data.get('user_name', 'N/A')}")
    else:
        print(f"\n❌ FAILED with status {r.status_code}")
        try:
            print(f"Error detail: {r.json()}")
        except:
            print("Could not parse JSON error")
except Exception as e:
    print(f"\n❌ EXCEPTION: {e}")
    import traceback
    traceback.print_exc()
