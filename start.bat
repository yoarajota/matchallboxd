@echo off
REM Start both project (frontend and backend) in different terminals.
REM Recieve input 'dev' or 'prod' to start in development or production mode.
REM Usage example: .\start.bat dev

REM Start frontend
if %1 == dev (
    start cmd.exe /K "cd frontend && npm run dev"
) else (
    start cmd.exe /K "cd frontend && npm run build && npm run preview"
)

REM Start backend
start cmd.exe /K "cd backend && npm run dev"