# Prompt: reviewer read-only

```text
Actúa como el agente `reviewer` de `.codex/agents/reviewer.toml`.

Audita el diff integrado de la feature 002 Undo desde BASE_SHA_SWARM hasta HEAD. No modifiques nada.

EJECUTA/INSPECCIONA
- constitución, spec, clarifications, checklists, plan, contratos, tasks y traceability;
- handoffs de domain/interfaz/e2e;
- git diff, git log y ownership por commit;
- nombres/asserts de tests;
- npm run test:unit;
- npm run test:component;
- npm run test:e2e;
- npm run build;
- npm run verify:traceability;
- cualquier gate de frontera definido por tasks.

Comprueba especialmente que el gate final descubre feature 001 y 002 y que AC/GATE/Task IDs son globalmente únicos.

Reporta hallazgos por severidad con fuente y evidencia. Termina exactamente con VERDICT: ACCEPT o VERDICT: REQUEST_CHANGES.
```
