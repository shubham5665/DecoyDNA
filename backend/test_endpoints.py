from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)
endpoints = [
    '/api/file-shares/list',
    '/api/dashboard/stats',
    '/api/monitor/status',
    '/api/events/logs?limit=3'
]

for ep in endpoints:
    try:
        r = client.get(ep)
        print(ep, 'status', r.status_code)
        print(r.json())
    except Exception as e:
        print(ep, 'error', str(e))
