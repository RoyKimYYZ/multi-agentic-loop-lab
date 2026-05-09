#!/usr/bin/env bash
# runbook.sh — Start backend and frontend as background processes
# Logs are written to logs/backend.log and logs/frontend.log

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$REPO_ROOT/logs"
mkdir -p "$LOG_DIR"

echo "=== Starting backend (FastAPI on :8000) ==="
cd "$REPO_ROOT/backend"
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 \
  > "$LOG_DIR/backend.log" 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID  (logs: logs/backend.log)"

echo "=== Starting frontend (Vite on :5173) ==="
cd "$REPO_ROOT/frontend"
npm run dev \
  > "$LOG_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID  (logs: logs/frontend.log)"

echo ""
echo "=== Waiting for servers to be ready ==="
sleep 4

echo ""
echo "┌─────────────────────────────────────────────┐"
echo "│  Servers are running                        │"
echo "│                                             │"
echo "│  Frontend:  http://localhost:5173           │"
echo "│  Backend:   http://localhost:8000           │"
echo "│  API docs:  http://localhost:8000/docs      │"
echo "│                                             │"
echo "│  Open one of the URLs above in your browser │"
echo "│                                             │"
echo "│  To stop:  kill $BACKEND_PID $FRONTEND_PID             │"
echo "│  Or run:   ./stop.sh                        │"
echo "└─────────────────────────────────────────────┘"

# Write PIDs for stop.sh
echo "$BACKEND_PID $FRONTEND_PID" > "$REPO_ROOT/.runbook.pids"
