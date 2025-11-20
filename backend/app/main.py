"""
Main FastAPI application for DecoyDNA
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from contextlib import asynccontextmanager

from app.config.settings import API_HOST, API_PORT, API_DEBUG
from app.db.database import init_db

# Import all models to register with Base (must be after database import)
from app.models.database_models import Honeyfile, AccessEvent, AlertSetting
from app.models.file_sharing import FileShare, ShareAccessLog

from app.api import routes

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== LIFESPAN ====================
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("DecoyDNA API starting up...")
    init_db()
    logger.info("Database initialized")
    yield
    # Shutdown
    logger.info("DecoyDNA API shutting down...")

# ==================== APPLICATION ====================
app = FastAPI(
    title="DecoyDNA Enterprise",
    description="Advanced honeyfile and forensic monitoring system",
    version="1.0.0",
    lifespan=lifespan
)

# ==================== MIDDLEWARE ====================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== ERROR HANDLERS ====================
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)}
    )

# ==================== ROUTES ====================
app.include_router(routes.router)

# ==================== ROOT ====================
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to DecoyDNA Enterprise API",
        "docs": "/docs",
        "openapi": "/openapi.json"
    }

# ==================== RUN ====================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=API_HOST,
        port=API_PORT,
        reload=API_DEBUG,
        log_level="info"
    )
