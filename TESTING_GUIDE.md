# 🧪 DecoyDNA - Complete Testing Guide

## Quick Start (5 Minutes)

### Step 1: Go to Testing Page
1. Click **🧪 Testing** in the sidebar
2. You'll see the "API Testing Console"

### Step 2: Run Tests in Order
1. Click **"Create Honeyfile"** → Should show ✓ PASS
2. Click **"Dashboard Stats"** → Should show ✓ PASS
3. Click **"Event Logs"** → Should show ✓ PASS
4. Click **"Monitoring Status"** → Should show ✓ PASS

### Step 3: Verify Results
- Green box = ✓ Test Passed
- Red box = ✗ Test Failed
- Yellow box = ⚠ Warning

---

## Complete Testing Workflow

### 1️⃣ **Test Honeyfile Creation**

**Button**: Create Honeyfile

**What it tests**:
- Backend API is working
- Database connection is working
- File generation engine is working
- File storage is working

**Expected Output**:
```
Status: PASS
Message: ✓ Honeyfile created successfully
Details:
  - decoy_id: 479471817ce0e43e...
  - file_name: test_honeypot_1234567890.docx
  - file_path: C:\Users\Documents\SensitiveData\...
```

**If it FAILS**:
- ❌ Check if backend is running (`http://127.0.0.1:8000`)
- ❌ Check if database file exists
- ❌ Check terminal logs for errors

---

### 2️⃣ **Test Honeyfile Listing**

**Button**: List Honeyfiles

**What it tests**:
- Database read operations
- File retrieval from database
- API response formatting

**Expected Output**:
```
Status: PASS
Message: ✓ Retrieved 5 honeyfiles
Details:
  - count: 5
  - files: [Array of file names]
```

**If it FAILS**:
- ❌ No honeyfiles created yet (create one first)
- ❌ Database query issue

---

### 3️⃣ **Test Get Honeyfile by ID**

**Button**: Get Honeyfile by ID

**What it tests**:
- Exact ID lookup
- Database filtering
- Response validation

**Prerequisites**:
- Must create a honeyfile first

**Expected Output**:
```
Status: PASS
Message: ✓ Retrieved honeyfile by Decoy ID
Details:
  - decoy_id: 479471817ce0e43e...
  - file_name: test_honeypot_1234567890.docx
  - created_at: 11/17/2025, 2:14:15 PM
```

---

### 4️⃣ **Test Search Honeyfiles**

**Button**: Search Honeyfiles

**What it tests**:
- Partial text search
- Pattern matching
- Case-insensitive search

**How it works**:
- Searches for first 10 characters of the created file's Decoy ID
- Finds matching files

**Expected Output**:
```
Status: PASS
Message: ✓ Search found 1 results
Details:
  - query: 479471817ce0e43e
  - results: 1
```

---

### 5️⃣ **Test Dashboard Statistics**

**Button**: Dashboard Stats

**What it tests**:
- Stats aggregation
- Event counting
- Monitoring status check
- Real-time data retrieval

**Expected Output**:
```
Status: PASS
Message: ✓ Retrieved dashboard statistics
Details:
  - total_honeyfiles: 5
  - total_events: 0 (or higher if triggered)
  - alerts_today: 0
  - monitoring_status: ✓ Active or ✗ Inactive
```

**Interpretation**:
- `total_honeyfiles`: Should increase when you create files
- `total_events`: Should increase when honeyfile is accessed
- `alerts_today`: Should increase if alerts are configured
- `monitoring_status`: Should be "Active" after clicking "Start Monitoring"

---

### 6️⃣ **Test Event Logs**

**Button**: Event Logs

**What it tests**:
- Event storage
- Event retrieval
- Time-based filtering (last 24 hours)
- Database querying

**Expected Output**:
```
Status: PASS
Message: ✓ Retrieved 0 access events
Details:
  - count: 0
  - timeRange: Last 24 hours
```

**When you'll see events**:
- After opening a honeyfile
- After copying a honeyfile
- After moving a honeyfile
- After any file access

---

### 7️⃣ **Test Event Count**

**Button**: Event Count

**What it tests**:
- Total event aggregation
- Count accuracy

**Expected Output**:
```
Status: PASS
Message: ✓ Total events: 0
Details:
  - count: 0
```

**Should match** the count from Event Logs button

---

### 8️⃣ **Test Monitoring Status**

**Button**: Monitoring Status

**What it tests**:
- Monitoring engine status
- Event counter
- Error tracking

**Expected Output**:
```
Status: PASS
Message: ✓ Monitoring INACTIVE
Details:
  - is_running: ✗ No
  - started_at: Not started
  - total_events: 0
  - error_count: 0
```

**OR** (if monitoring is running):
```
Status: PASS
Message: ✓ Monitoring ACTIVE
Details:
  - is_running: ✓ Yes
  - started_at: 2025-11-17T14:14:15
  - total_events: 0
  - error_count: 0
```

---

### 9️⃣ **Test Start Monitoring**

**Button**: Start Monitoring

