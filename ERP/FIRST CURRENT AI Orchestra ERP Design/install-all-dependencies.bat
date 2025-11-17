@echo off
REM Install npm dependencies in all 4 worktrees

echo ========================================
echo Installing Dependencies in All Worktrees
echo ========================================
echo.

set "BASE_DIR=C:\Users\conta\ERP"

echo Installing in administration...
cd /d %BASE_DIR%\administration
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install in administration
) else (
    echo ✓ Administration dependencies installed
)

echo.
echo Installing in marketing...
cd /d %BASE_DIR%\marketing
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install in marketing
) else (
    echo ✓ Marketing dependencies installed
)

echo.
echo Installing in crm...
cd /d %BASE_DIR%\crm
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install in crm
) else (
    echo ✓ CRM dependencies installed
)

echo.
echo Installing in products...
cd /d %BASE_DIR%\products
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install in products
) else (
    echo ✓ Products dependencies installed
)

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
pause

