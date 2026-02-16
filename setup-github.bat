@echo off
REM Professional Tiling Estimator - GitHub Setup Script (Windows)
REM This script helps you quickly initialize git and push to GitHub

echo ==========================================
echo Professional Tiling Estimator
echo GitHub Setup Script (Windows)
echo ==========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo X Git is not installed. Please install git first:
    echo    https://git-scm.com/downloads
    pause
    exit /b 1
)

echo [OK] Git is installed
echo.

REM Get GitHub username
set /p github_user="Enter your GitHub username: "
if "%github_user%"=="" (
    echo X GitHub username is required
    pause
    exit /b 1
)

REM Get repository name
set /p repo_name="Enter repository name (default: tiling-estimator): "
if "%repo_name%"=="" set repo_name=tiling-estimator

echo.
echo Configuration:
echo    GitHub User: %github_user%
echo    Repository:  %repo_name%
echo.

REM Confirm
set /p confirm="Continue? (y/n): "
if /i not "%confirm%"=="y" (
    echo Cancelled.
    pause
    exit /b 0
)

echo.
echo [*] Initializing Git repository...

REM Initialize git if not already initialized
if not exist .git (
    git init
    echo [OK] Git repository initialized
) else (
    echo [OK] Git repository already exists
)

REM Update package.json
echo [*] Updating package.json...
if exist package.json (
    powershell -Command "(gc package.json) -replace 'yourusername', '%github_user%' | Out-File -encoding ASCII package.json"
    powershell -Command "(gc package.json) -replace 'tiling-estimator', '%repo_name%' | Out-File -encoding ASCII package.json"
    echo [OK] package.json updated
)

REM Update README.md
echo [*] Updating README.md...
if exist README.md (
    powershell -Command "(gc README.md) -replace 'yourusername', '%github_user%' | Out-File -encoding ASCII README.md"
    echo [OK] README.md updated
)

REM Add all files
echo [*] Adding files to git...
git add .

REM Create initial commit
echo [*] Creating initial commit...
git commit -m "Initial commit: Professional Tiling Estimator v1.0.0"

REM Add remote
echo [*] Adding GitHub remote...
git remote add origin "https://github.com/%github_user%/%repo_name%.git" 2>nul
if errorlevel 1 (
    git remote set-url origin "https://github.com/%github_user%/%repo_name%.git"
)

REM Set main branch
echo [*] Setting main branch...
git branch -M main

echo.
echo ==========================================
echo [OK] Git Setup Complete!
echo ==========================================
echo.
echo Next Steps:
echo.
echo 1. Create repository on GitHub:
echo    https://github.com/new
echo    Repository name: %repo_name%
echo    (Don't initialize with README)
echo.
echo 2. Push your code:
echo    git push -u origin main
echo.
echo 3. Deploy to Vercel:
echo    https://vercel.com/new
echo    Import your GitHub repository
echo.
echo ==========================================
echo Your app will be live in minutes!
echo ==========================================
echo.
pause
