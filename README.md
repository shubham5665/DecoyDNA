# 🧬 DecoyDNA - Enterprise Honeyfile & Forensic Monitoring System

**An advanced, production-ready cybersecurity platform for detecting insider threats through realistic decoy files with invisible watermarks, real-time monitoring, and forensic analysis.**

## 🎯 Features

### 🍯 Honeyfile Generation Engine
- **Multi-Format Support**: Generate realistic .docx, .xlsx, and .pdf decoy files
- **Advanced Watermarking Techniques**:
  - Hidden metadata fields (title, subject, author, comments)
  - Zero-width Unicode characters for undetectable tracking
  - Invisible text layers and hidden rows/columns
  - Excel sheet protection and hidden markers
  - PDF embedded metadata and XMP encoding
- **Realistic Content Templates**:
  - Corporate Password Vaults
  - Salary Reports
  - Project Secrets & Technical Specifications
- **SHA256 Hashing** for file integrity verification
- **Decoy ID Generation** for unique file tracking

### 📡 Real-Time File Monitoring
- **Watchdog-Based Monitoring**: Detect file system events instantly
- **Forensic Data Collection**:
  - Timestamp, event type (read, copy, move, open, execute)
  - Username, hostname, internal IP, MAC address
  - Process name, command line, file hash
  - Complete system context
- **Multiple Watch Directories**: Monitor multiple locations simultaneously
- **Event Queuing & Async Processing** for reliability
- **WebSocket Real-Time Streaming** to frontend

### 🚨 Multi-Channel Alert System
- **Slack Integration**: Instant notifications with rich formatting
- **Email Alerts**: Comprehensive HTML-formatted reports
- **Async Execution**: Non-blocking alert delivery
- **Test Functionality**: Verify alert connectivity
- **Configurable Recipients**: Multiple recipients and channels

### 📊 Web Dashboard (Dark Theme + Advanced Animations)
- **Real-Time Statistics**: Live event counts, honeyfile status
- **Event Timeline**: Chronological forensic visualization
- **Interactive Charts**: Event distribution, trends
- **Dark Mode**: Professional cyberpunk aesthetic
- **Smooth Animations**: Framer Motion effects
  - Fade-in/slide transitions
  - Hover scaling and glow effects
  - Staggered list reveals
  - Pulse animations on alerts
  - Glassmorphism cards with neon borders

### 🔍 Forensic Analysis Tools
- **Comprehensive Event Logging**: Full forensic context for each access
- **Advanced Filtering**: Search by decoy ID, event type, time range
- **Event Details Modal**: Expandable rows with full forensic data
- **Timeline View**: Visual event chronology
- **Export Capabilities**: Download forensic reports

## 📁 Project Structure

```
DecoyDNA/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI application entry point
│   │   ├── api/
│   │   │   └── routes.py           # All API endpoints & WebSocket
│   │   ├── services/
│   │   │   └── business.py         # Business logic layer
│   │   ├── models/
│   │   │   ├── database_models.py  # SQLAlchemy ORM models
│   │   │   └── schemas.py          # Pydantic request/response schemas
│   │   ├── db/
│   │   │   └── database.py         # Database connection & initialization
│   │   ├── honeyfiles/
│   │   │   └── generator.py        # Honeyfile generation engine
│   │   ├── monitoring/
│   │   │   └── engine.py           # Watchdog file monitoring
│   │   ├── alerts/
│   │   │   └── handlers.py         # Slack & Email alert handlers
│   │   ├── utils/
│   │   │   └── crypto.py           # Hashing, watermarking, forensics
│   │   ├── config/
│   │   │   └── settings.py         # Configuration management
│   │   └── forensic/               # Forensic analysis tools
│   └── requirements.txt            # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx                # React entry point
│   │   ├── App.jsx                 # Main app with routing & layout
│   │   ├── index.css               # Global styles with Tailwind
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Real-time dashboard
│   │   │   ├── Generator.jsx       # Honeyfile creation
│   │   │   ├── Monitoring.jsx      # Monitoring engine control
│   │   │   ├── Timeline.jsx        # Forensic timeline
│   │   │   ├── Alerts.jsx          # Alert configuration
│   │   │   └── Logs.jsx            # Event log viewer
│   │   ├── components/
│   │   │   └── Common.jsx          # Reusable components
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── utils/
│   │   │   ├── api.js              # API client functions
│   │   │   ├── helpers.js          # Utility functions
│   │   │   └── store.js            # Zustand state management
│   │   └── public/                 # Static assets
│   ├── package.json                # Node dependencies
│   ├── vite.config.js              # Vite configuration
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   ├── postcss.config.js           # PostCSS configuration
│   ├── index.html                  # HTML entry point
│   └── tsconfig.json               # TypeScript configuration
│
└── README.md                       # This file
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.11+** (for backend)
- **Node.js 18+** (for frontend)
- **pip** (Python package manager)
- **npm** (Node package manager)

### 1️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate Python virtual environment
python -m venv venv
.\venv\Scripts\activate     # Windows
source venv/bin/activate    # Linux/macOS

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

The API will be available at: **http://127.0.0.1:8000**
- Swagger UI: http://127.0.0.1:8000/docs
- OpenAPI Schema: http://127.0.0.1:8000/openapi.json

### 2️⃣ Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start development server
npm run dev
```

