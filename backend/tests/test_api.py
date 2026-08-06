import requests
import json

BASE_URL = "http://localhost:8000"

def test_health_check():
    print("\n1. Testing GET / (Health Check)...")
    try:
        res = requests.get(f"{BASE_URL}/")
        print(f"Status Code: {res.status_code}")
        print(json.dumps(res.json(), indent=2))
    except Exception as e:
        print(f"❌ Failed: Make sure your uvicorn server is running on port 8000. Error: {e}")

def test_get_documents():
    print("\n2. Testing GET /api/documents...")
    try:
        res = requests.get(f"{BASE_URL}/api/documents")
        print(f"Status Code: {res.status_code}")
        print(json.dumps(res.json(), indent=2))
    except Exception as e:
        print(f"❌ Failed: {e}")

def test_conversational_flow():
    print("\n3. Testing Multi-turn Chat & Topic Shift Flow (POST /api/chat)...")
    headers = {"Content-Type": "application/json"}
    history = []

    # --- Turn 1: Initial Question (Asthma) ---
    q1 = "What is the first-line medication for severe asthma exacerbation?"
    print(f"\nUser: {q1}")
    try:
        res1 = requests.post(f"{BASE_URL}/api/chat", headers=headers, json={"message": q1, "history": history})
        data1 = res1.json()
        print(f"Ayushman AI (Citations: {len(data1.get('citations', []))}): \n{data1.get('response')}")
        
        # Save to history
        history.append({"sender": "user", "content": q1})
        history.append({"sender": "ai", "content": data1.get("response", "")})
    except Exception as e:
        print(f"❌ Turn 1 Failed: {e}")
        return

    # --- Turn 2: Follow-up 1 (Dosage of "it") ---
    q2 = "What is its recommended dosage?"
    print(f"\nUser: {q2}")
    try:
        res2 = requests.post(f"{BASE_URL}/api/chat", headers=headers, json={"message": q2, "history": history})
        data2 = res2.json()
        print(f"Ayushman AI (Citations: {len(data2.get('citations', []))}): \n{data2.get('response')}")
        
        # Save to history
        history.append({"sender": "user", "content": q2})
        history.append({"sender": "ai", "content": data2.get("response", "")})
    except Exception as e:
        print(f"❌ Turn 2 Failed: {e}")
        return

    # --- Turn 3: Follow-up 2 (Side effects of "it") ---
    q3 = "Are there any side effects of it?"
    print(f"\nUser: {q3}")
    try:
        res3 = requests.post(f"{BASE_URL}/api/chat", headers=headers, json={"message": q3, "history": history})
        data3 = res3.json()
        print(f"Ayushman AI (Citations: {len(data3.get('citations', []))}): \n{data3.get('response')}")
        
        # Save to history
        history.append({"sender": "user", "content": q3})
        history.append({"sender": "ai", "content": data3.get("response", "")})
    except Exception as e:
        print(f"❌ Turn 3 Failed: {e}")
        return

    # --- Turn 4: Topic Shift (Burns) ---
    q4 = "What about a severe first-degree burn?"
    print(f"\nUser: {q4}")
    try:
        res4 = requests.post(f"{BASE_URL}/api/chat", headers=headers, json={"message": q4, "history": history})
        data4 = res4.json()
        print(f"Ayushman AI (Citations: {len(data4.get('citations', []))}): \n{data4.get('response')}")
        
        # Save to history
        history.append({"sender": "user", "content": q4})
        history.append({"sender": "ai", "content": data4.get("response", "")})
    except Exception as e:
        print(f"❌ Turn 4 Failed: {e}")
        return

    # --- Turn 5: Follow-up after Topic Shift (First aid for "it") ---
    q5 = "How should I perform first aid on it?"
    print(f"\nUser: {q5}")
    try:
        res5 = requests.post(f"{BASE_URL}/api/chat", headers=headers, json={"message": q5, "history": history})
        data5 = res5.json()
        print(f"Ayushman AI (Citations: {len(data5.get('citations', []))}): \n{data5.get('response')}")
    except Exception as e:
        print(f"❌ Turn 5 Failed: {e}")

if __name__ == "__main__":
    print("🧪 Running Uvicorn API Server Test Suite...")
    print("=" * 60)
    test_health_check()
    test_get_documents()
    test_conversational_flow()
    print("\n" + "=" * 60)