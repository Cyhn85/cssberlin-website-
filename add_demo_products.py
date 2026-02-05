"""
CSS Berlin - Demo Ürün Ekleme Scripti
40 demo ürünü API üzerinden ekler
"""
import requests
import random

API_BASE = "http://195.201.146.224:8000"

# Demo kullanıcı bilgileri
USER_EMAIL = "seller1@cssberlin.de"
USER_PASSWORD = "Seller123!"

# Örnek ürün verileri
BRANDS = ["Nike", "Adidas", "Zara", "H&M", "Levi's", "Puma", "Uniqlo", "COS", "Mango", "Patagonia"]
CONDITIONS = ["Neuwertig", "Sehr gut", "Gut", "Gebraucht"]
CATEGORIES = ["Damen", "Herren", "Kinder"]
PREFIXES = ["Vintage", "Eco", "Upcycled", "Klassisch", "Minimal", "Street", "Clean", "Cozy", "Urban", "Retro"]

CATALOG = {
    "Damen": {
        "items": ["Mantel", "Kleid", "Bluse", "Pullover", "Jeans", "Rock", "Sneaker", "Handtasche"],
        "sizes": ["XS", "S", "M", "L", "XL", "OneSize"],
        "colors": ["Schwarz", "Weiß", "Beige", "Blau", "Grün", "Orange", "Rot"]
    },
    "Herren": {
        "items": ["Jacke", "Hoodie", "T-Shirt", "Jeans", "Sneaker", "Hemd", "Pullover"],
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "colors": ["Schwarz", "Weiß", "Grau", "Navy", "Grün", "Orange"]
    },
    "Kinder": {
        "items": ["Jacke", "Pullover", "T-Shirt", "Schuhe", "Rucksack"],
        "sizes": ["92", "104", "116", "128", "140", "152"],
        "colors": ["Blau", "Grün", "Orange", "Pink", "Grau"]
    }
}

# Unsplash fashion images
IMAGES = [
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500",
    "https://images.unsplash.com/photo-1542272454315-7f6f36d69c8d?w=500",
    "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
    "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500",
    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500",
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500"
]

def login(email, password):
    """Login ve token al"""
    resp = requests.post(f"{API_BASE}/api/auth/login", json={
        "email": email,
        "password": password
    })
    if resp.status_code == 200:
        return resp.json().get("access_token")
    else:
        print(f"Login failed: {resp.text}")
        return None

def create_product(token, product_data):
    """API ile ürün oluştur"""
    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.post(f"{API_BASE}/api/products/", json=product_data, headers=headers)
    return resp.status_code == 200, resp.text

def generate_product(n, category):
    """Demo ürün verisi oluştur"""
    cat_data = CATALOG[category]
    item = random.choice(cat_data["items"])
    size = random.choice(cat_data["sizes"])
    color = random.choice(cat_data["colors"])
    brand = random.choice(BRANDS)
    condition = random.choice(CONDITIONS)
    prefix = random.choice(PREFIXES)
    price = round(random.uniform(9.0, 149.0), 2)
    
    return {
        "name": f"{prefix} {brand} {item} #{n:03d}",
        "description": f"{item} in {condition.lower()}em Zustand. Farbe: {color}, Größe: {size}. Schneller Versand aus Berlin. Climate Smart Solutions.",
        "price": price,
        "brand": brand,
        "category": category,
        "condition": condition,
        "size": size,
        "color": color,
        "images": [random.choice(IMAGES)]
    }

def main():
    print("CSS Berlin - Demo Ürün Ekleme")
    print("=" * 40)
    
    # Login
    token = login(USER_EMAIL, USER_PASSWORD)
    if not token:
        print("Login başarısız!")
        return
    
    print(f"✓ Login başarılı: {USER_EMAIL}")
    
    # 40 ürün ekle
    success_count = 0
    for i in range(1, 41):
        category = CATEGORIES[i % 3]
        product = generate_product(i, category)
        
        ok, msg = create_product(token, product)
        if ok:
            success_count += 1
            print(f"✓ Ürün #{i}: {product['name'][:40]}...")
        else:
            print(f"✗ Ürün #{i} başarısız: {msg[:50]}")
    
    print("=" * 40)
    print(f"Toplam: {success_count}/40 ürün eklendi")

if __name__ == "__main__":
    main()
