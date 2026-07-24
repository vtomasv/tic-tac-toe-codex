# Prompt worker: e2e

Ejecutar solo después de mergear y verificar domain e interfaz:

```text
Actúa estrictamente como el agente `e2e` definido en `.codex/agents/e2e.toml`.

PRECONDICIÓN
Comprueba que tu HEAD contiene los commits GREEN de domain e interfaz y aplica el pase que
corresponda:

- PASE INICIAL: antes de crear los commits T080–T085, exige que `npm run test:unit`,
  `npm run test:component` y `npm run build` pasen. Si no, detente.
- REANUDACIÓN POST-RED: si T080–T085 ya están commiteados, exige que `npm run test:unit` y
  `npm run build` pasen. `npm run test:component` y `npm run test:e2e` pueden estar rojos solo por
  los tests planificados de T080–T085 y por la ausencia de la composición Undo que sus AC describen.
  Confirma que el navegador/servidor alcanzan la aplicación y que no hay fallo ajeno; ante cualquier
  fallo ajeno al bloque RED planificado, detente.

$speckit-implement

Ejecuta solo las tareas pendientes OWNER:e2e de la feature 002 Undo.

- Escribe primero RED de integración/App y E2E.
- Integra contratos en App.tsx sin duplicar reglas.
- Cubre anuncio, foco, orden de foco, terminales, repetición, reset, teclado/puntero y responsive según tasks.
- No uses sleeps fijos ni selectores frágiles.
- No modifiques domain ni el componente propiedad de interfaz. Devuelve defectos a su owner.
- Evidencia bajo `.swarm/handoffs/e2e/`.
- Commits exactos y separados.
- Ejecuta component, e2e, build, frontera y, si todos los bloques están presentes, verify completo.

Termina con handoff estructurado y READY_FOR_CONSOLIDATION o REQUEST_CHANGES.
```
