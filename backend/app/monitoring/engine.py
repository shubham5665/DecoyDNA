"""
Real-time file monitoring engine using watchdog
"""
import os
import threading
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, Optional, Callable, List
from queue import Queue

try:
    from watchdog.observers import Observer
    from watchdog.events import FileSystemEventHandler, FileModifiedEvent
except ImportError:
    Observer = None
    FileSystemEventHandler = None

from app.utils.crypto import get_system_info, get_process_info, calculate_sha256
from app.config.settings import HONEYFILES_DIR

class ForensicCollector:
    """Collect forensic context when honeyfiles are accessed"""
    
    @staticmethod
    def collect_forensic_context(file_path: str,
                                event_type: str,
                                decoy_id: str) -> Dict[str, Any]:
        """Gather comprehensive forensic information"""
        forensic_data = {
            "event_type": event_type,
            "timestamp": datetime.utcnow().isoformat(),
            "decoy_id": decoy_id,
            "accessed_path": str(Path(file_path).resolve()),
        }
        
        # System information
        system_info = get_system_info()
        forensic_data.update(system_info)
        
        # File information
        try:
            file_stat = os.stat(file_path)
            forensic_data["file_size"] = file_stat.st_size
            forensic_data["file_access_time"] = datetime.fromtimestamp(file_stat.st_atime).isoformat()
            forensic_data["file_modify_time"] = datetime.fromtimestamp(file_stat.st_mtime).isoformat()
        except Exception as e:
            forensic_data["file_stat_error"] = str(e)
        
        # Process information
        try:
            import psutil
            current_process = psutil.Process()
            forensic_data["process_name"] = current_process.name()
            forensic_data["process_pid"] = current_process.pid
            forensic_data["process_command"] = " ".join(current_process.cmdline())
        except Exception as e:
            forensic_data["process_error"] = str(e)
        
        return forensic_data

class HoneyfileEventHandler(FileSystemEventHandler):
    """Watchdog event handler for honeyfile access detection"""
    
    def __init__(self, honeyfile_registry: Dict[str, str], 
                 event_callback: Callable[[Dict[str, Any]], None]):
        """
        Args:
            honeyfile_registry: Dict mapping file paths to decoy IDs
            event_callback: Callback function to process detected events
        """
        super().__init__()
        self.honeyfile_registry = honeyfile_registry
        self.event_callback = event_callback
    
    def on_modified(self, event):
        """Handle file modification events"""
        if event.is_directory:
            return
        self._check_honeyfile(event.src_path, "modified")
    
    def on_accessed(self, event):
        """Handle file access events"""
        if event.is_directory:
            return
        self._check_honeyfile(event.src_path, "accessed")
    
    def on_moved(self, event):
        """Handle file move events"""
        if event.is_directory:
            return
        self._check_honeyfile(event.dest_path, "moved")
        # Update registry if honeyfile was moved
        if event.src_path in self.honeyfile_registry:
            decoy_id = self.honeyfile_registry.pop(event.src_path)
            self.honeyfile_registry[event.dest_path] = decoy_id
    
    def on_created(self, event):
        """Handle file creation events"""
        if event.is_directory:
            return
        self._check_honeyfile(event.src_path, "created")
    
    def _check_honeyfile(self, file_path: str, event_type: str):
        """Check if accessed file is a tracked honeyfile"""
        # Normalize path
        normalized_path = str(Path(file_path).resolve())
        
        # Check if it's a honeyfile
        if normalized_path in self.honeyfile_registry:
            decoy_id = self.honeyfile_registry[normalized_path]
            
            # Collect forensic context
            forensic_context = ForensicCollector.collect_forensic_context(
                normalized_path,
                event_type,
                decoy_id
            )
            
            # Trigger callback
            self.event_callback(forensic_context)

class FileMonitoringEngine:
    """Main file monitoring engine"""
    
    def __init__(self, alert_callback: Optional[Callable[[Dict[str, Any]], None]] = None):
        """
        Args:
            alert_callback: Function to call when honeyfile access is detected
        """
        self.observer: Optional[Observer] = None
        self.is_running = False
        self.honeyfile_registry: Dict[str, str] = {}  # path -> decoy_id
        self.watched_directories: set = set()
        self.alert_callback = alert_callback
        self.event_queue: Queue = Queue()
        self.event_thread = None
    
    def register_honeyfile(self, file_path: str, decoy_id: str, seed_locations: List[str]):
        """Register a honeyfile for monitoring"""
        # Register main file
        normalized_path = str(Path(file_path).resolve())
        self.honeyfile_registry[normalized_path] = decoy_id
        
        # Register all seed locations
        if seed_locations:
            for seed_dir in seed_locations:
                if os.path.isdir(seed_dir):
                    self.watched_directories.add(seed_dir)
                    # Also check for files in seed directory
                    for filename in os.listdir(seed_dir):
                        full_path = os.path.join(seed_dir, filename)
                        if file_path.endswith(os.path.basename(full_path)):
                            self.honeyfile_registry[str(Path(full_path).resolve())] = decoy_id
    
    def start(self, directories: Optional[List[str]] = None):
        """Start monitoring for honeyfile access"""
        if self.is_running:
            return
        
        if Observer is None:
            raise ImportError("watchdog is required. Install: pip install watchdog")
        
        # Use provided directories or default
        if directories is None:
            directories = list(self.watched_directories)
        else:
            self.watched_directories.update(directories)
        
        if not self.watched_directories:
            raise ValueError("No directories to monitor")
        
        self.observer = Observer()
        event_handler = HoneyfileEventHandler(
            self.honeyfile_registry,
            self._handle_event
        )
        
        # Watch all directories
        for directory in self.watched_directories:
            if os.path.isdir(directory):
                self.observer.schedule(event_handler, directory, recursive=True)
        
        self.observer.start()
        self.is_running = True
        
        # Start event processing thread
        self.event_thread = threading.Thread(target=self._process_events, daemon=True)
        self.event_thread.start()
    
    def stop(self):
        """Stop monitoring"""
        if not self.is_running:
            return
        
        if self.observer:
            self.observer.stop()
            self.observer.join(timeout=5)
        
        self.is_running = False
    
    def _handle_event(self, forensic_context: Dict[str, Any]):
        """Internal handler for detected events"""
        self.event_queue.put(forensic_context)
    
    def _process_events(self):
        """Process events from queue and trigger callbacks"""
        while self.is_running:
            try:
                event = self.event_queue.get(timeout=1)
                if self.alert_callback:
                    self.alert_callback(event)
            except:
                continue
    
    def get_registered_honeyfiles(self) -> Dict[str, str]:
        """Get all registered honeyfiles"""
        return self.honeyfile_registry.copy()
    
    def get_status(self) -> Dict[str, Any]:
        """Get current monitoring status"""
        return {
            "is_running": self.is_running,
            "total_honeyfiles": len(self.honeyfile_registry),
            "watched_directories": list(self.watched_directories),
            "queue_size": self.event_queue.qsize()
        }
