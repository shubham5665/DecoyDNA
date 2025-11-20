"""
Alerting system for Slack and Email notifications
"""
import asyncio
import json
from typing import Dict, Any, Optional
from datetime import datetime
from abc import ABC, abstractmethod

try:
    import aiohttp
except ImportError:
    aiohttp = None

try:
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
except ImportError:
    smtplib = None

from app.config.settings import (
    SLACK_WEBHOOK_URL,
    EMAIL_FROM,
    EMAIL_SMTP_SERVER,
    EMAIL_SMTP_PORT,
    EMAIL_SMTP_USER,
    EMAIL_SMTP_PASSWORD
)

class AlertHandler(ABC):
    """Base class for alert handlers"""
    
    @abstractmethod
    async def send(self, event: Dict[str, Any]) -> bool:
        """Send alert for an event"""
        pass

class SlackAlertHandler(AlertHandler):
    """Send alerts to Slack"""
    
    def __init__(self, webhook_url: str):
        self.webhook_url = webhook_url
    
    async def send(self, event: Dict[str, Any]) -> bool:
        """Send alert to Slack webhook"""
        if not self.webhook_url:
            return False
        
        try:
            if aiohttp is None:
                raise ImportError("aiohttp is required")
            
            # Format message
            message = self._format_message(event)
            
            async with aiohttp.ClientSession() as session:
                async with session.post(self.webhook_url, json=message) as resp:
                    return resp.status == 200
        except Exception as e:
            print(f"Slack alert failed: {e}")
            return False
    
    @staticmethod
    def _format_message(event: Dict[str, Any]) -> Dict[str, Any]:
        """Format event as Slack message"""
        timestamp = event.get("timestamp", "Unknown")
        decoy_id = event.get("decoy_id", "Unknown")
        event_type = event.get("event_type", "unknown")
        username = event.get("username", "unknown")
        hostname = event.get("hostname", "unknown")
        process_name = event.get("process_name", "unknown")
        
        color = "#FF0000"  # Red for critical
        if event_type == "accessed":
            color = "#FFA500"  # Orange for warning
        
        return {
            "text": "🚨 DecoyDNA Honeyfile Access Detected",
            "attachments": [
                {
                    "color": color,
                    "fields": [
                        {"title": "Decoy ID", "value": decoy_id[:16], "short": True},
                        {"title": "Event Type", "value": event_type, "short": True},
                        {"title": "Username", "value": username, "short": True},
                        {"title": "Hostname", "value": hostname, "short": True},
                        {"title": "Process", "value": process_name, "short": True},
                        {"title": "Timestamp", "value": str(timestamp), "short": True},
                        {"title": "Path", "value": event.get("accessed_path", "N/A"), "short": False},
                    ],
                    "footer": "DecoyDNA Enterprise Monitoring",
                    "ts": int(datetime.utcnow().timestamp())
                }
            ]
        }

