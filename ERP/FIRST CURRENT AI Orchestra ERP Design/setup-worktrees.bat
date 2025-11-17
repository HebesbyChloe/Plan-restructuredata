@echo off
REM Setup script for creating 4 Git worktrees for parallel development
REM This allows running 4 branches simultaneously on different ports

echo ========================================
echo Setting up 4-branch parallel development
echo ========================================
echo.

REM Get the current directory (parent of worktrees)
set "CURRENT_DIR=%~dp0"
cd /d "%CURRENT_DIR%"

REM Check if we're in a git repository
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo ERROR: Not in a Git repository!
    pause
    exit /b 1
)

REM Check if branches exist, create them if they don't
echo Checking/creating feature branches...
git branch --list feature/administration >nul 2>&1 || git checkout -b feature/administration
git branch --list feature/marketing >nul 2>&1 || git checkout -b feature/marketing
git branch --list feature/crm >nul 2>&1 || git checkout -b feature/crm
git branch --list feature/products >nul 2>&1 || git checkout -b feature/products
git checkout master >nul 2>&1

echo.
echo Creating worktrees in sibling directories...
echo.

REM Create worktrees in parent directory
set "PARENT_DIR=%~dp0.."

REM Administration worktree
if exist "%PARENT_DIR%\administration" (
    echo WARNING: administration directory already exists. Skipping...
) else (
    echo Creating administration worktree...
    git worktree add "%PARENT_DIR%\administration" feature/administration
    if errorlevel 1 (
        echo ERROR: Failed to create administration worktree
    ) else (
        echo ✓ Administration worktree created
    )
)

REM Marketing worktree
if exist "%PARENT_DIR%\marketing" (
    echo WARNING: marketing directory already exists. Skipping...
) else (
    echo Creating marketing worktree...
    git worktree add "%PARENT_DIR%\marketing" feature/marketing
    if errorlevel 1 (
        echo ERROR: Failed to create marketing worktree
    ) else (
        echo ✓ Marketing worktree created
    )
)

REM CRM worktree
if exist "%PARENT_DIR%\crm" (
    echo WARNING: crm directory already exists. Skipping...
) else (
    echo Creating CRM worktree...
    git worktree add "%PARENT_DIR%\crm" feature/crm
    if errorlevel 1 (
        echo ERROR: Failed to create CRM worktree
    ) else (
        echo ✓ CRM worktree created
    )
)

REM Products worktree
if exist "%PARENT_DIR%\products" (
    echo WARNING: products directory already exists. Skipping...
) else (
    echo Creating products worktree...
    git worktree add "%PARENT_DIR%\products" feature/products
    if errorlevel 1 (
        echo ERROR: Failed to create products worktree
    ) else (
        echo ✓ Products worktree created
    )
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Directory structure:
echo   %PARENT_DIR%
echo   ├── FIRST CURRENT AI Orchestra ERP Design\  (main/master)
echo   ├── administration\  (feature/administration - Port 3000)
echo   ├── marketing\       (feature/marketing - Port 3001)
echo   ├── crm\             (feature/crm - Port 3002)
echo   └── products\        (feature/products - Port 3003)
echo.
echo Next steps:
echo 1. Navigate to each worktree directory
echo 2. Run npm install in each (if needed)
echo 3. Start dev servers:
echo    - administration: npm run dev:admin
echo    - marketing: npm run dev:marketing
echo    - crm: npm run dev:crm
echo    - products: npm run dev:products
echo.
pause

