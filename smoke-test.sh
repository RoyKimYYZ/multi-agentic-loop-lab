#!/usr/bin/env bash
# smoke-test.sh — Start servers from a worktree (or main) and open the app in a browser
#
# Usage:
#   ./smoke-test.sh                          # run from main repo
#   ./smoke-test.sh /path/to/worktree        # run against a specific worktree
#
# What it does:
#   1. Stops any servers already running from a previous runbook.sh run
#   2. Starts backend (FastAPI :8000) and frontend (Vite :5173) as background processes
#   3. Polls until both servers respond (up to 30s each)
#   4. Opens http://localhost:5173 in the default browser
#   5. Prints a checklist of what to verify

set -e

# ── Resolve target directory ───────────────────────────────────────────────────
TARGET="${1:-$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)}"
TARGET="$(cd "$TARGET" && pwd)"

MAIN_REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$MAIN_REPO/logs"
PIDS_FILE="$MAIN_REPO/.runbook.pids"

mkdir -p "$LOG_DIR"

# ── Stop any running servers ───────────────────────────────────────────────────
if [[ -f "$PIDS_FILE" ]]; then
  echo "==> Stopping previous servers..."
  read -r OLD_BACKEND OLD_FRONTEND < "$PIDS_FILE" || true
  kill "$OLD_BACKEND" 2>/dev/null && echo "    Stopped backend PID $OLD_BACKEND" || true
  kill "$OLD_FRONTEND" 2>/dev/null && echo "    Stopped frontend PID $OLD_FRONTEND" || true
  rm -f "$PIDS_FILE"
  sleep 1
fi

# ── Start backend ──────────────────────────────────────────────────────────────
echo ""
echo "==> Starting backend from $TARGET/backend"
cd "$TARGET/backend"
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 \
  > "$LOG_DIR/backend.log" 2>&1 &
BACKEND_PID=$!
echo "    Backend PID: $BACKEND_PID (logs: logs/backend.log)"

# ── Start frontend ─────────────────────────────────────────────────────────────
echo "==> Starting frontend from $TARGET/frontend"
cd "$TARGET/frontend"
npm run dev \
  > "$LOG_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo "    Frontend PID: $FRONTEND_PID (logs: logs/frontend.log)"

# ── Save PIDs for stop.sh ──────────────────────────────────────────────────────
echo "$BACKEND_PID $FRONTEND_PID" > "$PIDS_FILE"

# ── Wait for backend ───────────────────────────────────────────────────────────
echo ""
echo "==> Waiting for backend (http://localhost:8000)..."
for i in $(seq 1 30); do
  if curl -sf http://localhost:8000/api/posts/ > /dev/null 2>&1; then
    echo "    Backend ready (${i}s)"
    break
  fi
  if [[ $i -eq 30 ]]; then
    echo "    ERROR: Backend did not start in 30s. Check logs/backend.log"
    exit 1
  fi
  sleep 1
done

# ── Wait for frontend ──────────────────────────────────────────────────────────
echo "==> Waiting for frontend (http://localhost:5173)..."
for i in $(seq 1 30); do
  if curl -sf http://localhost:5173 > /dev/null 2>&1; then
    echo "    Frontend ready (${i}s)"
    break
  fi
  if [[ $i -eq 30 ]]; then
    echo "    ERROR: Frontend did not start in 30s. Check logs/frontend.log"
    exit 1
  fi
  sleep 1
done

# ── Open browser ───────────────────────────────────────────────────────────────
URL="http://localhost:5173"
echo ""
echo "==> Opening $URL in browser..."
if command -v xdg-open &>/dev/null; then
  xdg-open "$URL" &
elif command -v open &>/dev/null; then
  open "$URL"
elif command -v wslview &>/dev/null; then
  wslview "$URL"
else
  echo "    Could not detect browser launcher. Open $URL manually."
fi

# ── Smoke test checklist ───────────────────────────────────────────────────────
echo ""
echo "┌─────────────────────────────────────────────────────────┐"
echo "│  SMOKE TEST CHECKLIST                                   │"
echo "│                                                         │"
echo "│  App:      http://localhost:5173                        │"
echo "│  API docs: http://localhost:8000/docs                   │"
echo "│                                                         │"
echo "│  □ Post list loads (at least one seed post visible)     │"
echo "│  □ Create post: fill title + content + author,         │"
echo "│      click Publish — new post appears at top           │"
echo "│  □ Click a post title — navigates to detail page        │"
echo "│  □ Browser back button returns to home                  │"
echo "│                                                         │"
echo "│  When done, reply 'yes' to the Orchestrator or          │"
echo "│  describe what broke.                                   │"
echo "│                                                         │"
echo "│  To stop servers: ./stop.sh                             │"
echo "└─────────────────────────────────────────────────────────┘"
