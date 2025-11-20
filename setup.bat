@echo off
REM DecoyDNA Setup Script for Windows

echo.
echo =====================================================
echo  🧬 DecoyDNA Enterprise Setup
echo =====================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python 3.11+ is required but not installed
    echo Download from: https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Check if Node is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js 18+ is required but not installed
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo [✓] Python and Node.js detected
echo.

REM Setup Backend
echo =====================================================
echo Setting up Backend...
echo =====================================================
cd backend

if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat
echo [✓] Virtual environment activated

echo Installing Python dependencies...
pip install -q -r requirements.txt
echo [✓] Dependencies installed

echo.
echo Backend setup complete!
echo To start backend:
echo   cd backend
echo   .\venv\Scripts\activate
echo   python -m uvicorn app.main:app --reload
echo.

REM Setup Frontend
echo =====================================================
echo Setting up Frontend...
echo =====================================================
cd ..\frontend

if not exist node_modules (
    echo Installing Node dependencies...
    call npm install --silent
    echo [✓] Dependencies installed
) else (
    echo [✓] Node dependencies already installed
)

echo.
echo Frontend setup complete!
echo To start frontend:
echo   cd frontend
echo   npm run dev
echo.

REM Summary
echo =====================================================
echo 🎉 Setup Complete!
echo =====================================================
echo.
echo Next steps:
echo.
echo 1. Start Backend:
echo    cd backend
echo    .\venv\Scripts\activate
echo    python -m uvicorn app.main:app --reload
echo.
echo 2. Start Frontend (new terminal):
echo    cd frontend
echo    npm run dev
echo.
echo 3. Open Dashboard:
echo    http://127.0.0.1:5173
echo.
echo 4. API Documentation:
echo    http://127.0.0.1:8000/docs
echo.
echo =====================================================
pause
