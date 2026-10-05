@echo off
setlocal
cd /d "%~dp0"

echo Starting CodeCoach 2.0 Node.js Backend Server...
start "" http://localhost:4200
node server.js
pause
