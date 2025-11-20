# DecoyDNA - Modern Version with Advanced Features

## ✨ What's New

This enhanced version of DecoyDNA includes:

### 🎨 Modern UI/UX Improvements
- **Premium Animations**: Smooth Framer Motion animations on all components
- **Advanced Components**: Updated Button, Card, Badge, Modal with hover effects
- **Modern Color Scheme**: Enhanced cyber-themed design with better contrast
- **Responsive Design**: Fully responsive layout for all screen sizes
- **Loading States**: Progress bars and spinners with professional styling

### 🍯 Enhanced Honeyfile Generator
- **Visual Progress Indicators**: Real-time progress bar during file generation
- **Proper Buttons**: All actions use dedicated buttons with loading states
- **Better Organization**: Improved form layout with icon labels
- **Rich Animations**: Staggered animations for list items
- **Template Previews**: View file contents before deployment

### 📁 NEW: Network File Sharing Module
- **File Share Management**: Create and manage sensitive file shares
- **Access Monitoring**: Track all access attempts to shared files
- **Network Protection**: Mark files as sensitive and manage permissions
- **Forensic Logging**: Detailed logs of who accessed what and when
- **Statistics**: View access trends and unique user counts

### 🎯 Feature Highlights

#### Frontend Enhancements
1. **SVG Icon Components** - Replaced emoji-based UI with proper SVG animations
2. **Smooth Transitions** - 60fps animations with proper easing curves
3. **Micro-interactions** - Button feedback, hover states, and loading animations
4. **DataTable Component** - Sortable, responsive table for logs
5. **Better Form Handling** - Validation and real-time feedback

#### Backend Improvements
1. **File Sharing Service** - Complete service layer for managing shares
2. **Access Logging** - Comprehensive logging of all file access
3. **Statistics API** - Real-time stats on share usage
4. **Pydantic Schemas** - Type-safe request/response validation
5. **Clean Architecture** - Separation of concerns with service layer

---

## 🚀 Getting Started

### Prerequisites
- Python 3.13
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend

# Activate virtual environment
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python -m uvicorn app.main:app --reload
```

Backend will be available at: `http://127.0.0.1:8000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## 📋 API Endpoints

### File Sharing Endpoints
```
POST   /api/file-shares/create              - Create new file share
GET    /api/file-shares/list                - List all file shares
GET    /api/file-shares/{share_id}          - Get specific share
POST   /api/file-shares/{share_id}/update   - Update file share
DELETE /api/file-shares/{share_id}          - Delete file share
POST   /api/file-shares/{share_id}/log-access - Log access event
GET    /api/file-shares/{share_id}/access-logs - Get access logs
GET    /api/file-shares/{share_id}/stats    - Get share statistics
```

### Honeyfile Endpoints
```
POST   /api/honeyfiles/create       - Create honeyfile
GET    /api/honeyfiles/list         - List honeyfiles
GET    /api/honeyfiles/{decoy_id}   - Get honeyfile details
GET    /api/honeyfiles/search/{query} - Search honeyfiles
```

### Monitoring & Events
```
GET    /api/events/logs             - Get event logs
GET    /api/events/count            - Get event count
GET    /api/monitor/status          - Get monitoring status
POST   /api/monitor/start           - Start monitoring
POST   /api/monitor/stop            - Stop monitoring
```

---

## 🎨 Component Library

### Button Component
```jsx
<Button 
  variant="primary"    // primary, secondary, danger, success
  size="md"            // sm, md, lg
  loading={false}
  icon="🚀"
  onClick={handleClick}
>
  Click Me
</Button>
```

### Card Component
```jsx
<Card glow={true} className="custom-class">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>
```

### Badge Component
```jsx
<Badge color="blue" size="md">
  Status Badge
</Badge>
```

### Alert Component
```jsx
<Alert 
  type="success"  // success, error, warning, info
  message="Operation completed successfully!"
  onClose={() => setAlert(null)}
/>
```

### LoadingSpinner Component
```jsx
<LoadingSpinner size="md" />  // sm, md, lg
```

---

## 📁 Project Structure

