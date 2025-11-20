# DecoyDNA API Documentation & Examples

## Overview

DecoyDNA provides a comprehensive REST API and WebSocket interface for managing honeyfiles, monitoring file access, collecting forensics, and managing alerts.

**Base URL**: `http://127.0.0.1:8000`
**WebSocket URL**: `ws://127.0.0.1:8000`

## Authentication

Currently, no authentication is required. For production deployment, implement JWT or OAuth2.

## Content Types

- **Request**: `application/json`
- **Response**: `application/json`

---

## 📡 Honeyfiles API

### Create Honeyfile

Create a new honeyfile with specified content and watermarking.

**Endpoint**: `POST /api/honeyfiles/create`

**Request**:
```json
{
  "file_name": "passwords.docx",
  "file_type": "docx",
  "template_type": "passwords",
  "seed_locations": [
    "/home/user/Documents",
    "/home/user/Desktop"
  ]
}
```

**Parameters**:
- `file_name` (string, optional): Name of the file. Auto-generated if omitted.
- `file_type` (string, required): "docx", "xlsx", or "pdf"
- `template_type` (string, required): "passwords", "salaries", or "project_secrets"
- `seed_locations` (array, optional): Directories to plant the file

**Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "decoy_id": "f47ac10b58cc4372a5670e4a6e8a084e",
  "file_name": "passwords.docx",
  "file_type": "docx",
  "template_type": "passwords",
  "created_at": "2024-11-17T10:30:00Z",
  "expected_hash": "sha256hash...",
  "file_path": "/home/user/.decoydna/honeyfiles/passwords.docx"
}
```

**cURL Example**:
```bash
curl -X POST "http://127.0.0.1:8000/api/honeyfiles/create" \
  -H "Content-Type: application/json" \
  -d '{
    "file_name": "salaries_2024.xlsx",
    "file_type": "xlsx",
    "template_type": "salaries",
    "seed_locations": ["/home/user/Documents"]
  }'
```

---

### List Honeyfiles

Retrieve all generated honeyfiles.

**Endpoint**: `GET /api/honeyfiles/list`

**Query Parameters**:
- `skip` (integer, default: 0): Offset for pagination
- `limit` (integer, default: 100): Maximum results to return

**Response** (200 OK):
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "decoy_id": "f47ac10b58cc4372a5670e4a6e8a084e",
    "file_name": "passwords.docx",
    "file_type": "docx",
    "template_type": "passwords",
    "created_at": "2024-11-17T10:30:00Z",
    "expected_hash": "sha256hash...",
    "file_path": "/home/user/.decoydna/honeyfiles/passwords.docx"
  }
]
```

**cURL Example**:
```bash
curl "http://127.0.0.1:8000/api/honeyfiles/list?skip=0&limit=50"
```

---

### Get Honeyfile by ID

Retrieve details of a specific honeyfile.

**Endpoint**: `GET /api/honeyfiles/{decoy_id}`

**Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "decoy_id": "f47ac10b58cc4372a5670e4a6e8a084e",
  "file_name": "passwords.docx",
  "file_type": "docx",
  "template_type": "passwords",
  "created_at": "2024-11-17T10:30:00Z",
  "expected_hash": "sha256hash...",
  "file_path": "/home/user/.decoydna/honeyfiles/passwords.docx"
}
```

**cURL Example**:
```bash
curl "http://127.0.0.1:8000/api/honeyfiles/f47ac10b58cc4372a5670e4a6e8a084e"
```

---

## 📊 Events API

### Get Event Logs

Retrieve access events with optional filtering.

**Endpoint**: `GET /api/events/logs`

**Query Parameters**:
- `skip` (integer, default: 0): Offset for pagination
- `limit` (integer, default: 100): Maximum results
- `decoy_id` (string, optional): Filter by specific decoy ID
- `hours` (integer, default: 24): Time range in hours

**Response** (200 OK):
```json
[
  {
    "id": "650e8400-e29b-41d4-a716-446655440000",
    "decoy_id": "f47ac10b58cc4372a5670e4a6e8a084e",
    "event_type": "accessed",
    "timestamp": "2024-11-17T14:25:30Z",
    "accessed_path": "/home/user/Documents/passwords.docx",
    "username": "admin",
    "hostname": "WORKSTATION-01",
    "process_name": "explorer.exe",
    "process_command": "explorer.exe /n,/select,C:\\...",
    "internal_ip": "192.168.1.100",
    "mac_address": "00:1A:2B:3C:4D:5E"
  }
]
```

**cURL Examples**:
```bash
# Get last 24 hours of events
curl "http://127.0.0.1:8000/api/events/logs"

