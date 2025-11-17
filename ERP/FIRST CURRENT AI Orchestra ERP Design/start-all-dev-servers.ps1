# Start all 4 development servers in separate PowerShell windows
# This opens 4 new terminal windows, one for each branch

Write-Host "========================================"
Write-Host "Starting 4 Development Servers"
Write-Host "========================================"
Write-Host ""

$baseDir = "C:\Users\conta\ERP"

# Start Administration (Port 3000)
Write-Host "Starting Administration server on port 3000..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$baseDir\administration'; npm run dev:admin"

Start-Sleep -Seconds 2

# Start Marketing (Port 3001)
Write-Host "Starting Marketing server on port 3001..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$baseDir\marketing'; npm run dev:marketing"

Start-Sleep -Seconds 2

# Start CRM (Port 3002)
Write-Host "Starting CRM server on port 3002..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$baseDir\crm'; npm run dev:crm"

Start-Sleep -Seconds 2

# Start Products (Port 3003)
Write-Host "Starting Products server on port 3003..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$baseDir\products'; npm run dev:products"

Write-Host ""
Write-Host "========================================"
Write-Host "All servers starting!"
Write-Host "========================================"
Write-Host ""
Write-Host "Access URLs:"
Write-Host "  Administration: http://localhost:3000"
Write-Host "  Marketing:      http://localhost:3001"
Write-Host "  CRM:            http://localhost:3002"
Write-Host "  Products:       http://localhost:3003"
Write-Host ""
Write-Host "Each server is running in its own window."
Write-Host "Close the windows individually to stop servers."
Write-Host ""

