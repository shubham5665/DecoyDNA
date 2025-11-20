"""
File Sharing Models for DecoyDNA
"""
from sqlalchemy import Column, String, DateTime, Boolean, Integer, Text
from datetime import datetime
import uuid

from app.db.database import Base


class FileShare(Base):
    """File sharing network model"""
    __tablename__ = "file_shares"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    share_name = Column(String(255), nullable=False)
    share_path = Column(String(1000), nullable=False)
    description = Column(Text, nullable=True)
    is_sensitive = Column(Boolean, default=True)
    shared_with_users = Column(String(1000), nullable=True)  # Comma-separated
    shared_with_groups = Column(String(1000), nullable=True)  # Comma-separated
    access_count = Column(Integer, default=0)
    last_accessed = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)


class ShareAccessLog(Base):
    """Log for file share access"""
    __tablename__ = "share_access_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    share_id = Column(String, nullable=False)
    username = Column(String(255), nullable=False)
    hostname = Column(String(255), nullable=False)
    ip_address = Column(String(45), nullable=False)
    access_type = Column(String(50), nullable=False)  # read, write, execute, delete
    accessed_at = Column(DateTime, default=datetime.utcnow)
    success = Column(Boolean, default=True)
    error_message = Column(Text, nullable=True)
    process_name = Column(String(255), nullable=True)
