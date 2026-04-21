@echo off
echo ==========================================
echo    FarmKart - Setup and Start
echo ==========================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [1/3] Node.js found: 
node -v
echo.

:: Install dependencies if needed
if not exist "node_modules" (
    echo [2/3] Installing dependencies... (this may take a minute)
    npm install
    echo.
) else (
    echo [2/3] Dependencies already installed.
    echo.
)

:: Check if .env exists
if not exist ".env" (
    echo Creating .env file...
    echo MONGODB_URI=mongodb://localhost:27017/farmkart> .env
    echo JWT_SECRET=farmkart_secret_key_change_in_production>> .env
    echo PORT=3000>> .env
)

echo [3/3] Starting FarmKart server...
echo.
echo ==========================================
echo    Open in browser: http://localhost:3000
echo ==========================================
echo    Press Ctrl+C to stop the server
echo ==========================================
echo.
node server.js
pause