The dashboard will be available at: **http://127.0.0.1:5173**

### 3️⃣ Using the System

#### Create Honeyfiles
1. Go to **Generator** page
2. Fill in file details (name, type, template)
3. Click "Generate Honeyfile"
4. Files are automatically saved to `~/.decoydna/honeyfiles/`

#### Start Monitoring
1. Go to **Monitoring** page
2. Click "Start Monitoring"
3. Monitoring engine watches all honeyfile directories
4. Events appear in real-time on Dashboard

#### Configure Alerts
1. Go to **Alerts** page
2. Configure Slack webhook or Email recipients
3. Test connections with "Test" buttons
4. Save settings

#### View Events
- **Dashboard**: Real-time overview and recent events
- **Timeline**: Chronological view with forensic details
- **Logs**: Searchable, filterable table with expandable rows

## 📡 API Endpoints

### Honeyfiles
```
POST   /api/honeyfiles/create      - Create new honeyfile
GET    /api/honeyfiles/list        - List all honeyfiles
GET    /api/honeyfiles/{decoy_id}  - Get specific honeyfile
```

### Events
```
GET    /api/events/logs            - Get access event logs (filterable)
GET    /api/events/count           - Get event count
WS     /api/ws/events              - WebSocket for real-time events
```

### Monitoring
```
POST   /api/monitor/start          - Start monitoring
POST   /api/monitor/stop           - Stop monitoring
GET    /api/monitor/status         - Get monitoring status
```

### Alerts
```
GET    /api/alerts/settings        - Get alert settings
POST   /api/alerts/settings        - Update alert settings
POST   /api/alerts/test            - Test alert delivery
```

### Dashboard
```
GET    /api/dashboard/stats        - Get dashboard statistics
```

## 🔧 Configuration

### Backend Environment Variables
Create a `.env` file in the backend directory:

```bash
# Slack Configuration
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Email Configuration
EMAIL_FROM=decoydna@enterprise.com
EMAIL_SMTP_SERVER=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USER=your-email@gmail.com
EMAIL_SMTP_PASSWORD=your-app-password

# API Configuration
API_HOST=127.0.0.1
API_PORT=8000
API_DEBUG=true
```

### Database
- **SQLite** database at: `./decoydna.db`
- **Tables**: `honeyfiles`, `access_events`, `alert_settings`, `monitoring_status`
- Automatically initialized on first run

## 🎨 Frontend Features

### Dark Theme Colors
- **Primary Blue**: `#00f0ff` (Cyber Blue)
- **Primary Green**: `#57ff9a` (Cyber Green)
- **Primary Purple**: `#8b5cf6` (Cyber Purple)
- **Background**: `#0a0e27` (Dark)
- **Card Background**: `#1a1f3a` (Dark Gray)

### Animations
- Smooth fade-in transitions
- Slide animations on page load
- Hover scaling effects
- Staggered list reveals
- Glowing pulse effects on alerts
- Shimmer loading animations
- Glassmorphism cards with backdrop blur
- Animated gradient headers

## 🔐 Security Features

### Watermarking Techniques
1. **Hidden Metadata**: Title, subject, author, comments in document properties
2. **Zero-Width Unicode**: Invisible characters embedded in text
3. **Hidden Layers**: Invisible text runs and hidden worksheet rows
4. **File Hashing**: SHA256 verification for file integrity
5. **Cell Comments**: Hidden forensic markers in spreadsheets

### Forensic Collection
- Complete system context capture
- Process-level information
- Network interface details (IP, MAC)
- File access patterns
- Event timestamp precision
- Command line arguments

### Event Storage
- SQLite local database (no cloud)
- Full ACID compliance
- Indexed queries for performance
- JSON blob for extensibility

## 📊 Database Schema

### honeyfiles
```sql
- id (UUID)
- decoy_id (SHA256 hash, unique)
- file_name (VARCHAR)
- file_type (docx/xlsx/pdf)
- template_type (passwords/salaries/project_secrets)
- created_at (DateTime)
- expected_hash (SHA256)
- seed_locations (JSON array)
- file_path (VARCHAR)
- metadata_json (JSON)
```