**What it tests**:
- Monitoring engine initialization
- File watcher activation
- Thread management

**Expected Output**:
```
Status: PASS
Message: ✓ Monitoring started successfully
Details:
  - status: ✓ Running
```

**After this**:
- File watcher is active
- Honeyfiles are being monitored
- Access events will be logged

---

### 🔟 **Test Stop Monitoring**

**Button**: Stop Monitoring

**What it tests**:
- Monitoring shutdown
- Thread cleanup
- Event logging stoppage

**Expected Output**:
```
Status: PASS
Message: ✓ Monitoring stopped successfully
Details:
  - status: ✗ Stopped
```

**After this**:
- File watcher is inactive
- No new events will be logged
- System is in idle state

---

### 1️⃣1️⃣ **Test Alert Settings**

**Button**: Alert Settings

**What it tests**:
- Alert configuration retrieval
- Slack integration status
- Email integration status

**Expected Output**:
```
Status: PASS
Message: ✓ Retrieved alert settings
Details:
  - slack_enabled: ✗ No
  - email_enabled: ✗ No
```

---

## 🚀 End-to-End Testing (10 Minutes)

### Complete Workflow:

```
1. Run All Tests → See baseline status
   ↓
2. Create Honeyfile → Get Decoy ID
   ↓
3. Check Dashboard Stats → Should show 1 file created
   ↓
4. Start Monitoring → Activate file watcher
   ↓
5. Check Monitoring Status → Should show "ACTIVE"
   ↓
6. **OPEN THE CREATED HONEYFILE** (important!)
   ↓
7. Wait 2-3 seconds
   ↓
8. Check Event Logs → Should show access event
   ↓
9. Check Dashboard Stats → total_events should increase
   ↓
10. Stop Monitoring → Deactivate file watcher
```

---

## 🎯 How to Trigger Access Events

### Method 1: Open the File
```
1. Click "View Content" button
2. Copy the file path from "Copy Path" button
3. Open File Explorer
4. Navigate to the file location
5. Double-click the file to open it
6. Access event is logged instantly
```

### Method 2: Copy the File
```
1. Open File Explorer
2. Navigate to file location
3. Right-click file → Copy
4. Paste it somewhere else
5. Access event is logged
```

### Method 3: Check File Properties
```
1. Open File Explorer
2. Navigate to file location
3. Right-click file → Properties
4. Access event is logged
```

### Method 4: View File Metadata
```
1. Open File Explorer
2. Navigate to file location
3. Click on file to select it
4. View file details in preview pane
5. Access event is logged
```

---

## 📊 Verifying Event Data

### After triggering an access event:

**Step 1**: Go to Timeline page (⏱️)
- Should show the access event
- Will display username, timestamp, hostname

**Step 2**: Go to Logs page (📋)
- Should show forensic details
- Will display process name, file path accessed

**Step 3**: Go to Dashboard page (📊)
- "Total Events" should increase
- "Access Events" chart should update

---

## ✅ Expected Test Results

| Test | Expected Result | Status |
|------|-----------------|--------|
| Create Honeyfile | ✓ PASS | Green |
| List Honeyfiles | ✓ PASS | Green |
| Get Honeyfile by ID | ✓ PASS | Green |
| Search Honeyfiles | ✓ PASS | Green |
| Dashboard Stats | ✓ PASS | Green |
| Event Logs | ✓ PASS | Green |
| Event Count | ✓ PASS | Green |
| Monitoring Status | ✓ PASS | Green |
| Start Monitoring | ✓ PASS | Green |
| Stop Monitoring | ✓ PASS | Green |
| Alert Settings | ✓ PASS | Green |

---

## ❌ Troubleshooting

### Problem: All tests fail
**Solution**:
```
1. Check if backend is running: http://127.0.0.1:8000
2. Check if frontend is running: http://127.0.0.1:5174 or 5173
3. Restart backend: Kill python processes and restart
4. Restart frontend: Kill node processes and restart npm run dev
```

### Problem: Create Honeyfile fails
**Solution**:
```
1. Check backend logs in terminal
2. Verify database file exists: ~/.decoydna/decoydna.db
3. Check file permissions
4. Try with different file type
```

### Problem: Monitoring tests fail
**Solution**:
```
1. Check if file monitoring engine is loaded
2. Verify watchdog library is installed
3. Check backend logs for errors
4. Restart monitoring (Stop, then Start)
```

### Problem: No events logged after opening file
**Solution**:
```
1. Verify monitoring is ACTIVE (check Monitoring Status)
2. Use correct file path (from "Copy Path" button)
3. Wait 2-3 seconds after opening file
4. Check if antivirus is blocking monitoring
5. Check backend logs for watchdog errors
```

### Problem: Alert tests fail
**Solution**:
```
1. Alerts are optional (can be empty)
2. If failing, check Slack/Email configuration
3. Both disabled (✗) is normal default state
4. Can configure later from Alerts page
```

---

## 📈 Reading Test Results

