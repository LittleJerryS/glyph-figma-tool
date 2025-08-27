@echo off
echo Starting Glyph Design System - Full Stack Application
echo.

echo [1/3] Installing dependencies...
npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo [2/3] Building frontend...
npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to build frontend
    pause
    exit /b 1
)

echo [3/3] Starting backend server...
echo.
echo [INFO] Backend will run on: http://localhost:3000
echo [INFO] Frontend will be available at: http://localhost:3000
echo [INFO] API endpoints: http://localhost:3000/api
echo.
echo [NOTE] Make sure you have an OpenAI API key set in .env file
echo [NOTE] Or the AI features will use mock responses
echo.
echo Press any key to start the server...
pause >nul

npm start
