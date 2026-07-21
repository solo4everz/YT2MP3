#!/usr/bin/env bash
# ========================================================
# YT2MP3 Studio - Automatic Setup & Launcher (Mac & Linux)
# ========================================================

echo "========================================================"
echo "         YT2MP3 STUDIO - SAFWAN QUEST"
echo "         Pemasangan & Peluncuran 1-Klik (Mac/Linux)"
echo "========================================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "[RALAT] Node.js tidak dijumpai."
    echo "Sila install Node.js daripada https://nodejs.org/"
    exit 1
fi

# Install dependencies if missing
if [ ! -d "node_modules" ]; then
    echo "[1/2] Memasang pakej dependencies (npm install)..."
    npm install
fi

echo "[2/2] Membuka pelayar http://localhost:3000 ..."
if command -v open &> /dev/null; then
    open "http://localhost:3000"
elif command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:3000"
fi

echo ""
echo "========================================================"
echo "Pelayan YT2MP3 Studio kini aktif!"
echo "========================================================"
echo ""
npm run dev
