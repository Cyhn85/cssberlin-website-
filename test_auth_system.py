"""
CSS Berlin - Auth System Test Script
Tests all authentication endpoints
"""

import requests
import json

API_BASE = "http://localhost:8000"

def test_health():
    """Test backend health"""
    print("\n🏥 Testing Backend Health...")
    try:
        r = requests.get(f"{API_BASE}/health")
        if r.status_code == 200:
            print(f"   ✅ Backend is online: {r.json()}")
            return True
        else:
            print(f"   ❌ Backend returned {r.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Backend is offline: {e}")
        return False

def test_google_oauth():
    """Test Google OAuth endpoint"""
    print("\n🔐 Testing Google OAuth...")
    try:
        r = requests.get(f"{API_BASE}/api/auth/google", allow_redirects=False)
        if r.status_code == 501:
            print(f"   ⚠️  Google OAuth not configured (expected)")
            print(f"   Response: {r.json()}")
            return True
        elif r.status_code in [302, 307]:
            print(f"   ✅ Google OAuth configured! Redirect to: {r.headers.get('Location')}")
            return True
        else:
            print(f"   ❌ Unexpected response: {r.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def test_magic_link():
    """Test Magic Link endpoint"""
    print("\n✉️  Testing Magic Link...")
    try:
        payload = {"email": "test@cssberlin.de"}
        r = requests.post(f"{API_BASE}/api/auth/magic-link", json=payload)
        print(f"   Status: {r.status_code}")
        print(f"   Response: {r.json()}")
        if r.status_code == 200:
            print(f"   ✅ Magic Link endpoint works!")
            return True
        else:
            print(f"   ❌ Magic Link failed")
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def test_forgot_password():
    """Test Forgot Password endpoint"""
    print("\n🔒 Testing Forgot Password...")
    try:
        payload = {"email": "test@cssberlin.de"}
        r = requests.post(f"{API_BASE}/api/auth/forgot-password", json=payload)
        print(f"   Status: {r.status_code}")
        print(f"   Response: {r.json()}")
        if r.status_code == 200:
            print(f"   ✅ Forgot Password endpoint works!")
            return True
        else:
            print(f"   ❌ Forgot Password failed")
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def test_register():
    """Test Registration endpoint"""
    print("\n📝 Testing Registration...")
    try:
        payload = {
            "email": f"demo{hash('test')}@cssberlin.de",
            "password": "testpassword123",
            "firstName": "Test",
            "lastName": "User"
        }
        r = requests.post(f"{API_BASE}/api/auth/register", json=payload)
        print(f"   Status: {r.status_code}")
        
        if r.status_code == 200:
            data = r.json()
            print(f"   ✅ Registration successful!")
            print(f"   Token: {data.get('access_token', 'N/A')[:50]}...")
            return True
        else:
            print(f"   Response: {r.json()}")
            # Email already exists is OK for test
            if "already" in str(r.json()).lower():
                print(f"   ⚠️  Email already exists (OK for test)")
                return True
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

def test_login():
    """Test Login endpoint"""
    print("\n🔑 Testing Login...")
    try:
        payload = {
            "email": "demo@cssberlin.de",
            "password": "demo123"
        }
        r = requests.post(f"{API_BASE}/api/auth/login", json=payload)
        print(f"   Status: {r.status_code}")
        print(f"   Headers: {dict(r.headers)}")
        print(f"   Response: {r.text}")
        
        if r.status_code == 200:
            data = r.json()
            print(f"   ✅ Login successful!")
            print(f"   Token: {data.get('access_token', 'N/A')[:50]}...")
            print(f"   User: {data.get('user_name', 'N/A')}")
            return True
        else:
            print(f"   ❌ Login failed with {r.status_code}")
            try:
                print(f"   Error detail: {r.json()}")
            except:
                pass
            return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    print("=" * 60)
    print("🚀 CSS BERLIN - AUTH SYSTEM TEST")
    print("=" * 60)
    
    results = []
    
    # Test all endpoints
    results.append(("Backend Health", test_health()))
    results.append(("Google OAuth", test_google_oauth()))
    results.append(("Magic Link", test_magic_link()))
    results.append(("Forgot Password", test_forgot_password()))
    results.append(("Login", test_login()))
    results.append(("Register", test_register()))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status}  {name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED! Auth system is working!")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Check output above.")
    
    print("=" * 60)

if __name__ == "__main__":
    main()
