#!/bin/bash
# DecoyDNA Setup Script for Linux/macOS

echo ""
echo "====================================================="
echo " 🧬 DecoyDNA Enterprise Setup"
echo "====================================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python 3.11+ is required but not installed"
    echo "Install with: sudo apt-get install python3.11"
    exit 1
fi

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js 18+ is required but not installed"
    echo "Install from: https://nodejs.org/"
    exit 1
fi

echo "[✓] Python and Node.js detected"
echo ""

# Setup Backend
echo "====================================================="
echo "Setting up Backend..."
echo "====================================================="
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
echo "[✓] Virtual environment activated"

echo "Installing Python dependencies..."
pip install -q -r requirements.txt
echo "[✓] Dependencies installed"

echo ""
echo "Backend setup complete!"
echo "To start backend:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  python -m uvicorn app.main:app --reload"
echo ""

# Setup Frontend
echo "====================================================="
echo "Setting up Frontend..."
echo "====================================================="
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing Node dependencies..."
    npm install --silent
    echo "[✓] Dependencies installed"
else
    echo "[✓] Node dependencies already installed"
fi

echo ""
echo "Frontend setup complete!"
echo "To start frontend:"
echo "  cd frontend"
echo "  npm run dev"
echo ""

# Summary
echo "====================================================="
echo "🎉 Setup Complete!"
echo "====================================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Start Backend:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   python -m uvicorn app.main:app --reload"
echo ""
echo "2. Start Frontend (new terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Open Dashboard:"
echo "   http://127.0.0.1:5173"
echo ""
echo "4. API Documentation:"
echo "   http://127.0.0.1:8000/docs"
echo ""
echo "====================================================="