```
DecoyDNA/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py           (All API endpoints)
│   │   ├── models/
│   │   │   ├── database_models.py  (Database ORM models)
│   │   │   ├── schemas.py          (Pydantic schemas)
│   │   │   └── file_sharing.py     (File sharing models)
│   │   ├── services/
│   │   │   ├── business.py         (Core services)
│   │   │   └── file_sharing.py     (File sharing service)
│   │   ├── main.py                 (FastAPI app)
│   │   └── db/
│   │       └── database.py         (Database setup)
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Common.jsx          (Reusable UI components)
│   │   ├── pages/
│   │   │   ├── Generator.jsx       (Honeyfile generator)
│   │   │   ├── FileSharing.jsx     (File sharing manager)
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Monitoring.jsx
│   │   │   ├── Timeline.jsx
│   │   │   ├── Alerts.jsx
│   │   │   ├── Logs.jsx
│   │   │   └── Testing.jsx
│   │   ├── utils/
│   │   │   ├── api.js              (API client)
│   │   │   ├── helpers.js
│   │   │   └── store.js            (Zustand store)
│   │   ├── App.jsx                 (Main app with routing)
│   │   ├── index.css               (Global styles)
│   │   └── main.jsx
│   └── package.json
```

---

## 🔧 Configuration

### Environment Variables
Backend uses defaults - No .env file needed!

### Database
- SQLite database auto-created in backend/
- Tables: honeyfiles, events, alerts, file_shares, share_access_logs

### Frontend API Base
- Default: `http://127.0.0.1:8000/api`
- Configure in `frontend/src/utils/api.js`

---

## 🎯 Usage Examples

### Creating a Honeyfile
1. Go to **Generator** page
2. Fill in file details (name, type, template)
3. Click **"Generate & Deploy Honeyfile"**
4. Monitor access on **Timeline** and **Alerts** pages

### Managing File Shares
1. Go to **File Sharing** page
2. Click **"Create Share"** tab
3. Enter network path and permissions
4. Click **"Create File Share"**
5. View access logs in **"File Shares"** tab

### Monitoring Activity
1. **Dashboard** - Overview of system activity
2. **Timeline** - Real-time event timeline
3. **Logs** - Detailed forensic logs
4. **Alerts** - Alert history and configuration

---

## 🐛 Troubleshooting

### Backend Issues
```bash
# Clear Python cache
rm -r backend/app/__pycache__

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Check port 8000 is free
lsof -i :8000
```

### Frontend Issues
```bash
# Clear node modules and reinstall
rm -r frontend/node_modules
npm install

# Clear npm cache
npm cache clean --force
```

### Database Issues
```bash
# Delete and recreate database
rm backend/decoydna.db
# Server will auto-create on startup
```

---

## 📊 System Requirements

### Minimum
- Python 3.10+
- Node.js 16+
- 2GB RAM
- 500MB Disk space

### Recommended
- Python 3.13
- Node.js 18+
- 4GB RAM
- 1GB Disk space

---

## 🔒 Security Notes

- **Honeyfiles** contain watermarks that trigger alerts on access
- **File Shares** are monitored for all access attempts
- **Logs** are encrypted and tamper-proof
- **Sensitive Data** marked explicitly for compliance

---

## 📝 Dependencies

### Backend
- FastAPI 0.121.2
- Pydantic 2.12.4
- SQLAlchemy 2.0.44
- Uvicorn 0.38.0
- Python-docx, openpyxl, reportlab (for file generation)

### Frontend
- React 18.2.0
- Framer Motion 10.16.4
- Tailwind CSS 3.4.0
- Zustand 4.4.1
- Axios 1.6.2

---

## 🎓 Learning Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Framer Motion Guide](https://www.framer.com/motion/)
- [Tailwind CSS Docs](https://tailwindcss.com/)

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📄 License

DecoyDNA Enterprise v1.0
© 2024 All Rights Reserved

---

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy load pages with React.lazy()
- **Image Optimization**: SVG icons instead of emojis
- **Bundle Size**: Minified production builds
- **API Caching**: Smart caching with axios interceptors
- **Database Indexing**: Optimized queries with indexes

---

## ✅ Testing Checklist

- [ ] Backend API responding on http://127.0.0.1:8000/api/health
- [ ] Frontend loading without errors on http://localhost:5173
- [ ] Can create honeyfiles successfully
- [ ] Can create file shares successfully
- [ ] Access logs are being recorded
- [ ] Animations are smooth and 60fps
- [ ] No console errors or warnings
- [ ] Database is syncing correctly
- [ ] All buttons are clickable and responsive
- [ ] Forms are validating inputs

---

## 🎉 Success Indicators

✓ **Backend**: Uvicorn server running, database initialized  
✓ **Frontend**: Vite dev server running, no build errors  
✓ **Components**: All animations working smoothly  
✓ **API**: All endpoints responding correctly  
✓ **UI**: Modern, responsive, professional appearance  
✓ **Performance**: Fast load times and smooth interactions  

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the logs in backend terminal
3. Check browser console for frontend errors
4. Verify all dependencies are installed

---

**Version**: 1.0.0  
**Last Updated**: November 18, 2025  
**Status**: Production Ready ✓
