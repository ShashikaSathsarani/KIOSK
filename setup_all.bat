@echo off
echo ============================================
echo      Setting Up All Backends (PostgreSQL + NPM)
echo ============================================
echo.

REM ============================================
REM 0. COMMON VARIABLES
REM ============================================
SET PG_USER=postgres
SET PG_PASS=1234
:: Use the batch file's directory as the kiosk root so script works from any CWD
pushd "%~dp0" >nul || (
	echo Failed to change directory to script location: %~dp0
	pause
	exit /b 1
)
set "ROOT=%~dp0"

:: SQL script paths (built from ROOT)
set "SQL1=%ROOT%backend\exhibits\db\exhibit_script.sql"
set "SQL2=%ROOT%backend_heatmap\database\heatmapdb.sql"
set "SQL3=%ROOT%backend_notifications\notifications_setup.sql"
set "SQL4=%ROOT%frontend\src\feedback_server\feedback_db.sql"
set "SQL5=%ROOT%backend_events\event_db.sql"
set "SQL6=%ROOT%backend_aboutpage\aboutpage_db.sql"

:: Backend directories (built from ROOT)
set "BACKEND1=%ROOT%backend\exhibits\exhibit services"
set "BACKEND2=%ROOT%backend_heatmap\backend"
set "BACKEND3=%ROOT%backend_notifications"
set "BACKEND4=%ROOT%frontend\src\feedback_server"
set "BACKEND5=%ROOT%backend_events"
set "BACKEND6=%ROOT%backend_aboutpage"
set "BACKEND7=%ROOT%backend_map"

REM ============================================
REM 1. RUN SQL SCRIPTS
REM ============================================
echo Running SQL scripts for each backend...

SET PGPASSWORD=%PG_PASS%

echo Backend 1
psql -U %PG_USER% -d postgres -f "%SQL1%"

echo Backend 2
psql -U %PG_USER% -d postgres -f "%SQL2%"

echo Backend 3
psql -U %PG_USER% -d postgres -f "%SQL3%"

echo Backend 4
psql -U %PG_USER% -d postgres -f "%SQL4%"

echo Backend 5
psql -U %PG_USER% -d postgres -f "%SQL5%"

echo SQL scripts executed.
echo.

REM ============================================
REM 2. INSTALL NODE MODULES FOR EACH BACKEND
REM ============================================
echo Installing npm packages...

echo Installing npm packages in all backends...

REM Build a list of backend directories and iterate over them.
REM This handles paths with spaces and will skip directories without package.json.
for %%D in (
	"%BACKEND1%"
	"%BACKEND2%"
	"%BACKEND3%"
	"%BACKEND4%"
	"%BACKEND5%"
	"%BACKEND6%"
	"%BACKEND7%"
) do (
	echo.
	echo Processing backend: %%~D
	if exist "%%~D" (
		if exist "%%~D\package.json" (
			pushd "%%~D" >nul
			echo Running npm install in "%%~D"
			npm install
			popd >nul
			echo Completed npm install in "%%~D"
				) else (
					echo Skipping "%%~D" ^(no package.json found^)
				)
	) else (
		echo Skipping "%%~D" ^(directory not found^)
	)
)

echo.
echo All dependencies installed successfully.
echo ============================================
popd >nul
pause


