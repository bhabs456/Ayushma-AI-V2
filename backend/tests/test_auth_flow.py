import unittest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import sys
import os

# Set backend path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(backend_dir)

from app.main import app
from app.core.database import Base, get_db

from sqlalchemy.pool import StaticPool

# Use an in-memory SQLite database with StaticPool to maintain tables across connections
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

class TestAuthFlow(unittest.TestCase):
    def setUp(self):
        # Create tables
        Base.metadata.create_all(bind=engine)
        self.client = TestClient(app)

    def tearDown(self):
        # Drop tables
        Base.metadata.drop_all(bind=engine)

    def test_signup_success(self):
        payload = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe@example.com",
            "password": "securepassword",
            "category": "Medical Student",
            "phone_number": "+1234567890"
        }
        res = self.client.post("/auth/signup", json=payload)
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertEqual(data["first_name"], "John")
        self.assertEqual(data["category"], "Medical Student")
        self.assertEqual(data["phone_number"], "+1234567890")
        self.assertIn("created_at", data)
        self.assertNotIn("password", data)

    def test_signup_invalid_category(self):
        payload = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe@example.com",
            "password": "securepassword",
            "category": "Invalid Category"
        }
        res = self.client.post("/auth/signup", json=payload)
        # Validation error since category must match Literal["Medical Student", "Medical Professional", "Common People"]
        self.assertEqual(res.status_code, 422)

    def test_login_success(self):
        # Signup first
        signup_payload = {
            "first_name": "Alice",
            "last_name": "Smith",
            "email": "alice@example.com",
            "password": "password123",
            "category": "Medical Professional"
        }
        self.client.post("/auth/signup", json=signup_payload)

        # Login
        login_payload = {
            "email": "alice@example.com",
            "password": "password123"
        }
        res = self.client.post("/auth/login", json=login_payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("token", data)

        # Access protected route
        token = data["token"]
        headers = {"Authorization": f"Bearer {token}"}
        res_protected = self.client.get("/protected", headers=headers)
        self.assertEqual(res_protected.status_code, 200)
        user_data = res_protected.json()["data"]
        self.assertEqual(user_data["email"], "alice@example.com")
        self.assertEqual(user_data["category"], "Medical Professional")

    def test_login_with_phone_number_success(self):
        # Signup first with email and phone_number
        signup_payload = {
            "first_name": "Bob",
            "last_name": "Marley",
            "email": "bob@example.com",
            "password": "password456",
            "category": "Common People",
            "phone_number": "+919876543210"
        }
        self.client.post("/auth/signup", json=signup_payload)

        # Login using phone_number instead of email
        login_payload = {
            "phone_number": "+919876543210",
            "password": "password456"
        }
        res = self.client.post("/auth/login", json=login_payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("token", data)

        # Access protected route
        token = data["token"]
        headers = {"Authorization": f"Bearer {token}"}
        res_protected = self.client.get("/protected", headers=headers)
        self.assertEqual(res_protected.status_code, 200)
        user_data = res_protected.json()["data"]
        self.assertEqual(user_data["phone_number"], "+919876543210")
        self.assertEqual(user_data["category"], "Common People")

if __name__ == "__main__":
    unittest.main()
