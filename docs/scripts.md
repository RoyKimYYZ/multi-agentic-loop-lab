# Scripts Reference

All scripts live in the repo root and must be run from `/home/rkadmin/multi-agentic-loop-lab`.

---

## `smoke-test.sh`

Start both servers and open the app in a browser.

```bash
./smoke-test.sh                              # run from main repo
./smoke-test.sh /path/to/worktree            # run from a specific worktree
```

**What it does:**
1. Stops any previously started servers (reads PIDs from `.runbook.pids`)
2. Starts FastAPI backend on port `8000`
3. Starts Vite frontend on port `5173`
4. Polls both servers until they respond (up to 30s each)
5. Opens `http://localhost:5173` in the browser
6. Prints a smoke test checklist

**Logs:** `logs/backend.log`, `logs/frontend.log`

**Used by:** the Orchestrator in Step 7 (Gate) to run browser smoke tests against a worktree before merge.

---

## `stop.sh`

Stop the servers started by `smoke-test.sh`.

```bash
./stop.sh
```

Reads PIDs from `.runbook.pids` and kills them. Safe to run even if servers aren't running.

---

## `merge-slice.sh`

Merge a feature slice into `main`, remove its worktree, and delete its branch — in one command.

```bash
./merge-slice.sh <slice-name>
```

**Examples:**
```bash
./merge-slice.sh delete-post-api
./merge-slice.sh delete-post-ui
```

**What it does:**
1. Verifies you are on `main`
2. Verifies `feat/{slice-name}` branch exists
3. Merges with `--no-ff` and a standard commit message
4. Removes the worktree at `../{repo-name}-{slice-name}`
5. Deletes the local branch `feat/{slice-name}`

**Used by:** the user in Step 9 (Declare Complete) after the Orchestrator confirms all checks pass.

**Safety checks:**
- Fails with a clear error if not on `main`
- Fails if the branch doesn't exist
- Uses `--force` on worktree removal (safe — branch is already merged)

---

## Typical Session Flow

```bash
# 1. Start the app to verify current main is healthy
./smoke-test.sh

# 2. ... implement a feature via agents ...

# 3. Gate the worktree (Orchestrator runs this)
./smoke-test.sh /home/rkadmin/multi-agentic-loop-lab-{slice}

# 4. After user confirms browser test, merge each slice
./merge-slice.sh {slice-name}

# 5. Verify main is still healthy after merge
./smoke-test.sh

# 6. Stop servers when done
./stop.sh
```
