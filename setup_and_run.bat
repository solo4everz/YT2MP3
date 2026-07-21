@echo off
title YT2MP3 Studio - Automatic Setup & Launcher
color 0B
echo ========================================================
echo          YT2MP3 STUDIO - SAFWAN QUEST
echo          Pemasangan & Peluncuran 1-Klik
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Memeriksa kebergantungan (Dependencies)...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [RALAT] Node.js tidak dijumpai di komputer anda.
    echo Sila muat turun dan install Node.js daripada https://nodejs.org/
    pause
    exit /b
)

echo [2/3] Memasang pakej perisian (npm install)...
if not exist "node_modules\" (
    call npm install
) else (
    echo node_modules sedia ada dijumpai.
)

echo [3/3] Membuka pelayar http://localhost:3000 ...
timeout /t 2 /nobreak >nul
start "" "http://localhost:3000"

echo.
echo ========================================================
echo Pelayan YT2MP3 Studio kini aktif!
echo ========================================================
echo.
npm run dev

pause
