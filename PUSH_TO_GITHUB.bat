@echo off
title Push RyFit to GitHub
echo.
echo =============================================
echo  Pushing ry-guy-fit-app to GitHub
echo =============================================
echo.

cd /d "C:\Users\Ryan\Documents\ryfit-app"

echo [1/4] Initializing Git...
git init
git branch -M main

echo.
echo [2/4] Staging all files...
git add .

echo.
echo [3/4] Creating commit...
git commit -m "Initial commit: RyFit PWA - workout gamification, macro scanner, GPS gym alerts"

echo.
echo [4/4] Pushing to ry-guy-fit-app...
git remote remove origin 2>nul
git remote add origin https://github.com/ryguyye/ry-guy-fit-app.git
git push -u origin main

echo.
echo =============================================
if %errorlevel%==0 (
    echo  SUCCESS! Live at:
    echo  https://github.com/ryguyye/ry-guy-fit-app
) else (
    echo  Auth required. When prompted:
    echo  Username: ryguyye
    echo  Password: [your GitHub Personal Access Token]
    echo  Get one at: https://github.com/settings/tokens
    echo  (needs "repo" scope)
)
echo =============================================
echo.
pause
