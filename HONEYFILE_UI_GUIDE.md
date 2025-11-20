# 🍯 DecoyDNA - Honeyfile UI Guide

## Overview
The updated Generator page now provides a professional interface for creating honeyfiles and managing them with full transparency about their locations and content.

---

## 📋 UI Components

### 1. **Create New Honeyfile Form** (Left Panel)
Located on the left side of the screen with the following fields:

#### Fields:
- **File Name** - Optional, auto-generated if empty
- **File Type** - Choose between:
  - `.docx` (Word Document)
  - `.xlsx` (Excel Spreadsheet)
  - `.pdf` (PDF Document)
  
- **Template Content** - Choose the type of dummy content:
  - **Corporate Passwords** - Contains fake admin credentials
  - **Salary Report** - Contains employee salary data
  - **Project Secrets** - Contains project details and timelines

#### Submit:
- Click "Generate Honeyfile" button to create the file

---

## 📦 Generated Files List (Right Panel)

### File Card Layout:
Each generated honeyfile is displayed as an expandable card with the following sections:

#### Header Section:
- **File Name** (Bold blue text)
- **Decoy ID** (First 20 characters shown, full ID available in details)
- **File Type Badge** (DOCX, XLSX, or PDF in blue)

#### File Metadata:
```
Template: [passwords/salaries/project_secrets]
Created: [Date created]
```

---

## 🔴 File Location Section (RED HIGHLIGHTED)
**This is the most important section for admins.**

Shows the **exact file path** where the honeyfile is stored on the system:

```
📍 File Location (Admin Only)
C:\Users\Documents\SensitiveData\passwords.docx
```

**Example paths by template type:**
- **Passwords**: `C:\Users\Documents\SensitiveData\`
- **Salaries**: `C:\Users\Documents\Finance\HR\`
- **Project Secrets**: `C:\Users\Documents\Projects\Internal\`

**Why this is important:**
- Admin can verify the file exists at this location
- Security team knows exactly where to find the honeyfile
- Can set up proper monitoring on these directories
- Can identify unauthorized access to these specific locations

---

## 🔘 Action Buttons

### 1. **📋 View Content** Button
- **What it does**: Shows sample content embedded in the honeyfile
- **Preview**: See exactly what content someone would encounter if they opened the file
- **Why important**: Helps admin understand what would trigger access alerts

Example preview for "Corporate Passwords" template:
```
Corporate Passwords

Admin Account: admin@company.com
Database: db_admin_prod
Server SSH: root@prod.internal.com
API Keys: sk_live_51234567890abcdef...
```

**Toggle**: Click again to hide (shows "Hide Content")

---

### 2. **📋 Copy Path** Button
- **What it does**: Copies the complete file path to clipboard
- **Use case**: Admin can quickly paste the path into:
  - File explorer
  - Monitoring tools
  - Security software
  - Logs or reports

---

### 3. **▶ Full Details** Button
- **What it does**: Expands to show complete technical information
- **Information displayed**:
  - Full Decoy ID (32+ character hash)
  - File Type
  - Template Type
  - Expected Hash (SHA256)
  - Verification instructions

**Example Full Details:**
```
File Type: docx
Template: passwords
Full Decoy ID: 479471817ce0e43e8f7a2b9d1e5c6f...
Expected Hash: abc123def456...
```

---

### 4. **📦 Export Info** Button
- **What it does**: Copies all file information in text format
- **Output**: Structured text with all metadata
- **Use case**: 
  - Create reports
  - Share with security team
  - Archive in documentation
  - Email to stakeholders

**Exported Format:**
```
Decoy ID: 479471817ce0e43e...
File: passwords.docx
Type: docx
Template: passwords
Hash: abc123def456...
Location: C:\Users\Documents\...
```

---

## 🎯 Dummy File Content Explanation

### Why use dummy content?

Honeyfiles contain **realistic but fake data** that:
1. **Looks legitimate** - So intruders think they found real data
2. **Contains tracking markers** - Watermarks to identify who accessed it
3. **Triggers alerts** - When opened or copied, the system alerts admins
4. **Never causes damage** - All data is fictional, not production data

### Content by Template Type:

#### 1. **Corporate Passwords**
```
Corporate Passwords

Admin Account: admin@company.com
Database: db_admin_prod
Server SSH: root@prod.internal.com
API Keys: sk_live_51234567890abcdef...
```
**Who falls for it**: Attackers looking for credentials to escalate access

---

#### 2. **Salary Report**
```
Q4 Salary Report 2024

Employee | Department | Salary
John Doe | Engineering | $120,000
Jane Smith | Sales | $95,000
Bob Johnson | Management | $150,000
```
**Who falls for it**: Employees seeking competitive advantage, corporate spies

---

#### 3. **Project Secrets**
```
PROJECT CODENAME: PHOENIX

