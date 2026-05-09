#!/usr/bin/env bash
# stop.sh — Stop the backend and frontend started by runbook.sh

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PIDS_FILE="$REPO_ROOT/.runbook.pids"

if [[ ! -f "$PIDS_FILE" ]]; then
  echo "No .runbook.pids file found. Are the servers running?"
  exit 1
fi

read -r BACKEND_PID FRONTEND_PID < "$PIDS_FILE"

kill "$BACKEND_PID" 2>/dev/null && echo "Stopped backend (PID $BACKEND_PID)" || echo "Backend already stopped"
kill "$FRONTEND_PID" 2>/dev/null && echo "Stopped frontend (PID $FRONTEND_PID)" || echo "Frontend already stopped"

rm -f "$PIDS_FILE"
