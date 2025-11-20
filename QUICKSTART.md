# 🚀 DecoyDNA Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Prerequisites Check
```bash
# Check Python
python --version    # Should be 3.11+

# Check Node
node --version      # Should be 18+
npm --version
```

### Step 2: Automated Setup (Recommended)

**Windows**:
```bash
# Run setup script
.\setup.bat
```

**Linux/macOS**:
```bash
# Run setup script
chmod +x setup.sh
./setup.sh
```

### Step 3: Manual Setup (If Needed)

**Backend Setup**:
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend
python -m uvicorn app.main:app --reload
```

Backend runs on: **http://127.0.0.1:8000**

**Frontend Setup** (New Terminal):
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs on: **http://127.0.0.1:5173**

---

## 🎮 Using DecoyDNA

### 1. Create Your First Honeyfile

**Via Web Dashboard**:
1. Navigate to **Generator** page
2. Fill in the form:
   - File Name: `passwords.docx`
   - File Type: `Word Document`
   - Template: `Corporate Passwords`
3. Click **Generate Honeyfile**
4. File appears in list with Decoy ID

**Via API**:
```bash
curl -X POST "http://127.0.0.1:8000/api/honeyfiles/create" \
  -H "Content-Type: application/json" \
  -d '{
    "file_name": "passwords.docx",
    "file_type": "docx",
    "template_type": "passwords",
    "seed_locations": ["/home/user/Documents"]
  }'
```

### 2. Start Monitoring

**Via Web Dashboard**:
1. Go to **Monitoring** page
2. Click **Start Monitoring**
3. Watch for green indicator showing "ACTIVELY MONITORING"

**Via API**:
```bash
curl -X POST "http://127.0.0.1:8000/api/monitor/start"
```

### 3. Configure Alerts

**Via Web Dashboard**:
1. Go to **Alerts** page
2. Add Slack webhook or Email recipients
3. Click **Save All Settings**
4. Click **Test Slack Connection** to verify

**Environment Variables** (Optional):
```bash
# .env file in backend directory
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
EMAIL_FROM=decoydna@company.com
EMAIL_SMTP_SERVER=smtp.gmail.com
EMAIL_SMTP_USER=your-email@gmail.com
EMAIL_SMTP_PASSWORD=your-app-password
```

### 4. Test the System

**Option A: Manual Access**
1. Open the generated honeyfile from your Documents folder
2. This triggers an event
3. Check Dashboard for the event

**Option B: Send Test Alert**
```bash
curl -X POST "http://127.0.0.1:8000/api/alerts/test?alert_type=slack"
```

### 5. View Events

- **Dashboard**: Real-time overview
- **Timeline**: Chronological view with forensics
- **Logs**: Detailed searchable table

---

## 📊 Dashboard Pages

### Dashboard
- Real-time stats and metrics
- Recent access events
- Monitoring status
- Event distribution charts

### Generator
- Create new honeyfiles
- View all generated files
- See file metadata and locations

### Monitoring
- Start/Stop monitoring engine
- View watched directories
- System information
- Forensic collection status

### Timeline
- Chronological event view
- Forensic details for each event
- Visual timeline with emojis
- Event filtering

### Alerts
- Configure Slack webhook
- Set email recipients
- Test connections
- View integration info

### Logs
- Searchable event logs
- Filter by decoy ID, type, time
- Expandable row details
- Export functionality

---

## 🔧 Configuration

### Backend Settings (app/config/settings.py)
```python
# Database
DATABASE_URL = "sqlite:///./decoydna.db"

# Monitoring
MONITORED_DIRECTORIES = [
    "/home/user/Documents",
    "/home/user/Desktop",
]

# API
API_HOST = "127.0.0.1"
API_PORT = 8000
```

### Frontend API (src/utils/api.js)
```javascript
const API_URL = 'http://127.0.0.1:8000/api'
```

---

## 📁 Important Directories

```
~/.decoydna/
├── honeyfiles/      # Generated decoy files
└── forensics/       # Forensic logs
```

---

## 🧪 Testing Commands

### Create Test Honeyfile
```bash
curl -X POST "http://127.0.0.1:8000/api/honeyfiles/create" \
  -H "Content-Type: application/json" \
  -d '{
    "file_name": "test_file.xlsx",
    "file_type": "xlsx",
    "template_type": "salaries"
  }'
```

### Get All Honeyfiles
```bash
curl "http://127.0.0.1:8000/api/honeyfiles/list"
```

### Get Dashboard Stats
```bash
curl "http://127.0.0.1:8000/api/dashboard/stats"
```

### Start Monitoring
```bash
curl -X POST "http://127.0.0.1:8000/api/monitor/start"
```

### Check Status
```bash
curl "http://127.0.0.1:8000/api/monitor/status"
```

### Get Events
```bash
curl "http://127.0.0.1:8000/api/events/logs"
```

### Test Slack Alert
```bash
curl -X POST "http://127.0.0.1:8000/api/alerts/test?alert_type=slack"
```

---

## ⚠️ Troubleshooting

### Backend Won't Start
```bash
# Check if port 8000 is in use
# Linux/macOS: lsof -i :8000
# Windows: netstat -ano | findstr :8000

# Kill process and restart or use different port
# In main.py: uvicorn.run(..., port=8001)
```

### Database Locked
```bash
# Delete database and restart (loses data)
rm decoydna.db
python -m uvicorn app.main:app --reload
```

### Missing Dependencies
```bash
# Reinstall all requirements
pip install -r requirements.txt --force-reinstall
```

### Frontend WebSocket Error
1. Ensure backend is running
2. Check API_URL in src/utils/api.js
3. Check firewall/proxy settings

### Monitoring Not Detecting Events
1. Ensure honeyfiles are in monitored directories
2. Check monitoring status: GET /api/monitor/status
3. Verify file permissions

---

## 📚 Documentation

- **README.md**: Complete project documentation
- **API_DOCS.md**: Detailed API reference
- **Backend Code**: Well-commented Python code
- **Frontend Code**: Well-documented React components

---

## 🔐 Security Notes

1. **Slack Webhook**: Store in environment variables, never commit
2. **Email Password**: Use app-specific passwords
3. **Database**: Restrict file permissions on decoydna.db
4. **Monitoring**: Only monitor necessary directories
5. **API**: For production, add authentication/authorization

---

## 🚀 Next Steps

1. ✅ Start backend and frontend
2. ✅ Create a test honeyfile
3. ✅ Start monitoring
4. ✅ Configure alerts
5. ✅ Manually trigger an event by opening a honeyfile
6. ✅ Verify event appears in Dashboard
7. ✅ Check that alert was sent
8. ✅ Explore other pages (Timeline, Logs, etc.)

---

## 📞 Support

For detailed information:
- Check README.md for architecture overview
- Review API_DOCS.md for API examples
- Inspect code comments for implementation details
- Check browser console for frontend errors
- Check terminal for backend logs

---

## 🎉 You're Ready!

Your DecoyDNA system is now set up and ready to protect your organization!

**Dashboard**: http://127.0.0.1:5173
**API Docs**: http://127.0.0.1:8000/docs
**API Health**: http://127.0.0.1:8000/api/health

---

**Version**: 1.0.0
**Last Updated**: November 17, 2024
