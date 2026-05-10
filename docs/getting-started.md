# Getting Started

## Prerequisites

| Tool | Install |
|---|---|
| Python 3.11+ | [python.org](https://python.org) |
| `uv` | `curl -Lsf https://astral.sh/uv/install.sh \| sh` |
| Node.js 18+ | [nodejs.org](https://nodejs.org) |
| VS Code | [code.visualstudio.com](https://code.visualstudio.com) |
| GitHub Copilot extension | VS Code Extensions panel |

---

## 1. Clone the repo

```bash
git clone <repo-url> multi-agentic-loop-lab
cd multi-agentic-loop-lab
```

---

## 2. Install dependencies

**Backend:**
```bash
cd backend
uv sync
```

**Frontend:**
```bash
cd frontend
npm install
```

---

## 3. Run the app

### Option A — Both servers at once (recommended)

```bash
./smoke-test.sh
```

This starts both servers, waits until they're ready, and opens the browser.

- App: **http://localhost:5173**
- API docs: **http://localhost:8000/docs**

To stop:
```bash
./stop.sh
```

### Option B — Individually

**Backend (terminal 1):**
```bash
cd backend
uv run uvicorn app.main:app --reload --port 8000
```

**Frontend (terminal 2):**
```bash
cd frontend
npm run dev
```

---

## 4. Run tests

**Backend:**
```bash
cd backend
PYTHONPATH=. uv run pytest -q
uv run ruff check .
```

> `PYTHONPATH=.` is required so pytest can resolve `from app.main import app`.

**Frontend:**
```bash
cd frontend
npm run build
npm run lint
```

---

## 5. Explore the API

Interactive Swagger UI is available at **http://localhost:8000/docs** while the backend is running.

See [API Reference](./api-reference.md) for the full endpoint list.
