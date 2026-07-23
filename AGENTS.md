# AGENTS.md - tic-tac-toe-codex

## Fuente de verdad y orden de trabajo

1. `.specify/memory/constitution.md` gobierna todas las features.
2. La feature activa se resuelve desde `.specify/feature.json`.
3. El comportamiento vive en `spec.md`; `plan.md`, contratos y `tasks.md` son derivados.
4. Ningún agente escritor comienza hasta que `speckit-analyze` no tenga hallazgos CRITICAL/HIGH bloqueantes.
5. En implementación, RED precede a GREEN y los commits deben coincidir exactamente con `tasks.md`.

## Sensores exactos

- Unit: `npm run test:unit`
- Component: `npm run test:component`
- E2E: `npm run test:e2e`
- Build: `npm run build`
- Trazabilidad final: `npm run verify:traceability`
- Verificación completa: `npm run verify` cuando el script exista en `package.json`
- Baseline mínimo si `verify` aún no existe: unit + component + e2e + build + traceability.

## Reglas no inferibles

- Todo test de producto contiene literalmente su AC-ID.
- Commits de producto: `<tipo>(USn): Tnnn descripción [AC-ID ...]`.
- Commits de tooling: `<tipo>(tooling): Tnnn descripción [GATE-ID ...]`.
- IDs `AC-*`, `GATE-*` y `Tnnn` son globalmente únicos en todo `specs/`.
- `src/domain/` es puro, inmutable y sin dependencias de React/browser.
- La UI emite eventos y representa estado; no decide reglas.
- `src/App.tsx` compone contratos; no duplica dominio.
- No se añaden dependencias ni se tocan lockfiles sin tarea explícita.
- El baseline debe estar verde antes de crear worktrees.
- Si falla un sensor, el informe vuelve al agente propietario; otro agente no corrige de paso.
- El orquestador es el único escritor de artefactos SDD durante el fan-out paralelo.

## Propiedad genérica de archivos

- `domain`: archivos y tests asignados bajo `src/domain/**`; handoff en `.swarm/handoffs/domain/**`.
- `interfaz`: componentes y tests asignados bajo `src/components/**`, excepto tests de integración de App; handoff en `.swarm/handoffs/interfaz/**`.
- `e2e`: `src/App.tsx`, test de integración de App, `tests/e2e/**` y estilos globales asignados; handoff en `.swarm/handoffs/e2e/**`.
- `reviewer`: solo lectura.
- `orquestador`: `specs/**`, `.specify/**`, `scripts/**`, configuración raíz, `package.json`, lockfiles y merges.

## Topología obligatoria

1. El orquestador completa Specify -> Clarify -> Checklist -> Plan -> Tasks -> Analyze.
2. El orquestador implementa primero cualquier gate fundacional compartido y congela contratos.
3. `domain` e `interfaz` trabajan en paralelo desde la misma base verde, en worktrees distintos.
4. Se integra `domain`, se ejecutan sensores; después `interfaz`, se repiten sensores.
5. `e2e` nace desde la base que ya contiene ambos merges.
6. Tras integrar `e2e`, el orquestador consolida ledger/SHAs y ejecuta `speckit-converge`.
7. `reviewer` audita el diff final en read-only.

## Condiciones de parada

No improvises. Detente si existe ambigüedad material, contrato no congelado, tarea sin AC/GATE, propiedad de archivos solapada, baseline rojo, necesidad de dependencia nueva o contradicción entre spec, plan y tasks.
