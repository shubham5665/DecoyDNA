"""
FastAPI routes for DecoyDNA
"""
from fastapi import APIRouter, Depends, HTTPException, WebSocket, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import asyncio
import json

from app.db.database import get_db
from app.models.schemas import (
    HoneyfileCreateRequest, HoneyfileResponse,
    AccessEventResponse, AlertSettingsRequest, AlertSettingsResponse,
    MonitoringStatusRequest, MonitoringStatusResponse,
    DashboardStats, WebSocketEvent,
    FileShareCreateRequest, FileShareResponse, ShareAccessLogResponse, ShareStatsResponse
)
from app.services.business import (
    HoneyfileService, EventService, MonitoringService,
    AlertService, DashboardService, monitoring_engine, alert_manager
)
from app.services.file_sharing import FileShareService

router = APIRouter(prefix="/api", tags=["DecoyDNA"])

# ==================== WEBSOCKET ====================
@router.websocket("/ws/events")
async def websocket_events(websocket: WebSocket, db: Session = Depends(get_db)):
    """WebSocket endpoint for real-time event streaming"""
    await websocket.accept()
    
    # Store original callback
    original_callback = monitoring_engine.alert_callback
    
    # Create callback that sends to WebSocket
    async def ws_callback(forensic_context):
        try:
            event = WebSocketEvent(
                event_type="file_access",
                timestamp=forensic_context.get("timestamp"),
                data=forensic_context,
                severity="critical"
            )
            await websocket.send_json(event.dict())
            
            # Also save to database and send alerts
            EventService.create_event(db, forensic_context)
            await AlertService.send_alert(forensic_context)
        except Exception as e:
            print(f"WebSocket error: {e}")
    
    # Monkey-patch the callback
    monitoring_engine.alert_callback = ws_callback
    
    try:
        while True:
            # Keep connection open
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except Exception as e:
        print(f"WebSocket connection error: {e}")
    finally:
        # Restore original callback
        monitoring_engine.alert_callback = original_callback

# ==================== HONEYFILES ====================
@router.post("/honeyfiles/create", response_model=HoneyfileResponse)
async def create_honeyfile(
    request: HoneyfileCreateRequest,
    db: Session = Depends(get_db)
):
    """Create a new honeyfile"""
    try:
        result = HoneyfileService.create_honeyfile(
            db,
            request.file_name,
            request.file_type,
            request.template_type,
            request.seed_locations
        )
        return HoneyfileResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/honeyfiles/list", response_model=List[HoneyfileResponse])
async def list_honeyfiles(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """List all honeyfiles"""
    honeyfiles = HoneyfileService.list_honeyfiles(db, skip, limit)
    return [HoneyfileResponse(**hf) for hf in honeyfiles]

@router.get("/honeyfiles/search/{query}", response_model=List[HoneyfileResponse])
async def search_honeyfiles(
    query: str,
    search_type: str = Query("decoy_id", description="Type: decoy_id, file_name, template_type, or all"),
    db: Session = Depends(get_db)
):
    """Search honeyfiles by decoy_id, file_name, template_type, or combination"""
    honeyfiles = HoneyfileService.search_honeyfiles(db, query, search_type)
    return [HoneyfileResponse(**hf) for hf in honeyfiles]

@router.get("/honeyfiles/{decoy_id}", response_model=HoneyfileResponse)
async def get_honeyfile(
    decoy_id: str,
    db: Session = Depends(get_db)
):
    """Get honeyfile by decoy ID"""
    honeyfile = HoneyfileService.get_honeyfile(db, decoy_id)
    if not honeyfile:
        raise HTTPException(status_code=404, detail="Honeyfile not found")
    return HoneyfileResponse(**honeyfile)

# ==================== EVENTS ====================
@router.get("/events/logs", response_model=List[AccessEventResponse])
async def get_event_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    decoy_id: Optional[str] = Query(None),
    hours: int = Query(24, ge=1, le=720),
    db: Session = Depends(get_db)
):
    """Get access event logs"""
    events = EventService.get_events(db, skip, limit, decoy_id, hours)
    return [AccessEventResponse(**e) for e in events]

