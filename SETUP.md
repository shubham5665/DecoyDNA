# DecoyDNA Setup & Run Guide

This guide explains how to get DecoyDNA running on your local machine (Windows with Python 3.13).

## Prerequisites
- **Python 3.13** installed and in PATH
- **Node.js 18+** (for npm)
- **Git** (for cloning the repo)
- About **2 GB disk space** for dependencies and database

## Quick Start (1 min)

### 1. Backend Setup

```powershell
# Navigate to project root
cd C:\Users\YourName\Downloads\DecoyDNA

# Install Python dependencies (virtualenv already created)
cd backend
.\venv\Scripts\python.exe -m pip install -r requirements.txt
cd ..
```

### 2. Frontend Setup

```powershell
# Install Node dependencies
cd frontend
npm install
cd ..
```

### 3. Start Backend (Port 8001)

```powershell
# Set Python path so app package imports work
$env:PYTHONPATH = "C:\Users\YourName\Downloads\DecoyDNA\backend"

# Start uvicorn
& "C:\Users\YourName\Downloads\DecoyDNA\backend\venv\Scripts\python.exe" `
  -m uvicorn app.main:app --host 127.0.0.1 --port 8001
```

You should see:
```
INFO:     Application startup complete
INFO:     Database initialized
```

### 4. Start Frontend (Port 5174 or 5173)

**Open a new terminal** and run:

```powershell
cd frontend
npm run dev
```

You should see:
```
VITE v5.4.21  ready in XXX ms
Local: http://127.0.0.1:5174/
```

### 5. Open in Browser

Navigate to: **http://127.0.0.1:5174**

## Features to Test

1. **Dashboard** (📊) - View honeyfile statistics and event counts
   - Should show: Total Honeyfiles, Total Events, Alerts Today, Last Hour Events
   - No "Failed to load" messages

2. **Generator** (✏️) - Create honeyfiles
   - Click "Generate Honeyfile", fill form, submit
   - Should show success message and new file in list

3. **File Sharing** (🔗) - Create and manage file shares
   - Click "Create File Share", fill details, submit
   - View and delete shares

4. **Monitoring** (📡) - Start/stop file monitoring
   - Click "Start Monitoring" to activate watchdog
   - Should show monitoring status (Active/Idle)

5. **Logs** (📋) - View access events
   - Shows honeyfile access and modification events
   - Filter by event type, time range, decoy ID

6. **Alerts** (🚨) - Configure notifications
   - Set Slack webhook URL or Email recipients
   - Test alerts with "Test Slack Connection" button

## Database

- **Location**: `decoydna.db` in project root
- **Tables**: honeyfiles, events, alerts, file_shares, share_access_logs
- **Auto-created**: On first backend startup via `init_db()`
- **Reset**: Delete `decoydna.db` to reset everything

## Troubleshooting

### Port Already in Use
```powershell
# Check what's using port 8001
netstat -ano | findstr ":8001"

# Kill the process (replace PID with the actual number)
taskkill /PID 12345 /F

# Try again
```

### PYTHONPATH Issues
Make sure PYTHONPATH is set before running uvicorn:
```powershell
$env:PYTHONPATH = "C:\Users\YourName\Downloads\DecoyDNA\backend"
echo $env:PYTHONPATH  # Verify it's set
```

### "Failed to load" Errors on Frontend
- Verify backend is running on port 8001: `netstat -ano | findstr ":8001"`
- Check backend logs for errors (should see `Application startup complete`)
- Verify `frontend/src/utils/api.js` has correct API_URL: `http://127.0.0.1:8001/api`

### Database Lock Errors
- Close all Python processes: `taskkill /IM python.exe /F`
- Delete `decoydna.db` and restart backend to recreate fresh database

## Running Tests

### API Endpoint Tests (Fast)
```powershell
cd backend
$env:PYTHONPATH = "C:\Users\YourName\Downloads\DecoyDNA\backend"
.\venv\Scripts\python.exe test_endpoints.py
```

Expected output:
```
/api/dashboard/stats status 200
/api/events/logs status 200
/api/monitor/status status 200
/api/file-shares/list status 200
```

### E2E Tests (Requires Running Backend)
```powershell
cd backend
$env:PYTHONPATH = "C:\Users\YourName\Downloads\DecoyDNA\backend"
.\venv\Scripts\python.exe e2e_test.py
```

This tests create/list/delete flows for honeyfiles and file shares.

## Development Notes

### Backend Stack
- **Framework**: FastAPI 0.121.2
- **ORM**: SQLAlchemy 2.0.44 (pinned for Python 3.13 compatibility)
- **Database**: SQLite
- **Validation**: Pydantic 2.12.4
- **Async**: uvicorn 0.38.0

### Frontend Stack
- **Framework**: React 18 + Vite
- **UI**: Tailwind CSS + Framer Motion
- **State**: Zustand
- **HTTP**: Axios
- **Charts**: Recharts

### Key Files
- Backend routes: `backend/app/api/routes.py`
- Services: `backend/app/services/business.py`, `file_sharing.py`
- Models: `backend/app/models/database_models.py`, `file_sharing.py`
- Frontend pages: `frontend/src/pages/*.jsx`
- API client: `frontend/src/utils/api.js`

## GitHub Push Checklist

Before pushing to GitHub:
- [ ] Backend starts without errors: `Application startup complete`
- [ ] Database initializes: `Database initialized`
- [ ] Frontend builds: `npm run build` succeeds
- [ ] All 4 dashboard endpoints return 200:
  - `/api/dashboard/stats`
  - `/api/events/logs`
  - `/api/monitor/status`
  - `/api/file-shares/list`
- [ ] Dashboard page loads in browser without "Failed to load" messages
- [ ] Generator can create a honeyfile
- [ ] File Sharing can create a share
- [ ] Logs page displays without errors

## Support

For issues, check:
1. Backend logs (terminal window running uvicorn)
2. Frontend logs (browser console: F12 → Console tab)
3. Database: `decoydna.db` should exist and be readable
4. Python version: `python --version` should show 3.13.x

---

**Last Updated**: November 2025
