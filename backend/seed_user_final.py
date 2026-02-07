import sqlite3
import hashlib
import os

def get_password_hash(password):
    # This matches the server's auth.py logic
    SECRET_KEY = "css-berlin-secret-key-change-in-production-2024"
    return hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), SECRET_KEY.encode('utf-8'), 100000).hex()

def seed_user():
    db_path = '/var/www/cssberlin/backend/cssberlin.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    email = 'seller1@cssberlin.de'
    hashed_password = get_password_hash('Seller123!')
    first_name = 'Seller'
    last_name = 'One'
    
    cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
    if cursor.fetchone():
        cursor.execute("UPDATE users SET hashed_password = ?, is_verified = 1 WHERE email = ?", (hashed_password, email))
        print(f"User {email} updated with correct hash")
    else:
        cursor.execute(
            "INSERT INTO users (email, hashed_password, first_name, last_name, is_active, is_verified) VALUES (?, ?, ?, ?, 1, 1)",
            (email, hashed_password, first_name, last_name)
        )
        print(f"User {email} created successfully")
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    seed_user()