class EmailAlertHandler(AlertHandler):
    """Send alerts via Email"""
    
    def __init__(self, 
                 smtp_server: str,
                 smtp_port: int,
                 smtp_user: str,
                 smtp_password: str,
                 from_address: str,
                 to_addresses: list):
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.smtp_user = smtp_user
        self.smtp_password = smtp_password
        self.from_address = from_address
        self.to_addresses = to_addresses
    
    async def send(self, event: Dict[str, Any]) -> bool:
        """Send alert via email"""
        if not self.to_addresses:
            return False
        
        try:
            if smtplib is None:
                raise ImportError("smtplib is required")
            
            # Format message
            subject, body = self._format_message(event)
            
            # Create email
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = self.from_address
            msg["To"] = ", ".join(self.to_addresses)
            
            # Attach HTML body
            msg.attach(MIMEText(body, "html"))
            
            # Send email (non-blocking simulation)
            await asyncio.to_thread(self._send_smtp, msg)
            return True
        except Exception as e:
            print(f"Email alert failed: {e}")
            return False
    
    def _send_smtp(self, msg):
        """Send SMTP message (blocking)"""
        with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
            server.starttls()
            server.login(self.smtp_user, self.smtp_password)
            server.sendmail(self.from_address, self.to_addresses, msg.as_string())
    
    @staticmethod
    def _format_message(event: Dict[str, Any]) -> tuple:
        """Format event as email message"""
        decoy_id = event.get("decoy_id", "Unknown")
        event_type = event.get("event_type", "unknown").upper()
        username = event.get("username", "unknown")
        hostname = event.get("hostname", "unknown")
        timestamp = event.get("timestamp", "Unknown")
        
        subject = f"🚨 DecoyDNA ALERT: Honeyfile {event_type} Detected"
        
        body = f"""
        <html>
            <body style="font-family: Arial, sans-serif;">
                <div style="background: #f0f0f0; padding: 20px; border-radius: 5px;">
                    <h2 style="color: #d9534f;">DECOY DNA SECURITY ALERT</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="background: #fff;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Alert Type:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">Honeyfile Access Detected</td>
                        </tr>
                        <tr style="background: #f9f9f9;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Event Type:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">{event_type}</td>
                        </tr>
                        <tr style="background: #fff;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Decoy ID:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;"><code>{decoy_id}</code></td>
                        </tr>
                        <tr style="background: #f9f9f9;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Username:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">{username}</td>
                        </tr>
                        <tr style="background: #fff;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Hostname:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">{hostname}</td>
                        </tr>
                        <tr style="background: #f9f9f9;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Timestamp:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">{timestamp}</td>
                        </tr>
                        <tr style="background: #fff;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Process:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">{event.get('process_name', 'N/A')}</td>
                        </tr>
                        <tr style="background: #f9f9f9;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Path:</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;"><code>{event.get('accessed_path', 'N/A')}</code></td>
                        </tr>
                    </table>
                    <p style="margin-top: 20px; color: #666; font-size: 12px;">
                        This is an automated alert from DecoyDNA Enterprise Monitoring System.
                        Immediate investigation is recommended.
                    </p>
                </div>
            </body>
        </html>
        """
        
        return subject, body

class AlertManager:
    """Manage multiple alert handlers"""
    
    def __init__(self):
        self.handlers: Dict[str, AlertHandler] = {}
        self._initialize_handlers()
    
    def _initialize_handlers(self):
        """Initialize alert handlers based on configuration"""
        # Slack handler
        if SLACK_WEBHOOK_URL:
            self.handlers["slack"] = SlackAlertHandler(SLACK_WEBHOOK_URL)
        
        # Email handler
        if EMAIL_SMTP_USER and EMAIL_SMTP_PASSWORD:
            self.handlers["email"] = EmailAlertHandler(
                smtp_server=EMAIL_SMTP_SERVER,
                smtp_port=EMAIL_SMTP_PORT,
                smtp_user=EMAIL_SMTP_USER,
                smtp_password=EMAIL_SMTP_PASSWORD,
                from_address=EMAIL_FROM,
                to_addresses=[]  # Will be configured later
            )
    
    async def send_alert(self, event: Dict[str, Any]) -> Dict[str, bool]:
        """Send alert through all enabled handlers"""
        results = {}
        
        tasks = []
        for name, handler in self.handlers.items():
            tasks.append(self._send_with_timeout(name, handler, event, results))
        
        await asyncio.gather(*tasks)
        return results
    
    async def _send_with_timeout(self, name: str, handler: AlertHandler, 
                                event: Dict[str, Any], results: Dict[str, bool]):
        """Send alert with timeout"""
        try:
            result = await asyncio.wait_for(handler.send(event), timeout=10)
            results[name] = result
        except asyncio.TimeoutError:
            results[name] = False
        except Exception as e:
            results[name] = False
            print(f"Error sending {name} alert: {e}")
    
    def add_handler(self, name: str, handler: AlertHandler):
        """Add a custom alert handler"""
        self.handlers[name] = handler
    
    def get_enabled_handlers(self) -> list:
        """Get list of enabled alert handlers"""
        return list(self.handlers.keys())