### Result Format:
```
Test Name: [Name of test]
Status Badge: [PASS/FAIL/WARNING]
Message: [What happened]
Timestamp: [When it ran]
Details: [Detailed information]
```

### Example PASS:
```
Test Name: Create Honeyfile
Status: PASS (green)
Message: ✓ Honeyfile created successfully
Timestamp: 14:15:32
Details:
  decoy_id: 479471817ce0e43e...
  file_name: test_honeypot_1234567890.docx
  file_path: C:\Users\Documents\...
```

### Example FAIL:
```
Test Name: Create Honeyfile
Status: FAIL (red)
Message: ✗ Failed: Connection refused
Timestamp: 14:15:32
Details:
  error: Error: connect ECONNREFUSED 127.0.0.1:8000
```

---

## 🔄 Running Tests Repeatedly

### Test 1 Run:
1. Click "Run All Tests"
2. See baseline (all PASS)
3. Note all counts (0 honeyfiles, 0 events)

### Test 2 Run (after creating file):
1. Click "Run All Tests" again
2. Compare results
3. Should see increases in counts

### Test 3 Run (after access event):
1. Click "Run All Tests" again
2. Should see event count increased
3. Verify forensic data in Logs

---

## 💾 Exporting Test Results

### To Save Results:
```
1. After running tests
2. Open browser Developer Tools (F12)
3. Go to Console tab
4. Copy test results
5. Paste in text file
6. Save as .txt or .md
```

### To Screenshot:
```
1. Run tests
2. Press Ctrl+Shift+S (Windows screenshot)
3. Select area
4. Save as image
```

---

## 🎓 What Each Test Proves

| Test | Proves |
|------|--------|
| Create Honeyfile | ✓ File generation works, database saves data |
| List Honeyfiles | ✓ Database retrieval works |
| Get by ID | ✓ Exact matching and filtering works |
| Search | ✓ Partial search and pattern matching works |
| Dashboard | ✓ Statistics aggregation works |
| Event Logs | ✓ Event storage works |
| Event Count | ✓ Event counting works |
| Monitoring Status | ✓ Engine status tracking works |
| Start Monitoring | ✓ File watcher starts correctly |
| Stop Monitoring | ✓ File watcher stops correctly |
| Alert Settings | ✓ Configuration retrieval works |

---

## 🚨 Alert Generation

Alerts are automatically generated when:

1. **File is opened**
   - Access event logged
   - Alert triggered (if configured)

2. **File is copied**
   - Access event logged
   - Alert triggered (if configured)

3. **File is moved**
   - Access event logged
   - Alert triggered (if configured)

4. **File hash changes**
   - Access event logged
   - Alert triggered (if configured)

5. **File properties viewed**
   - Access event logged
   - Alert triggered (if configured)

### To Test Alerts:
1. Go to Alerts page (🚨)
2. Configure Slack webhook (optional)
3. Configure Email address (optional)
4. Trigger access event (open honeyfile)
5. Check Slack/Email for notification

---

## 📝 Test Report Template

```
DECOYDNA SYSTEM TEST REPORT
Date: _______________
Tester: _______________

HONEYFILE TESTS:
[ ] Create Honeyfile - PASS / FAIL / WARNING
[ ] List Honeyfiles - PASS / FAIL / WARNING
[ ] Get by ID - PASS / FAIL / WARNING
[ ] Search - PASS / FAIL / WARNING

EVENT TESTS:
[ ] Event Logs - PASS / FAIL / WARNING
[ ] Event Count - PASS / FAIL / WARNING
[ ] Dashboard Stats - PASS / FAIL / WARNING

MONITORING TESTS:
[ ] Monitoring Status - PASS / FAIL / WARNING
[ ] Start Monitoring - PASS / FAIL / WARNING
[ ] Stop Monitoring - PASS / FAIL / WARNING

ALERT TESTS:
[ ] Alert Settings - PASS / FAIL / WARNING

OVERALL STATUS: ✓ PASS / ✗ FAIL

NOTES:
_________________________
_________________________
```

---

## 🎉 System is Ready When:

✅ All 11 tests PASS  
✅ Dashboard shows created files  
✅ Event Logs shows access events  
✅ Monitoring Status shows ACTIVE  
✅ Opening file triggers alert  
✅ Timeline shows access details  
✅ Logs shows forensic information  

---

## 📞 Next Steps

1. **Configure Alerts** (optional)
   - Go to Alerts page
   - Add Slack webhook or Email
   - Test alert notifications

2. **Create Multiple Honeyfiles**
   - Go to Generator page
   - Create different templates
   - Different file types

3. **Monitor Real Environment**
   - Start monitoring
   - Place files strategically
   - Watch for suspicious access

4. **Review Logs Regularly**
   - Check Timeline page
   - Review Logs page
   - Analyze patterns

---

## 🏆 Congratulations!

Your DecoyDNA system is fully operational and tested. You can now:

- ✓ Generate honeyfiles
- ✓ Monitor file access
- ✓ Log forensic data
- ✓ Receive alerts
- ✓ Investigate incidents
- ✓ Track intruders

**Happy Honeying!** 🍯

