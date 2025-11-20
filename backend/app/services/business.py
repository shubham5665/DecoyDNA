"""
Business logic services for DecoyDNA
"""
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_, or_

from app.db.database import SessionLocal
from app.models.database_models import Honeyfile, AccessEvent, AlertSetting, MonitoringStatus
from app.honeyfiles.generator import HoneyfileGenerator
from app.monitoring.engine import FileMonitoringEngine
from app.alerts.handlers import AlertManager
import json

# Global instances
honeyfile_generator = HoneyfileGenerator()
monitoring_engine = FileMonitoringEngine(alert_callback=None)
alert_manager = AlertManager()
_monitoring_status = {"is_running": False, "started_at": None}

class HoneyfileService:
    """Service for honeyfile operations"""
    
    @staticmethod
    def create_honeyfile(db: Session, 
                        file_name: str,
                        file_type: str,
                        template_type: str,
                        seed_locations: List[str]) -> Dict[str, Any]:
        """Create a new honeyfile"""
        # Generate honeyfile
        result = honeyfile_generator.generate_honeyfile(file_name, file_type, template_type)
        
        # Store in database
        honeyfile = Honeyfile(
            decoy_id=result["decoy_id"],
            file_name=file_name,
            file_type=file_type,
            template_type=template_type,
            expected_hash=result["expected_hash"],
            file_path=result["file_path"],
            seed_locations=seed_locations,
            metadata_json={
                "watermark_techniques": result["watermark_techniques"],
                "created_at": result["created_at"]
            }
        )
        
        db.add(honeyfile)
        db.commit()
        db.refresh(honeyfile)
        
        # Register with monitoring engine
        monitoring_engine.register_honeyfile(
            result["file_path"],
            result["decoy_id"],
            seed_locations
        )
        
        return {
            "id": honeyfile.id,
            "decoy_id": honeyfile.decoy_id,
            "file_name": honeyfile.file_name,
            "file_type": honeyfile.file_type,
            "template_type": honeyfile.template_type,
            "created_at": honeyfile.created_at,
            "expected_hash": honeyfile.expected_hash,
            "file_path": honeyfile.file_path,
            "seed_locations": honeyfile.seed_locations,
        }
    
    @staticmethod
    def list_honeyfiles(db: Session, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        """List all honeyfiles"""
        honeyfiles = db.query(Honeyfile).offset(skip).limit(limit).all()
        return [
            {
                "id": h.id,
                "decoy_id": h.decoy_id,
                "file_name": h.file_name,
                "file_type": h.file_type,
                "template_type": h.template_type,
                "created_at": h.created_at,
                "expected_hash": h.expected_hash,
                "file_path": h.file_path,
                "seed_locations": h.seed_locations,
            }
            for h in honeyfiles
        ]
    
    @staticmethod
    def get_honeyfile(db: Session, decoy_id: str) -> Optional[Dict[str, Any]]:
        """Get honeyfile by decoy_id"""
        honeyfile = db.query(Honeyfile).filter(Honeyfile.decoy_id == decoy_id).first()
        if not honeyfile:
            return None
        return {
            "id": honeyfile.id,
            "decoy_id": honeyfile.decoy_id,
            "file_name": honeyfile.file_name,
            "file_type": honeyfile.file_type,
            "template_type": honeyfile.template_type,
            "created_at": honeyfile.created_at,
            "expected_hash": honeyfile.expected_hash,
            "file_path": honeyfile.file_path,
            "seed_locations": honeyfile.seed_locations,
        }
    
    @staticmethod
    def search_honeyfiles(db: Session, query: str, search_type: str = "decoy_id") -> List[Dict[str, Any]]:
        """Search honeyfiles by decoy_id, file_name, or template_type"""
        search_pattern = f"%{query}%"
        
        if search_type == "decoy_id":
            honeyfiles = db.query(Honeyfile).filter(Honeyfile.decoy_id.ilike(search_pattern)).all()
        elif search_type == "file_name":
            honeyfiles = db.query(Honeyfile).filter(Honeyfile.file_name.ilike(search_pattern)).all()
        elif search_type == "template_type":
            honeyfiles = db.query(Honeyfile).filter(Honeyfile.template_type.ilike(search_pattern)).all()
        else:
            # Search all fields
            honeyfiles = db.query(Honeyfile).filter(
                or_(
                    Honeyfile.decoy_id.ilike(search_pattern),
                    Honeyfile.file_name.ilike(search_pattern),
                    Honeyfile.template_type.ilike(search_pattern)
                )
            ).all()
        
        return [
            {
                "id": h.id,
                "decoy_id": h.decoy_id,
                "file_name": h.file_name,
                "file_type": h.file_type,
                "template_type": h.template_type,
                "created_at": h.created_at,
                "expected_hash": h.expected_hash,
                "file_path": h.file_path,
                "seed_locations": h.seed_locations,
            }
            for h in honeyfiles
        ]

class EventService:
    """Service for access event operations"""
    
    @staticmethod
    def create_event(db: Session, forensic_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new access event"""
        event = AccessEvent(
            decoy_id=forensic_data.get("decoy_id"),
            event_type=forensic_data.get("event_type", "unknown"),
            timestamp=datetime.fromisoformat(forensic_data.get("timestamp", datetime.utcnow().isoformat())),
            accessed_path=forensic_data.get("accessed_path"),
            username=forensic_data.get("username", "unknown"),
            hostname=forensic_data.get("hostname", "unknown"),
            internal_ip=forensic_data.get("internal_ip"),
            mac_address=forensic_data.get("mac_address"),
            process_name=forensic_data.get("process_name"),
            process_command=forensic_data.get("process_command"),
            file_hash=forensic_data.get("file_hash"),
            source_ip=forensic_data.get("source_ip"),
            forensic_json=forensic_data,
        )
        
        db.add(event)
        db.commit()
        db.refresh(event)
        
        return {
            "id": event.id,
            "decoy_id": event.decoy_id,
            "event_type": event.event_type,
            "timestamp": event.timestamp,
            "accessed_path": event.accessed_path,
            "username": event.username,
            "hostname": event.hostname,
        }
    
    @staticmethod
    def get_events(db: Session, 
                  skip: int = 0,
                  limit: int = 100,
                  decoy_id: Optional[str] = None,
                  hours: int = 24) -> List[Dict[str, Any]]:
        """Get access events"""
        query = db.query(AccessEvent)
        
        # Filter by decoy_id if provided
        if decoy_id:
            query = query.filter(AccessEvent.decoy_id == decoy_id)
        
        # Filter by time
        time_threshold = datetime.utcnow() - timedelta(hours=hours)
        query = query.filter(AccessEvent.timestamp >= time_threshold)
        
        # Order by timestamp descending
        events = query.order_by(desc(AccessEvent.timestamp)).offset(skip).limit(limit).all()
        
        return [
            {
                "id": e.id,
                "decoy_id": e.decoy_id,
                "event_type": e.event_type,
                "timestamp": e.timestamp,
                "accessed_path": e.accessed_path,
                "username": e.username,
                "hostname": e.hostname,
                "process_name": e.process_name,
                "process_command": e.process_command,
            }
            for e in events
        ]
    
    @staticmethod
    def count_events_today(db: Session, decoy_id: Optional[str] = None) -> int:
        """Count events in last 24 hours"""
        query = db.query(AccessEvent)
        
        if decoy_id:
            query = query.filter(AccessEvent.decoy_id == decoy_id)
        
        time_threshold = datetime.utcnow() - timedelta(hours=24)
        query = query.filter(AccessEvent.timestamp >= time_threshold)
        
        return query.count()

class MonitoringService:
    """Service for monitoring operations"""
    
    @staticmethod
    async def start_monitoring(db: Session, directories: Optional[List[str]] = None) -> Dict[str, Any]:
        """Start file monitoring"""
        global _monitoring_status
        
        if _monitoring_status["is_running"]:
            return {"status": "already_running"}
        
        try:
            # Load all honeyfiles from database
            honeyfiles = db.query(Honeyfile).all()
            for hf in honeyfiles:
                monitoring_engine.register_honeyfile(
                    hf.file_path,
                    hf.decoy_id,
                    hf.seed_locations or []
                )
            
            # Start monitoring
            monitoring_engine.start(directories)
            
            _monitoring_status["is_running"] = True
            _monitoring_status["started_at"] = datetime.utcnow()
            
            return {
                "status": "started",
                "timestamp": _monitoring_status["started_at"],
                "honeyfiles_registered": len(honeyfiles)
            }
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    @staticmethod
    def stop_monitoring() -> Dict[str, Any]:
        """Stop file monitoring"""
        global _monitoring_status
        
        if not _monitoring_status["is_running"]:
            return {"status": "not_running"}
        
        monitoring_engine.stop()
        _monitoring_status["is_running"] = False
        
        return {"status": "stopped"}
    
    @staticmethod
    def get_monitoring_status(db: Session) -> Dict[str, Any]:
        """Get current monitoring status"""
        honeyfiles_count = db.query(Honeyfile).count()
        events_today = EventService.count_events_today(db)
        
        return {
            "is_running": _monitoring_status["is_running"],
            "started_at": _monitoring_status["started_at"],
            "last_heartbeat": _monitoring_status.get("started_at"),
            "honeyfiles_registered": honeyfiles_count,
            "events_today": events_today,
            "engine_status": monitoring_engine.get_status()
        }

class AlertService:
    """Service for alert operations"""
    
    @staticmethod
    async def send_alert(event: Dict[str, Any]) -> Dict[str, bool]:
        """Send alert for an event"""
        return await alert_manager.send_alert(event)
    
    @staticmethod
    def get_alert_settings(db: Session) -> Dict[str, Dict[str, Any]]:
        """Get current alert settings"""
        settings = db.query(AlertSetting).all()
        return {
            s.alert_type: {
                "id": s.id,
                "enabled": s.enabled == "true",
                "config": s.config_json or {}
            }
            for s in settings
        }
    
    @staticmethod
    def update_alert_setting(db: Session,
                           alert_type: str,
                           enabled: bool,
                           config: Dict[str, Any]) -> Dict[str, Any]:
        """Update alert settings"""
        setting = db.query(AlertSetting).filter(AlertSetting.alert_type == alert_type).first()
        
        if not setting:
            setting = AlertSetting(
                alert_type=alert_type,
                enabled="true" if enabled else "false",
                config_json=config
            )
            db.add(setting)
        else:
            setting.enabled = "true" if enabled else "false"
            setting.config_json = config
            setting.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(setting)
        
        return {
            "id": setting.id,
            "alert_type": setting.alert_type,
            "enabled": setting.enabled == "true",
            "config": setting.config_json or {}
        }

class DashboardService:
    """Service for dashboard statistics"""
    
    @staticmethod
    def get_dashboard_stats(db: Session) -> Dict[str, Any]:
        """Get dashboard statistics"""
        total_honeyfiles = db.query(Honeyfile).count()
        total_events = db.query(AccessEvent).count()
        alerts_today = EventService.count_events_today(db)
        
        # Events in last hour
        one_hour_ago = datetime.utcnow() - timedelta(hours=1)
        events_last_hour = db.query(AccessEvent).filter(
            AccessEvent.timestamp >= one_hour_ago
        ).count()
        
        return {
            "total_honeyfiles": total_honeyfiles,
            "total_events": total_events,
            "alerts_today": alerts_today,
            "events_last_hour": events_last_hour,
            "monitoring_status": _monitoring_status["is_running"],
            "uptime_started": _monitoring_status["started_at"]
        }