@router.get("/events/count")
async def get_event_count(
    decoy_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get count of events"""
    count = EventService.count_events_today(db, decoy_id)
    return {"count": count, "period": "24_hours"}

# ==================== MONITORING ====================
@router.post("/monitor/start")
async def start_monitoring(
    directories: Optional[List[str]] = Query(None),
    db: Session = Depends(get_db)
):
    """Start file monitoring"""
    result = await MonitoringService.start_monitoring(db, directories)
    return result

@router.post("/monitor/stop")
async def stop_monitoring():
    """Stop file monitoring"""
    result = MonitoringService.stop_monitoring()
    return result

@router.get("/monitor/status", response_model=MonitoringStatusResponse)
async def get_monitoring_status(db: Session = Depends(get_db)):
    """Get monitoring status"""
    status = MonitoringService.get_monitoring_status(db)
    return MonitoringStatusResponse(
        is_running=status["is_running"],
        started_at=status.get("started_at"),
        last_heartbeat=status.get("last_heartbeat"),
        total_events=status["events_today"],
        error_count=0  # Could be tracked separately
    )

# ==================== ALERTS ====================
@router.get("/alerts/settings", response_model=dict)
async def get_alert_settings(db: Session = Depends(get_db)):
    """Get alert settings"""
    settings = AlertService.get_alert_settings(db)
    return settings

@router.post("/alerts/settings")
async def update_alert_settings(
    request: AlertSettingsRequest,
    db: Session = Depends(get_db)
):
    """Update alert settings"""
    result = AlertService.update_alert_setting(
        db,
        request.alert_type,
        request.enabled,
        request.config
    )
    return result

@router.post("/alerts/test")
async def test_alert(
    alert_type: str = Query(...),
    db: Session = Depends(get_db)
):
    """Test alert by sending a test event"""
    test_event = {
        "decoy_id": "TEST_000000000000",
        "event_type": "test",
        "timestamp": "2024-11-17T00:00:00",
        "username": "test_user",
        "hostname": "test_host",
        "accessed_path": "/test/path/test_file.docx",
        "process_name": "test_process.exe"
    }
    
    result = await AlertService.send_alert(test_event)
    return {"test_sent": result}

# ==================== DASHBOARD ====================
@router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get dashboard statistics"""
    stats = DashboardService.get_dashboard_stats(db)
    return DashboardStats(
        total_honeyfiles=stats["total_honeyfiles"],
        total_events=stats["total_events"],
        alerts_today=stats["alerts_today"],
        monitoring_status=stats["monitoring_status"],
        events_last_hour=stats["events_last_hour"]
    )

# ==================== HEALTH ====================
@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "DecoyDNA API",
        "version": "1.0.0"
    }

# ==================== FILE SHARING ====================
@router.post("/file-shares/create", response_model=FileShareResponse)
async def create_file_share(
    request: FileShareCreateRequest,
    db: Session = Depends(get_db)
):
    """Create a new file share"""
    try:
        result = FileShareService.create_share(
            db,
            request.share_name,
            request.share_path,
            request.description,
            request.is_sensitive,
            request.shared_with_users,
            request.shared_with_groups
        )
        return FileShareResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/file-shares/list", response_model=List[FileShareResponse])
async def list_file_shares(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """List all file shares"""
    shares = FileShareService.list_shares(db, skip, limit)
    return [FileShareResponse(**s) for s in shares]

@router.get("/file-shares/{share_id}", response_model=FileShareResponse)
async def get_file_share(
    share_id: str,
    db: Session = Depends(get_db)
):
    """Get specific file share"""
    share = FileShareService.get_share(db, share_id)
    if not share:
        raise HTTPException(status_code=404, detail="File share not found")
    return FileShareResponse(**share)

@router.post("/file-shares/{share_id}/update", response_model=FileShareResponse)
async def update_file_share(
    share_id: str,
    request: FileShareCreateRequest,
    db: Session = Depends(get_db)
):
    """Update file share"""
    try:
        result = FileShareService.update_share(
            db, share_id,
            share_name=request.share_name,
            share_path=request.share_path,
            description=request.description,
            is_sensitive=request.is_sensitive,
            shared_with_users=request.shared_with_users,
            shared_with_groups=request.shared_with_groups
        )
        return FileShareResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/file-shares/{share_id}")
async def delete_file_share(
    share_id: str,
    db: Session = Depends(get_db)
):
    """Delete file share"""
    try:
        FileShareService.delete_share(db, share_id)
        return {"status": "deleted", "share_id": share_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/file-shares/{share_id}/log-access")
async def log_share_access(
    share_id: str,
    username: str = Query(...),
    hostname: str = Query(...),
    ip_address: str = Query(...),
    access_type: str = Query(...),
    success: bool = Query(True),
    process_name: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Log file share access"""
    try:
        result = FileShareService.log_access(
            db, share_id, username, hostname, ip_address, access_type, success, None, process_name
        )
        return ShareAccessLogResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/file-shares/{share_id}/access-logs", response_model=List[ShareAccessLogResponse])
async def get_share_access_logs(
    share_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    hours: int = Query(24, ge=1, le=720),
    db: Session = Depends(get_db)
):
    """Get file share access logs"""
    logs = FileShareService.get_access_logs(db, share_id, skip, limit, hours)
    return [ShareAccessLogResponse(**l) for l in logs]

@router.get("/file-shares/{share_id}/stats", response_model=ShareStatsResponse)
async def get_file_share_stats(
    share_id: str,
    db: Session = Depends(get_db)
):
    """Get file share statistics"""
    stats = FileShareService.get_share_stats(db, share_id)
    if not stats:
        raise HTTPException(status_code=404, detail="File share not found")
    return ShareStatsResponse(**stats)

