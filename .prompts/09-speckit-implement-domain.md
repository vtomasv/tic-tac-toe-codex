# Prompt worker: domain

Ejecutar dentro del worktree de domain:

```text
Actúa estrictamente como el agente `domain` definido en `.codex/agents/domain.toml`.

$speckit-implement

Ejecuta solo las tareas pendientes de la feature activa 002 Undo cuyo OWNER sea domain. No ejecutes tareas de otros owners y no modifiques artefactos SDD.

- Lee spec, plan, contratos y tasks en modo solo lectura.
- RED antes de GREEN por cada bloque.
- Escribe evidencia real bajo `.swarm/handoffs/domain/`.
- Usa exactamente los asuntos de commit previstos.
- Implementa únicamente src/domain/** asignado.
- No modifiques App, componentes, E2E, scripts, package/lockfiles ni SDD.
- Ejecuta test unitario filtrado, suite unit, build y
  `node scripts/verify-traceability.mjs --phase=tasks`.
- Antes del handoff ejecuta
  `git diff --name-only "$(git merge-base HEAD feat/002-undo)"..HEAD` y confirma que cada ruta
  pertenece a `src/domain/**` o `.swarm/handoffs/domain/**`.
- Si necesitas cambiar un contrato o archivo ajeno, detente y devuelve REQUEST_ORCHESTRATOR.

Termina con un handoff estructurado: ACs, tasks, commits, archivos, comandos/resultados y riesgos.
```
