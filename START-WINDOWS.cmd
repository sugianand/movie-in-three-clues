@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Please install Node.js 22.13 or newer from https://nodejs.org then run this again.
  pause
  exit /b 1
)
call npx --yes pnpm@11.25.0 install --frozen-lockfile
if errorlevel 1 (
  pause
  exit /b 1
)
node scripts/local-game.mjs
pause
