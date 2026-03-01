import uuid

from fastapi.testclient import TestClient

from app.main import app


def test_register_user_success(monkeypatch):
    monkeypatch.setattr('app.api.routes.hash_password', lambda _: 'hashed-test-password')

    client = TestClient(app)
    email = f"new-user-{uuid.uuid4().hex[:8]}@example.com"
    payload = {
        'email': email,
        'password': 'newuser123',
        'role': 'user',
        'industry': 'general',
    }
    response = client.post('/api/auth/register', json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data['email'] == payload['email']
    assert data['role'] == payload['role']
    assert data['industry'] == payload['industry']
