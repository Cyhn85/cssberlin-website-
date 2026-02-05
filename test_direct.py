"""
HIZLI TEST - Backend'e CURL ile direkt istek
"""
import http.client
import json

# Manuel HTTP connection
conn = http.client.HTTPConnection("localhost", 8000)
headers = {'Content-Type': 'application/json'}
body = json.dumps({"email": "demo@cssberlin.de", "password": "demo123"})

print("🔥 MANUEL HTTP REQUEST - BYPASSING EVERYTHING")
print(f"Sending to: localhost:8000")
print(f"Path: /api/auth/login")
print(f"Body: {body}\n")

try:
    conn.request("POST", "/api/auth/login", body, headers)
    response = conn.getresponse()
    
    print(f"✅ Status: {response.status}")
    print(f"Headers: {dict(response.getheaders())}")
    
    data = response.read().decode()
    print(f"\n📦 Response Body:")
    print(data)
    
    if response.status == 200:
        print("\n🎉 LOGIN WORKS! Backend is FINE!")
        result = json.loads(data)
        print(f"Token: {result.get('access_token', 'N/A')[:80]}...")
        print(f"User: {result.get('user_name', 'N/A')}")
    else:
        print(f"\n💥 Status {response.status}")
        
except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
finally:
    conn.close()
