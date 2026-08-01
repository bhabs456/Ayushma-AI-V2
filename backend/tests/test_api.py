import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    """Verify backend server health endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert "model" in response.json()

def test_chat_valid_query():
    """Verify standard medical query returns response + valid page citations."""
    payload = {"message": "What are common symptoms of fever?"}
    response = client.post("/api/chat", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    
    # Assert output structure
    assert "response" in data
    assert "citations" in data
    assert isinstance(data["citations"], list)
    assert len(data["response"]) > 0
    assert len(data["citations"]) > 0
    
    # Verify citation structure
    assert "page" in data["citations"][0]
    assert "snippet" in data["citations"][0]
    print(f"\n[PASSED] RAG Response: {data['response']}")
    print(f"[PASSED] Citation Page: {data['citations'][0]['page']}")

def test_chat_empty_input_vulnerability():
    """Verify empty/spaces-only input is rejected safely with 400."""
    payload = {"message": "   "}
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 400
    assert response.json()["detail"] == "Message cannot be empty."

def test_chat_missing_payload_vulnerability():
    """Verify malformed JSON payload is rejected safely by Pydantic validation."""
    payload = {}
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 422  # Unprocessable Entity