# Get events for specific decoy
curl "http://127.0.0.1:8000/api/events/logs?decoy_id=f47ac10b58cc4372a5670e4a6e8a084e"

# Get last 7 days
curl "http://127.0.0.1:8000/api/events/logs?hours=168&limit=200"
```

---

### Get Event Count

Get count of events in time period.

**Endpoint**: `GET /api/events/count`

**Query Parameters**:
- `decoy_id` (string, optional): Filter by decoy ID

**Response** (200 OK):
```json
{
  "count": 42,
  "period": "24_hours"
}
```

**cURL Example**:
```bash
curl "http://127.0.0.1:8000/api/events/count"
```

---

### WebSocket Real-Time Events

Connect to WebSocket for real-time event streaming.

**Endpoint**: `WS /api/ws/events`

**Message Format**:
```json
{
  "event_type": "file_access",
  "timestamp": "2024-11-17T14:25:30Z",
  "severity": "critical",
  "data": {
    "decoy_id": "f47ac10b58cc4372a5670e4a6e8a084e",
    "event_type": "modified",
    "accessed_path": "/home/user/Documents/passwords.docx",
    "username": "admin",
    "hostname": "WORKSTATION-01",
    "process_name": "notepad.exe"
  }
}
```

**JavaScript Example**:
```javascript
const ws = new WebSocket('ws://127.0.0.1:8000/api/ws/events');

ws.onopen = () => {
  console.log('Connected to event stream');
  ws.send('ping');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('New event:', data);
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};
```

---

## 📡 Monitoring API

### Start Monitoring

Start the file monitoring engine.

**Endpoint**: `POST /api/monitor/start`

**Request** (optional):
```json
{
  "directories": [
    "/home/user/Documents",
    "/home/user/Desktop"
  ]
}
```

**Response** (200 OK):
```json
{
  "status": "started",
  "timestamp": "2024-11-17T10:30:00Z",
  "honeyfiles_registered": 5
}
```

**cURL Example**:
```bash
curl -X POST "http://127.0.0.1:8000/api/monitor/start"
```

---

### Stop Monitoring

Stop the file monitoring engine.

**Endpoint**: `POST /api/monitor/stop`

**Response** (200 OK):
```json
{
  "status": "stopped"
}
```

**cURL Example**:
```bash
curl -X POST "http://127.0.0.1:8000/api/monitor/stop"
```

---

### Get Monitoring Status

Get current monitoring status and statistics.

**Endpoint**: `GET /api/monitor/status`

**Response** (200 OK):
```json
{
  "is_running": true,
  "started_at": "2024-11-17T10:30:00Z",
  "total_events": 42,
  "error_count": 0
}
```

**cURL Example**:
```bash
curl "http://127.0.0.1:8000/api/monitor/status"
```

---

## 🚨 Alerts API

### Get Alert Settings

Retrieve current alert configuration.

**Endpoint**: `GET /api/alerts/settings`

**Response** (200 OK):
```json
{
  "slack": {
    "id": "750e8400-e29b-41d4-a716-446655440000",
    "enabled": true,
    "config": {
      "webhook_url": "https://hooks.slack.com/..."
    }
  },
  "email": {
    "id": "850e8400-e29b-41d4-a716-446655440000",
    "enabled": true,
    "config": {
      "recipients": ["admin@company.com", "security@company.com"]
    }
  }
}
```

**cURL Example**:
```bash
curl "http://127.0.0.1:8000/api/alerts/settings"
```

---

### Update Alert Settings

Update alert configuration.

**Endpoint**: `POST /api/alerts/settings`

**Request**:
```json
{
  "alert_type": "slack",
  "enabled": true,
  "config": {
    "webhook_url": "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
  }
}
```

**Response** (200 OK):
```json
{
  "id": "750e8400-e29b-41d4-a716-446655440000",
  "alert_type": "slack",
  "enabled": true,
  "config": {
    "webhook_url": "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
  }
}
```

**cURL Example**:
```bash
curl -X POST "http://127.0.0.1:8000/api/alerts/settings" \
  -H "Content-Type: application/json" \
  -d '{
    "alert_type": "email",
    "enabled": true,
    "config": {
      "recipients": ["admin@company.com"]
    }
  }'
