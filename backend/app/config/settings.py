"""
Configuration settings for DecoyDNA application
"""
import os
from pathlib import Path
from typing import Optional

# ==================== DATABASE ====================
DATABASE_URL = "sqlite:///./decoydna.db"
HONEYFILES_DIR = os.path.join(os.path.expanduser("~"), ".decoydna", "honeyfiles")
FORENSIC_LOGS_DIR = os.path.join(os.path.expanduser("~"), ".decoydna", "forensics")

# ==================== ALERTING ====================
SLACK_WEBHOOK_URL: Optional[str] = os.getenv("SLACK_WEBHOOK_URL", None)
EMAIL_FROM = os.getenv("EMAIL_FROM", "decoydna@enterprise.com")
EMAIL_SMTP_SERVER = os.getenv("EMAIL_SMTP_SERVER", "smtp.gmail.com")
EMAIL_SMTP_PORT = int(os.getenv("EMAIL_SMTP_PORT", "587"))
EMAIL_SMTP_USER = os.getenv("EMAIL_SMTP_USER", "")
EMAIL_SMTP_PASSWORD = os.getenv("EMAIL_SMTP_PASSWORD", "")

# ==================== MONITORING ====================
MONITORING_ENABLED = False
MONITORED_DIRECTORIES = [
    os.path.expanduser("~") + "/Documents",
    os.path.expanduser("~") + "/Desktop",
    os.path.expanduser("~") + "/Downloads",
]

# ==================== API ====================
API_HOST = "127.0.0.1"
API_PORT = 8000
API_DEBUG = True

# ==================== WATERMARKING ====================
WATERMARK_SEED = "DecoyDNA_Enterprise_v1"

# Create necessary directories
os.makedirs(HONEYFILES_DIR, exist_ok=True)
os.makedirs(FORENSIC_LOGS_DIR, exist_ok=True)