### access_events
```sql
- id (UUID)
- decoy_id (FK to honeyfiles)
- event_type (read/copy/move/open/execute)
- timestamp (DateTime, indexed)
- accessed_path (VARCHAR)
- username (VARCHAR, indexed)
- hostname (VARCHAR)
- internal_ip (VARCHAR)
- mac_address (VARCHAR)
- process_name (VARCHAR)
- process_command (VARCHAR)
- file_hash (VARCHAR)
- source_ip (VARCHAR)
- forensic_json (JSON)
- alert_sent (pending/sent/failed)
```

### alert_settings
```sql
- id (UUID)
- alert_type (slack/email)
- enabled (boolean)
- config_json (JSON)
- created_at (DateTime)
- updated_at (DateTime)
```

### monitoring_status
```sql
- id (UUID)
- is_running (boolean)
- started_at (DateTime)
- last_heartbeat (DateTime)
- total_events (Integer)
- error_count (Integer)
```

## 🧪 Testing

### Test Alert
```bash
curl -X POST "http://127.0.0.1:8000/api/alerts/test?alert_type=slack"
```

### Create Test Honeyfile
```bash
curl -X POST "http://127.0.0.1:8000/api/honeyfiles/create" \
  -H "Content-Type: application/json" \
  -d '{
    "file_name": "test_passwords.docx",
    "file_type": "docx",
    "template_type": "passwords",
    "seed_locations": ["~/Documents"]
  }'
```

### Get Dashboard Stats
```bash
curl "http://127.0.0.1:8000/api/dashboard/stats"
```

## 🐛 Troubleshooting

### Backend Issues
1. **Port 8000 already in use**: Change port in `main.py`
2. **Database locked**: Delete `decoydna.db` and restart
3. **Import errors**: Ensure all packages installed: `pip install -r requirements.txt`

### Frontend Issues
1. **Port 5173 in use**: Change port in `vite.config.js`
2. **CORS errors**: Check backend CORS configuration in `main.py`
3. **WebSocket connection failed**: Ensure backend is running

### Monitoring Issues
1. **No events detected**: Ensure honeyfiles are in monitored directories
2. **Watchdog not working**: Install watchdog: `pip install watchdog`
3. **Permission denied**: Run with administrator privileges on Windows

## 📈 Performance Considerations

- **Event Queue**: Async processing prevents blocking
- **WebSocket**: Real-time updates without polling
- **Database Indexing**: Optimized queries on timestamp and decoy_id
- **Watchdog**: Efficient file system event monitoring
- **Frontend**: React code splitting and lazy loading
- **API Response Caching**: Dashboard stats cached for 5 seconds

## 🔐 Security Best Practices

1. **Secure Slack Webhook**: Store in environment variables, never commit to git
2. **Email Authentication**: Use app-specific passwords, not account password
3. **Database Access**: Keep local.db file permissions restricted
4. **API Keys**: If extending with authentication, use proper token management
5. **Monitoring Scope**: Monitor only necessary directories to avoid false positives

## 📝 Logging

- **Backend**: Logs to console with timestamp and level
- **Frontend**: Browser console for debugging
- **Database**: SQL queries logged when API_DEBUG=true

## 🚀 Production Deployment

### Backend (Example: Linux)
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app.main:app
```

### Frontend (Example: Nginx)
```bash
npm run build
# Deploy 'dist' folder to web server
```

## 📦 Dependencies

### Backend
- FastAPI 0.104.1 - Web framework
- SQLAlchemy 2.0.23 - ORM
- python-docx 0.8.11 - DOCX generation
- openpyxl 3.11.0 - XLSX generation
- reportlab 4.0.7 - PDF generation
- watchdog 3.0.0 - File monitoring
- aiohttp 3.9.1 - Async HTTP
- psutil 5.9.6 - System info

### Frontend
- React 18.2.0 - UI framework
- Vite 5.0.0 - Build tool
- Tailwind CSS 3.4.0 - Styling
- Framer Motion 10.16.4 - Animations
- Recharts 2.10.3 - Charts
- Zustand 4.4.1 - State management

## 📄 License

Enterprise use only. Not for public distribution.

## 👨‍💻 Developer Notes

### Code Architecture
- **Clean Architecture**: Separated concerns across layers
- **Async/Await**: Throughout for non-blocking operations
- **Type Hints**: Python type hints for IDE support
- **Error Handling**: Comprehensive exception handling
- **Logging**: Structured logging for debugging

### Extension Points
- Add custom alert handlers in `alerts/handlers.py`
- Extend honeyfile templates in `honeyfiles/generator.py`
- Add new API endpoints in `api/routes.py`
- Implement custom forensic analysis in `forensic/`

## 🎯 Future Enhancements

- [ ] Multi-user support with authentication
- [ ] Advanced forensic analysis with ML
- [ ] Threat intelligence integration
- [ ] Mobile app notifications
- [ ] Cloud storage integration
- [ ] Advanced reporting and analytics
- [ ] Honeypot decoy servers
- [ ] AI-powered threat detection

---

**Built with ❤️ for enterprise security teams**

For support or questions: contact your security team