Timeline: Q1 2025 Launch
Budget: $2.5M
Key Milestones:
- Phase 1: Infrastructure Setup
- Phase 2: Development
- Phase 3: Testing & Deployment
```
**Who falls for it**: Competitors, malicious insiders looking for strategic info

---

## 🛡️ How Watermarking Works

### 5 Invisible Techniques:

1. **Hidden Metadata** - Embedded in file properties
   - Title, Subject, Comments contain Decoy ID
   
2. **Zero-width Unicode** - Invisible text between normal text
   - Cannot be seen but survives copy-paste
   
3. **Invisible Text Layers** - Hidden text in documents
   - Present in file but not displayed
   
4. **SHA256 Hashing** - File fingerprint
   - Detects if file content changes
   
5. **Hidden Rows/Columns** (Excel only)
   - Data in hidden sheets with Decoy ID

**Admin Benefit**: Even if intruder tries to remove watermarks, they'll trigger alerts

---

## 📊 Differentiating Real vs Honeyfiles

### How Admin Can Track Which File is Which:

#### Method 1: Using Decoy ID
- Every honeyfile has a **unique Decoy ID**
- Copy from "Full Details" button
- Search for it in Logs page (search by Decoy ID)
- If accessed, Timeline will show which ID was triggered

#### Method 2: Using File Path
- Real files: Normal paths like `C:\Users\Documents\MyFiles\`
- Honeyfiles: Specific honeypot paths like `C:\Users\Documents\SensitiveData\`
- Monitor only honeypot directories for access

#### Method 3: Using Hash
- Each honeyfile has unique SHA256 hash
- Use "Full Details" → Copy hash
- Compare against file in system
- If hash matches, it's the honeyed version

---

## 🔍 Admin Workflow

### Step 1: Create Honeyfile
1. Select template type (Passwords/Salaries/Secrets)
2. Choose file type (.docx/.xlsx/.pdf)
3. Click "Generate Honeyfile"
4. File created with invisible watermarks

### Step 2: Store File Strategically
1. Copy the file path from "Copy Path" button
2. Place file in location intruders might search:
   - Desktop
   - Documents
   - Shared drives
   - Network folders
3. File is now "live" and monitored

### Step 3: Monitor Access
1. Go to **Timeline** page
2. Search for the Decoy ID (from "Full Details")
3. Watch for access events
4. When someone opens the file:
   - Username who accessed it
   - Timestamp of access
   - Process that opened it
   - Machine information

### Step 4: Take Action
1. Review forensic details in Logs page
2. Identify the threat
3. Escalate to security team
4. View the exact path where file was accessed

---

## 💡 Pro Tips

### Tip 1: Create Multiple Templates
- Create "passwords" file → Name it "Admin_Creds.docx"
- Create "salaries" file → Name it "2024_Compensation.xlsx"
- Create "secrets" file → Name it "ProjectX_Timeline.pdf"
- Intruders won't know which is real

### Tip 2: Use Realistic Names
- Instead of "honeypot.docx", use "payroll_2024.xlsx"
- Instead of "decoy.pdf", use "Q4_Strategy.pdf"
- Better chance of attracting unauthorized access

### Tip 3: Track Multiple Files
- Create different honeyfiles for different locations
- Monitor each separately
- If specific file accessed, know exact location

### Tip 4: Export Information
- Use "Export Info" to create CSV/report
- Share with security team
- Document all honeyfiles in inventory
- Include creation date and location

---

## 📱 Mobile/Responsive Design

The UI is fully responsive:
- **Desktop**: Two-column layout (form + list)
- **Tablet**: Stacked layout
- **Mobile**: Single column, full width cards

---

## ⚠️ Important Warnings

### ⛔ DO NOT:
- Use real sensitive data in templates
- Place honeyfiles in locations users regularly need
- Share honeyfile location with employees
- Modify honeyfile content (breaks watermarks)

### ✅ DO:
- Use realistic fake data in templates
- Place in locations suspicious users might check
- Keep Decoy ID in secure location
- Monitor Timeline and Logs regularly
- Export info for audit trail

---

## 🔗 Related Pages

- **Dashboard**: View overall statistics
- **Timeline**: See real-time access events
- **Logs**: Detailed forensic information
- **Monitoring**: Start/stop file monitoring
- **Alerts**: Configure Slack/Email notifications

---

## 🎓 Summary

**The Generator page now provides:**

✓ Easy creation of realistic decoy files  
✓ Clear visibility into file locations  
✓ Sample content preview  
✓ Complete technical information  
✓ Export capabilities for reporting  
✓ Professional admin interface  

**Admin can now:**

✓ Create decoys strategically  
✓ Know exactly where files are stored  
✓ Understand what intruders will see  
✓ Track access with Decoy IDs  
✓ Share information with security team  

---

## 📞 Support

For issues or questions:
1. Check the Logs page for detailed errors
2. Review Timeline for access patterns
3. Check backend terminal for API errors
4. Verify file locations exist before monitoring

