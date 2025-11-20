"""
SQLAlchemy ORM models for DecoyDNA
"""
from sqlalchemy import Column, String, DateTime, Text, Integer, JSON
from sqlalchemy.sql import func
from datetime import datetime
import uuid

from app.db.database import Base

class Honeyfile(Base):
    """Model for tracking generated honeyfiles and their decoy IDs"""
    __tablename__ = "honeyfiles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    decoy_id = Column(String(64), unique=True, nullable=False, index=True)
    file_name = Column(String(255), nullable=False)
    file_type = Column(String(20), nullable=False)  # docx, xlsx, pdf
    template_type = Column(String(100), nullable=False)  # passwords, salaries, project_secrets
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expected_hash = Column(String(64), nullable=False)  # SHA256
    seed_locations = Column(JSON, nullable=True)  # List of directories where file was planted
    file_path = Column(String(512), nullable=True)
    metadata_json = Column(JSON, nullable=True)

class AccessEvent(Base):
    """Model for file access events captured by monitoring engine"""
    __tablename__ = "access_events"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    decoy_id = Column(String(64), nullable=False, index=True)
    event_type = Column(String(50), nullable=False)  # read, copy, move, open, execute
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    accessed_path = Column(String(512), nullable=False)
    username = Column(String(255), nullable=False)
    hostname = Column(String(255), nullable=False)
    internal_ip = Column(String(45), nullable=True)
    mac_address = Column(String(17), nullable=True)
    process_name = Column(String(255), nullable=True)
    process_command = Column(String(512), nullable=True)
    file_hash = Column(String(64), nullable=True)
    source_ip = Column(String(45), nullable=True)
    forensic_json = Column(JSON, nullable=True)
    alert_sent = Column(String(50), default="pending", nullable=False)  # pending, sent, failed

class AlertSetting(Base):
    """Model for alert configuration"""
    __tablename__ = "alert_settings"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    alert_type = Column(String(50), nullable=False, unique=True)  # slack, email
    enabled = Column(String(5), default="false", nullable=False)
    config_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class MonitoringStatus(Base):
    """Model for tracking monitoring engine status"""
    __tablename__ = "monitoring_status"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    is_running = Column(String(5), default="false", nullable=False)
    started_at = Column(DateTime, nullable=True)
    last_heartbeat = Column(DateTime, nullable=True)
    total_events = Column(Integer, default=0)
    error_count = Column(Integer, default=0)
