@echo off
title YT2MP3 Studio - Local Server
color 0A
echo ========================================================
echo          YT2MP3 STUDIO - SAFWAN QUEST
echo          Luncurkan WebApp Tempat secara Otomatik...
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/2] Membuka pelayar http://localhost:3000 ...
timeout /t 2 /nobreak >nul
start "" "http://localhost:3000"

echo [2/2] Memulakan Pelayan Tempatan Next.js...
echo.
npm run dev

pause
