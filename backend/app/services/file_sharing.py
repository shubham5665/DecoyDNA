"""
File Sharing Service for DecoyDNA
"""
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.file_sharing import FileShare, ShareAccessLog
from datetime import datetime, timedelta
from typing import List, Optional
import uuid


class FileShareService:
    """Service for managing file shares"""

    @staticmethod
    def create_share(
        db: Session,
        share_name: str,
        share_path: str,
        description: str = None,
        is_sensitive: bool = True,
        shared_with_users: List[str] = None,
        shared_with_groups: List[str] = None
    ) -> dict:
        """Create a new file share"""
        try:
            share = FileShare(
                share_name=share_name,
                share_path=share_path,
                description=description,
                is_sensitive=is_sensitive,
                shared_with_users=",".join(shared_with_users) if shared_with_users else None,
                shared_with_groups=",".join(shared_with_groups) if shared_with_groups else None
            )
            db.add(share)
            db.commit()
            db.refresh(share)
            return FileShareService._share_to_dict(share)
        except Exception as e:
            db.rollback()
            raise Exception(f"Failed to create file share: {str(e)}")

    @staticmethod
    def list_shares(db: Session, skip: int = 0, limit: int = 100) -> List[dict]:
        """List all file shares"""
        shares = db.query(FileShare).filter(FileShare.is_active == True).offset(skip).limit(limit).all()
        return [FileShareService._share_to_dict(s) for s in shares]

    @staticmethod
    def get_share(db: Session, share_id: str) -> Optional[dict]:
        """Get specific file share"""
        share = db.query(FileShare).filter(FileShare.id == share_id, FileShare.is_active == True).first()
        return FileShareService._share_to_dict(share) if share else None

    @staticmethod
    def update_share(
        db: Session,
        share_id: str,
        **kwargs
    ) -> dict:
        """Update file share"""
        try:
            share = db.query(FileShare).filter(FileShare.id == share_id).first()
            if not share:
                raise Exception("Share not found")

            # Update fields
            for key, value in kwargs.items():
                if key == 'shared_with_users' and isinstance(value, list):
                    setattr(share, key, ",".join(value))
                elif key == 'shared_with_groups' and isinstance(value, list):
                    setattr(share, key, ",".join(value))
                elif hasattr(share, key):
                    setattr(share, key, value)

            share.updated_at = datetime.utcnow()
            db.commit()
            db.refresh(share)
            return FileShareService._share_to_dict(share)
        except Exception as e:
            db.rollback()
            raise Exception(f"Failed to update file share: {str(e)}")

    @staticmethod
    def delete_share(db: Session, share_id: str) -> bool:
        """Soft delete file share"""
        try:
            share = db.query(FileShare).filter(FileShare.id == share_id).first()
            if not share:
                raise Exception("Share not found")
            share.is_active = False
            db.commit()
            return True
        except Exception as e:
            db.rollback()
            raise Exception(f"Failed to delete file share: {str(e)}")

    @staticmethod
    def log_access(
        db: Session,
        share_id: str,
        username: str,
        hostname: str,
        ip_address: str,
        access_type: str,
        success: bool = True,
        error_message: str = None,
        process_name: str = None
    ) -> dict:
        """Log file share access"""
        try:
            log = ShareAccessLog(
                share_id=share_id,
                username=username,
                hostname=hostname,
                ip_address=ip_address,
                access_type=access_type,
                success=success,
                error_message=error_message,
                process_name=process_name
            )
            db.add(log)

            # Update access count
            share = db.query(FileShare).filter(FileShare.id == share_id).first()
            if share:
                share.access_count += 1
                share.last_accessed = datetime.utcnow()

            db.commit()
            db.refresh(log)
            return FileShareService._log_to_dict(log)
        except Exception as e:
            db.rollback()
            raise Exception(f"Failed to log access: {str(e)}")

    @staticmethod
    def get_access_logs(
        db: Session,
        share_id: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
        hours: int = 24
    ) -> List[dict]:
        """Get access logs"""
        query = db.query(ShareAccessLog)

        if share_id:
            query = query.filter(ShareAccessLog.share_id == share_id)

        # Filter by time range
        cutoff_time = datetime.utcnow() - timedelta(hours=hours)
        query = query.filter(ShareAccessLog.accessed_at >= cutoff_time)

        logs = query.order_by(desc(ShareAccessLog.accessed_at)).offset(skip).limit(limit).all()
        return [FileShareService._log_to_dict(l) for l in logs]

    @staticmethod
    def get_share_stats(db: Session, share_id: str) -> dict:
        """Get share statistics"""
        share = db.query(FileShare).filter(FileShare.id == share_id).first()
        if not share:
            return {}

        # Get logs for last 7 days
        cutoff_time = datetime.utcnow() - timedelta(days=7)
        recent_logs = db.query(ShareAccessLog).filter(
            ShareAccessLog.share_id == share_id,
            ShareAccessLog.accessed_at >= cutoff_time
        ).all()

        # Get unique users
        unique_users = set(log.username for log in recent_logs)

        # Get access types
        access_types = {}
        for log in recent_logs:
            access_types[log.access_type] = access_types.get(log.access_type, 0) + 1

        return {
            "share_id": share_id,
            "total_accesses": share.access_count,
            "last_accessed": share.last_accessed,
            "recent_accesses": len(recent_logs),
            "unique_users": len(unique_users),
            "access_types": access_types
        }

    @staticmethod
    def _share_to_dict(share: FileShare) -> dict:
        """Convert share object to dictionary"""
        if not share:
            return None
        return {
            "id": share.id,
            "share_name": share.share_name,
            "share_path": share.share_path,
            "description": share.description,
            "is_sensitive": share.is_sensitive,
            "shared_with_users": share.shared_with_users.split(",") if share.shared_with_users else [],
            "shared_with_groups": share.shared_with_groups.split(",") if share.shared_with_groups else [],
            "access_count": share.access_count,
            "last_accessed": share.last_accessed,
            "created_at": share.created_at,
            "is_active": share.is_active
        }

    @staticmethod
    def _log_to_dict(log: ShareAccessLog) -> dict:
        """Convert log object to dictionary"""
        if not log:
            return None
        return {
            "id": log.id,
            "share_id": log.share_id,
            "username": log.username,
            "hostname": log.hostname,
            "ip_address": log.ip_address,
            "access_type": log.access_type,
            "accessed_at": log.accessed_at,
            "success": log.success,
            "error_message": log.error_message,
            "process_name": log.process_name
        }