```

---

### Test Alert

Send a test alert.

**Endpoint**: `POST /api/alerts/test`

**Query Parameters**:
- `alert_type` (string, required): "slack" or "email"

**Response** (200 OK):
```json
{
  "test_sent": {
    "slack": true,
    "email": true
  }
}
```

**cURL Example**:
```bash
curl -X POST "http://127.0.0.1:8000/api/alerts/test?alert_type=slack"
```

---

## 📊 Dashboard API

### Get Dashboard Statistics

Retrieve dashboard statistics.

**Endpoint**: `GET /api/dashboard/stats`

**Response** (200 OK):
```json
{
  "total_honeyfiles": 15,
  "total_events": 342,
  "alerts_today": 8,
  "monitoring_status": true,
  "events_last_hour": 3
}
```

**cURL Example**:
```bash
curl "http://127.0.0.1:8000/api/dashboard/stats"
```

---

## 🏥 Health Check

### System Health

Check system health status.

**Endpoint**: `GET /api/health`

**Response** (200 OK):
```json
{
  "status": "healthy",
  "service": "DecoyDNA API",
  "version": "1.0.0"
}
```

**cURL Example**:
```bash
curl "http://127.0.0.1:8000/api/health"
```

---

## Error Handling

All errors follow standard HTTP status codes:

- **200 OK**: Successful request
- **400 Bad Request**: Invalid parameters
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

Error Response Format:
```json
{
  "detail": "Error message describing what went wrong"
}
```

---

## Rate Limiting

No rate limiting is currently implemented. For production, implement appropriate rate limiting.

---

## Examples

### Complete Workflow

```bash
#!/bin/bash

# 1. Create a honeyfile
echo "Creating honeyfile..."
RESPONSE=$(curl -s -X POST "http://127.0.0.1:8000/api/honeyfiles/create" \
  -H "Content-Type: application/json" \
  -d '{
    "file_name": "secret_project.pdf",
    "file_type": "pdf",
    "template_type": "project_secrets",
    "seed_locations": ["/home/user/Documents"]
  }')

DECOY_ID=$(echo $RESPONSE | grep -o '"decoy_id":"[^"]*' | cut -d'"' -f4)
echo "Created honeyfile with ID: $DECOY_ID"

# 2. Start monitoring
echo "Starting monitoring..."
curl -s -X POST "http://127.0.0.1:8000/api/monitor/start"

# 3. Check monitoring status
echo "Checking status..."
curl -s "http://127.0.0.1:8000/api/monitor/status" | json_pp

# 4. Configure alerts
echo "Configuring Slack alerts..."
curl -s -X POST "http://127.0.0.1:8000/api/alerts/settings" \
  -H "Content-Type: application/json" \
  -d '{
    "alert_type": "slack",
    "enabled": true,
    "config": {
      "webhook_url": "https://hooks.slack.com/services/..."
    }
  }'

# 5. Test alert
echo "Testing alert..."
curl -s -X POST "http://127.0.0.1:8000/api/alerts/test?alert_type=slack"

# 6. Get stats
echo "Dashboard stats:"
curl -s "http://127.0.0.1:8000/api/dashboard/stats" | json_pp
```

---

## Integration Examples

### Python Client
```python
import requests

API_URL = "http://127.0.0.1:8000/api"

# Create honeyfile
response = requests.post(f"{API_URL}/honeyfiles/create", json={
    "file_name": "passwords.docx",
    "file_type": "docx",
    "template_type": "passwords",
    "seed_locations": ["/home/user/Documents"]
})

honeyfile = response.json()
print(f"Created: {honeyfile['decoy_id']}")

# Get dashboard stats
stats = requests.get(f"{API_URL}/dashboard/stats").json()
print(f"Total events: {stats['total_events']}")
```

### JavaScript Fetch
```javascript
const API_URL = "http://127.0.0.1:8000/api";

// Create honeyfile
const response = await fetch(`${API_URL}/honeyfiles/create`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    file_name: "passwords.docx",
    file_type: "docx",
    template_type: "passwords",
    seed_locations: ["/home/user/Documents"]
  })
});

const honeyfile = await response.json();
console.log(`Created: ${honeyfile.decoy_id}`);
```

---

**Last Updated**: November 17, 2024
**API Version**: 1.0.0
