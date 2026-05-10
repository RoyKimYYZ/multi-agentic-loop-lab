#!/usr/bin/env bash
# merge-slice.sh — Merge a feature slice branch and clean up its worktree
#
# Usage:
#   ./merge-slice.sh <slice-name>
#
# Examples:
#   ./merge-slice.sh delete-post-api
#   ./merge-slice.sh delete-post-ui
#
# What it does:
#   1. Merges feat/{slice-name} into the current branch (main) with --no-ff
#   2. Removes the worktree at ../{repo-name}-{slice-name}
#   3. Deletes the local branch feat/{slice-name}
#
# Must be run from the main repo root (not from inside a worktree).

set -e

SLICE="$1"

if [[ -z "$SLICE" ]]; then
  echo "Usage: ./merge-slice.sh <slice-name>"
  echo "Example: ./merge-slice.sh delete-post-ui"
  exit 1
fi

MAIN_REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_NAME="$(basename "$MAIN_REPO")"
BRANCH="feat/$SLICE"
WORKTREE="$MAIN_REPO/../${REPO_NAME}-${SLICE}"

cd "$MAIN_REPO"

# ── Verify we're on main ───────────────────────────────────────────────────────
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$CURRENT_BRANCH" != "main" ]]; then
  echo "ERROR: Must be on 'main' to merge. Currently on '$CURRENT_BRANCH'."
  echo "Run: git checkout main"
  exit 1
fi

# ── Verify branch exists ───────────────────────────────────────────────────────
if ! git show-ref --quiet "refs/heads/$BRANCH"; then
  echo "ERROR: Branch '$BRANCH' does not exist."
  exit 1
fi

# ── Merge ─────────────────────────────────────────────────────────────────────
echo "==> Merging $BRANCH into main..."
git merge "$BRANCH" --no-ff -m "feat: merge $SLICE

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
echo "    Merged ✓"

# ── Remove worktree ────────────────────────────────────────────────────────────
if [[ -d "$WORKTREE" ]]; then
  echo "==> Removing worktree at $WORKTREE..."
  git worktree remove "$WORKTREE" --force
  echo "    Worktree removed ✓"
else
  echo "    Worktree $WORKTREE not found — skipping removal"
fi

# ── Delete branch ──────────────────────────────────────────────────────────────
echo "==> Deleting branch $BRANCH..."
git branch -d "$BRANCH"
echo "    Branch deleted ✓"

echo ""
echo "✅ Slice '$SLICE' merged and cleaned up."
echo "   Run './smoke-test.sh' to verify main is healthy."
