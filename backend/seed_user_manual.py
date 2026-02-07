import sqlite3
import os
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed_user():
    db_path = r'c:\Users\cyhnsrgc\Desktop\CSSberlin\backend\cssberlin.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    email = 'seller1@cssberlin.de'
    hashed_password = pwd_context.hash('Seller123!')
    first_name = 'Seller'
    last_name = 'One'
    
    # Check if exists
    cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
    if cursor.fetchone():
        print("User already exists")
    else:
        cursor.execute(
            "INSERT INTO users (email, hashed_password, first_name, last_name, is_active, is_verified) VALUES (?, ?, ?, ?, 1, 1)",
            (email, hashed_password, first_name, last_name)
        )
        conn.commit()
        print(f"User {email} created successfully")
    
    conn.close()

if __name__ == "__main__":
    seed_user()
