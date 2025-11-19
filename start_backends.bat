@echo off
echo ============================================
echo   Starting All Backend Services...
echo ============================================
echo.

:: Ensure commands use the batch file's directory so script works from any CWD
pushd "%~dp0" >nul || (
	echo Failed to change directory to script location: %~dp0
	pause
	exit /b 1
)
set "ROOT=%~dp0"

:: ===== BACKEND 1 =====
echo Starting Events Backend ...
start "Backend Events" cmd /k "cd /d "%ROOT%backend_events" && npm start"

:: ===== BACKEND 2 =====
echo Starting Exhibits Backend ...
start "Backend Exhibits" cmd /k "cd /d "%ROOT%backend\exhibits\exhibit services" && npm start"

:: ===== BACKEND 3 =====
echo Starting Heatmap Backend ...
start "Backend Heatmap" cmd /k "cd /d "%ROOT%backend_heatmap\backend" && node index.js"

:: ===== BACKEND 4 =====
echo Starting Map Backend ...
start "Backend Map" cmd /k "cd /d "%ROOT%backend_map" && node app.js"

:: ===== BACKEND 5 =====
echo Starting Notification Backend ...
start "Backend Notification" cmd /k "cd /d "%ROOT%backend_notifications" && node server.js"

:: ===== BACKEND 6 =====
echo Starting Feedback Backend ...
start "Backend Feedback" cmd /k "cd /d "%ROOT%frontend\src\feedback_server" && node server.js"

:: ===== BACKEND 7 =====
echo Starting Aboutpage Backend ...
start "Backend Aboutpage" cmd /k "cd /d "%ROOT%backend_aboutpage" && node AboutPageServer.js"

echo.
echo All backends launched successfully!
popd >nul
pause
