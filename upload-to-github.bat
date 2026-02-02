@echo off
REM APSZ Library Management System - GitHub Upload Script
REM This script automates uploading your project to GitHub

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║   APSZ Library - GitHub Upload Script                 ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed!
    echo Please download from: https://git-scm.com/
    pause
    exit /b 1
)

echo ✅ Git found!
echo.

REM Ask for GitHub username
set /p GITHUB_USER="Enter your GitHub username: "
if "%GITHUB_USER%"=="" (
    echo ❌ GitHub username is required!
    pause
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║ Before continuing, make sure you have:                ║
echo ║ 1. Created repository on GitHub                       ║
echo ║ 2. Named it: apsz-library-management                 ║
echo ║ 3. Made it PUBLIC                                     ║
echo ╚════════════════════════════════════════════════════════╝
echo.
pause

REM Initialize git
echo 📝 Initializing git repository...
git init

REM Configure git
echo 📝 Configuring git...
set /p GIT_NAME="Enter your name for commits: "
set /p GIT_EMAIL="Enter your email for commits: "
git config --global user.name "%GIT_NAME%"
git config --global user.email "%GIT_EMAIL%"

REM Add files
echo 📝 Adding files...
git add .

REM Commit
echo 📝 Creating commit...
git commit -m "Initial commit: APSZ Library Management System with Authentication"

REM Add remote
echo 📝 Adding remote repository...
git remote add origin https://github.com/%GITHUB_USER%/apsz-library-management.git

REM Rename branch
echo 📝 Setting up main branch...
git branch -M main

REM Push
echo 📝 Pushing to GitHub (this may take a moment)...
git push -u origin main

if errorlevel 1 (
    echo.
    echo ❌ Upload failed!
    echo Make sure:
    echo - GitHub repository is created
    echo - Repository name is correct
    echo - Your GitHub credentials are correct
    echo.
    pause
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║ ✅ SUCCESS! Your project is on GitHub!                ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo 📂 Your repository:
echo https://github.com/%GITHUB_USER%/apsz-library-management
echo.
echo Next steps:
echo 1. Visit your repository URL above
echo 2. Share it with others
echo 3. Clone on other machines with:
echo    git clone https://github.com/%GITHUB_USER%/apsz-library-management.git
echo.
pause
