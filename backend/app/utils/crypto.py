"""
Utility functions for cryptography, hashing, and forensics
"""
import hashlib
import secrets
import socket
import psutil
import platform
import uuid
from pathlib import Path
from typing import Optional, Dict, Any
import json

def calculate_sha256(file_path: str) -> str:
    """Calculate SHA256 hash of a file"""
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

def generate_decoy_id(seed: str) -> str:
    """Generate unique DecoyDNA ID using seed and random component"""
    random_suffix = secrets.token_hex(8)
    combined = f"{seed}_{random_suffix}"
    decoy_id = hashlib.sha256(combined.encode()).hexdigest()[:16]
    return decoy_id

def generate_zero_width_watermark(decoy_id: str) -> str:
    """
    Generate zero-width Unicode characters that encode the decoy ID.
    Uses invisible Unicode characters: U+200B (ZERO WIDTH SPACE), 
    U+200C (ZERO WIDTH NON-JOINER), U+200D (ZERO WIDTH JOINER)
    """
    # Map hex chars to zero-width sequences
    watermark = ""
    for char in decoy_id:
        if char in "0123456789":
            # Use different patterns for digits and letters
            watermark += "\u200b" * (int(char) + 1)  # Zero-width spaces
        else:
            watermark += "\u200c" + char + "\u200d"  # Wrapped in zero-width joiners
    return watermark

def get_system_info() -> Dict[str, Any]:
    """Gather comprehensive system information for forensics"""
    try:
        # Get network info
        hostname = socket.gethostname()
        internal_ip = socket.gethostbyname(hostname)
        
        # Get MAC address
        mac_address = ":".join(["{:02x}".format((uuid.getnode() >> ele) & 0xff)
                               for ele in range(0, 48, 8)][::-1])
        
        # Get username
        import getpass
        username = getpass.getuser()
        
        # Get platform info
        system = platform.system()
        release = platform.release()
        
        return {
            "hostname": hostname,
            "internal_ip": internal_ip,
            "mac_address": mac_address,
            "username": username,
            "system": system,
            "release": release,
            "platform": platform.platform(),
        }
    except Exception as e:
        return {"error": str(e)}

def get_process_info(pid: Optional[int] = None) -> Dict[str, Any]:
    """Get information about a process"""
    try:
        if pid is None:
            process = psutil.Process()
        else:
            process = psutil.Process(pid)
        
        return {
            "pid": process.pid,
            "name": process.name(),
            "command_line": " ".join(process.cmdline()),
            "create_time": process.create_time(),
            "status": process.status(),
        }
    except Exception as e:
        return {"error": str(e)}

def hash_metadata(metadata: Dict[str, Any]) -> str:
    """Generate hash of metadata for verification"""
    json_str = json.dumps(metadata, sort_keys=True, default=str)
    return hashlib.sha256(json_str.encode()).hexdigest()

def sanitize_path(path: str) -> str:
    """Sanitize file path for security"""
    return str(Path(path).resolve())
