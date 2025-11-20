"""
Pydantic schemas for API requests and responses
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# ==================== HONEYFILE SCHEMAS ====================
class HoneyfileCreateRequest(BaseModel):
    """Request to create a new honeyfile"""
    file_name: str = Field(..., description="Name of the honeyfile")
    file_type: str = Field(..., description="Type: docx, xlsx, or pdf")
    template_type: str = Field(..., description="Template: passwords, salaries, project_secrets")
    seed_locations: List[str] = Field(default_factory=list, description="Directories to plant file")

class HoneyfileResponse(BaseModel):
    """Response containing honeyfile details"""
    id: str
    decoy_id: str
    file_name: str
    file_type: str
    template_type: str
    created_at: datetime
    expected_hash: str
    seed_locations: Optional[List[str]] = None
    file_path: Optional[str] = None

    class Config:
        from_attributes = True

# ==================== EVENT SCHEMAS ====================
class ForensicContext(BaseModel):
    """Forensic context from event"""
    timestamp: datetime
    username: str
    hostname: str
    internal_ip: Optional[str]
    mac_address: Optional[str]
    process_name: Optional[str]
    process_command: Optional[str]
    accessed_path: str
    file_hash: Optional[str]

class AccessEventResponse(BaseModel):
    """Response containing access event details"""
    id: str
    decoy_id: str
    event_type: str
    timestamp: datetime
    accessed_path: str
    username: str
    hostname: str
    internal_ip: Optional[str]
    mac_address: Optional[str]
    process_name: Optional[str]
    process_command: Optional[str]
    file_hash: Optional[str]
    alert_sent: Optional[bool] = False

    class Config:
        from_attributes = True

# ==================== ALERT SCHEMAS ====================
class AlertSettingsRequest(BaseModel):
    """Request to update alert settings"""
    alert_type: str = Field(..., description="slack or email")
    enabled: bool
    config: Dict[str, Any] = Field(default_factory=dict)

class AlertSettingsResponse(BaseModel):
    """Response containing alert settings"""
    id: str
    alert_type: str
    enabled: bool
    config_json: Optional[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ==================== MONITORING SCHEMAS ====================
class MonitoringStatusRequest(BaseModel):
    """Request to start/stop monitoring"""
    action: str = Field(..., description="start or stop")

class MonitoringStatusResponse(BaseModel):
    """Response containing monitoring status"""
    is_running: bool
    started_at: Optional[datetime]
    last_heartbeat: Optional[datetime]
    total_events: int
    error_count: int

# ==================== WEBSOCKET SCHEMAS ====================
class WebSocketEvent(BaseModel):
    """Event sent over WebSocket to frontend"""
    event_type: str
    timestamp: datetime
    data: Dict[str, Any]
    severity: str = Field(default="info", description="info, warning, critical")

# ==================== STATS SCHEMAS ====================
class DashboardStats(BaseModel):
    """Dashboard statistics"""
    total_honeyfiles: int
    total_events: int
    alerts_today: int
    monitoring_status: bool
    events_last_hour: int

# ==================== FILE SHARING SCHEMAS ====================
class FileShareCreateRequest(BaseModel):
    """Request to create a file share"""
    share_name: str = Field(..., description="Name of the file share")
    share_path: str = Field(..., description="Network path to share")
    description: Optional[str] = None
    is_sensitive: bool = Field(default=True, description="Mark as sensitive data")
    shared_with_users: Optional[List[str]] = None
    shared_with_groups: Optional[List[str]] = None

class FileShareResponse(BaseModel):
    """Response containing file share details"""
    id: str
    share_name: str
    share_path: str
    description: Optional[str]
    is_sensitive: bool
    shared_with_users: List[str]
    shared_with_groups: List[str]
    access_count: int
    last_accessed: Optional[datetime]
    created_at: datetime
    is_active: bool

    class Config:
        from_attributes = True

class ShareAccessLogResponse(BaseModel):
    """Response containing share access log"""
    id: str
    share_id: str
    username: str
    hostname: str
    ip_address: str
    access_type: str
    accessed_at: datetime
    success: bool
    error_message: Optional[str]
    process_name: Optional[str]

    class Config:
        from_attributes = True

class ShareStatsResponse(BaseModel):
    """Response containing share statistics"""
    share_id: str
    total_accesses: int
    last_accessed: Optional[datetime]
    recent_accesses: int
    unique_users: int
    access_types: Dict[str, int]

