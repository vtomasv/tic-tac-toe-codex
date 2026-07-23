# Prompt: convergencia final

```text
$speckit-converge

Evalúa la implementación actual contra spec, plan, tasks y constitución de la feature 002 Undo.

FOCO
- Todos los AC-US5-* y outcomes.
- Contratos y decisiones arquitectónicas.
- Gate multi-feature y compatibilidad con feature 001.
- Pureza/ownership de domain, interfaz y App/E2E.
- Accesibilidad, foco, anuncios, terminales, repetición, vacío y reset.
- Trazabilidad y commits reales.

REGLAS
- El comando es append-only sobre tasks.md: no modifiques spec, plan ni código.
- No añadas una fase vacía si no hay gaps.
- Si detectas gaps, crea tareas de convergencia trazadas a AC/FR/SC/plan/constitución, con IDs siguientes y ownership explícito.
- No sugieras parches manuales. Después de tasks_appended, debe repetirse analyze -> implement por owner -> consolidate -> converge.

ÉXITO
Solo informa `Converged` si el código satisface completamente la intención y todos los gates están verdes.
```
