@echo off
REM Start all 4 development servers in separate windows
REM This opens 4 new terminal windows, one for each branch

echo ========================================
echo Starting 4 Development Servers
echo ========================================
echo.

set "BASE_DIR=C:\Users\conta\ERP"

REM Start Administration (Port 3000)
echo Starting Administration server on port 3000...
start "Administration - Port 3000" cmd /k "cd /d %BASE_DIR%\administration && npm run dev:admin"

REM Wait a moment before starting next server
timeout /t 2 /nobreak >nul

REM Start Marketing (Port 3001)
echo Starting Marketing server on port 3001...
start "Marketing - Port 3001" cmd /k "cd /d %BASE_DIR%\marketing && npm run dev:marketing"

timeout /t 2 /nobreak >nul

REM Start CRM (Port 3002)
echo Starting CRM server on port 3002...
start "CRM - Port 3002" cmd /k "cd /d %BASE_DIR%\crm && npm run dev:crm"

timeout /t 2 /nobreak >nul

REM Start Products (Port 3003)
echo Starting Products server on port 3003...
start "Products - Port 3003" cmd /k "cd /d %BASE_DIR%\products && npm run dev:products"

echo.
echo ========================================
echo All servers starting!
echo ========================================
echo.
echo Access URLs:
echo   Administration: http://localhost:3000
echo   Marketing:      http://localhost:3001
echo   CRM:            http://localhost:3002
echo   Products:       http://localhost:3003
echo.
echo Each server is running in its own window.
echo Close the windows individually to stop servers.
echo.
pause

