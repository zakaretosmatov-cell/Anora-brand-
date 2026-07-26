@echo off
title Anora Brand Startup Script
echo =================================================
echo   ANORA BRAND - WEBSAYTNI ISHGA TUSHIRISH
echo =================================================
echo.
echo 1. Backend server ishga tushirilmoqda...
start "Anora Backend Server" cmd /c "cd /d %~dp0backend && npm run dev"
echo.
echo 2. Frontend server ishga tushirilmoqda...
start "Anora Frontend Server" cmd /c "cd /d %~dp0frontend && npm run dev"
echo.
echo 3. Serverlar yuklanishi uchun 4 soniya kutilmoqda...
timeout /t 4 /nobreak
echo.
echo 4. Brauzerda sayt ochilmoqda...
start http://localhost:5173
echo.
echo Muallif: Anora Brand Developer
exit
