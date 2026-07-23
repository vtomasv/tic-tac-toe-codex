#!/usr/bin/env bash
set -euo pipefail

ACTION="${1:-help}"
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

FEATURE_SLUG="${FEATURE_SLUG:-002-undo}"
BASE_BRANCH="${SWARM_BASE_BRANCH:-feat/${FEATURE_SLUG}}"
WT_ROOT="${SWARM_WORKTREE_ROOT:-$(dirname "$ROOT")/.worktrees-${FEATURE_SLUG}}"
LOG_ROOT="$ROOT/.swarm/logs/${FEATURE_SLUG}"
PROMPT_ROOT="$ROOT/.prompts"
mkdir -p "$WT_ROOT" "$LOG_ROOT"

fail(){ printf 'ERROR: %s\n' "$*" >&2; exit 1; }
need_clean(){ [[ -z "$(git status --porcelain)" ]] || fail "El árbol principal no está limpio."; }
need_branch(){ [[ "$(git branch --show-current)" == "$BASE_BRANCH" ]] || fail "Ejecuta desde $BASE_BRANCH."; }
need_file(){ [[ -f "$1" ]] || fail "Falta $1"; }

verify_baseline(){
  npm run test:unit
  npm run test:component
  npm run test:e2e
  npm run build
  npm run verify:traceability
}

mk_wt(){
  local role="$1"
  local branch="swarm/${FEATURE_SLUG}-${role}"
  local path="$WT_ROOT/$role"
  if git show-ref --verify --quiet "refs/heads/$branch"; then
    [[ -d "$path" ]] || git worktree add "$path" "$branch"
  else
    git worktree add "$path" -b "$branch" "$BASE_BRANCH"
  fi
}

link_dependencies(){
  local path="$1"
  [[ -d "$ROOT/node_modules" ]] || fail "Falta $ROOT/node_modules; ejecuta npm ci antes del swarm."
  if [[ -L "$path/node_modules" ]]; then
    [[ "$(readlink "$path/node_modules")" == "$ROOT/node_modules" ]] ||
      fail "$path/node_modules apunta a otra ubicación."
  elif [[ -e "$path/node_modules" ]]; then
    [[ -d "$path/node_modules" ]] || fail "$path/node_modules existe pero no es un directorio."
  else
    ln -s "$ROOT/node_modules" "$path/node_modules"
  fi
}

run_prompt(){
  local role="$1" sandbox="$2" prompt_file="$3" wt="$4"
  need_file "$prompt_file"
  (
    cd "$wt"
    codex exec --ephemeral --sandbox "$sandbox" \
      --add-dir "$ROOT/.git" \
      --add-dir "$ROOT/node_modules" \
      -c 'approval_policy="never"' "$(cat "$prompt_file")"
  ) >"$LOG_ROOT/${role}.out" 2>"$LOG_ROOT/${role}.err"
}

reject_blocked_handoff(){
  local role="$1"
  local output="$LOG_ROOT/${role}.out"
  if grep -q '^REQUEST_ORCHESTRATOR' "$output"; then
    fail "$role devolvió REQUEST_ORCHESTRATOR; revisa $output"
  fi
  return 0
}

case "$ACTION" in
  prepare)
    need_clean
    need_branch
    verify_baseline
    mkdir -p .swarm/handoffs/domain .swarm/handoffs/interfaz .swarm/handoffs/e2e
    git status --short
    printf 'BASE_SHA_SWARM=%s\n' "$(git rev-parse HEAD)" | tee "$LOG_ROOT/base.env"
    ;;

  launch-parallel)
    need_clean
    need_branch
    verify_baseline
    mk_wt domain
    mk_wt interfaz
    link_dependencies "$WT_ROOT/domain"
    link_dependencies "$WT_ROOT/interfaz"
    run_prompt domain workspace-write "$PROMPT_ROOT/09-speckit-implement-domain.md" "$WT_ROOT/domain" & p_domain=$!
    run_prompt interfaz workspace-write "$PROMPT_ROOT/10-speckit-implement-interfaz.md" "$WT_ROOT/interfaz" & p_ui=$!
    domain_status=0
    interfaz_status=0
    wait "$p_domain" || domain_status=$?
    wait "$p_ui" || interfaz_status=$?
    [[ "$domain_status" -eq 0 ]] || fail "domain terminó con exit $domain_status."
    [[ "$interfaz_status" -eq 0 ]] || fail "interfaz terminó con exit $interfaz_status."
    reject_blocked_handoff domain
    reject_blocked_handoff interfaz
    printf 'domain e interfaz terminaron. Revisa %s antes de integrar.\n' "$LOG_ROOT"
    ;;

  integrate-parallel)
    need_clean
    need_branch
    git merge --no-ff "swarm/${FEATURE_SLUG}-domain"
    npm run test:unit
    npm run build
    git merge --no-ff "swarm/${FEATURE_SLUG}-interfaz"
    npm run test:component
    npm run build
    verify_baseline
    ;;

  launch-e2e)
    need_clean
    need_branch
    verify_baseline
    mk_wt e2e
    link_dependencies "$WT_ROOT/e2e"
    run_prompt e2e workspace-write "$PROMPT_ROOT/11-speckit-implement-e2e.md" "$WT_ROOT/e2e"
    reject_blocked_handoff e2e
    printf 'e2e terminó. Revisa %s/e2e.out antes de integrar.\n' "$LOG_ROOT"
    ;;

  integrate-e2e)
    need_clean
    need_branch
    git merge --no-ff "swarm/${FEATURE_SLUG}-e2e"
    verify_baseline
    ;;

  review)
    need_clean
    verify_baseline
    run_prompt reviewer read-only "$PROMPT_ROOT/14-reviewer-final.md" "$ROOT"
    cat "$LOG_ROOT/reviewer.out"
    ;;

  cleanup)
    for role in domain interfaz e2e; do
      path="$WT_ROOT/$role"
      [[ ! -d "$path" ]] || git worktree remove "$path"
    done
    git worktree prune
    ;;

  *)
    cat <<USAGE
Uso: scripts/swarm.sh prepare|launch-parallel|integrate-parallel|launch-e2e|integrate-e2e|review|cleanup

Precondiciones:
- Spec Kit ya creó/validó specs/002-undo y sus artefactos.
- Analyze dio GO.
- El orquestador implementó los gates fundacionales y congeló contratos.
- Los prompts versionados existen en ./.prompts.
USAGE
    ;;
esac
