# Prompt: implementar gates compartidos antes del swarm

Ejecutar en la sesión principal/orquestador, no en un worker:

```text
$speckit-implement

Ejecuta únicamente las tareas pendientes de la feature 002 cuyo OWNER sea orchestrator y que pertenezcan a Setup, Foundational, contratos o gates previos al swarm. No ejecutes todavía tareas OWNER:domain, OWNER:interfaz ni OWNER:e2e.

OBLIGATORIO
- Implementa el gate multi-feature con TDD: test RED real, evidencia, commit test(tooling), GREEN mínimo y commit feat(tooling).
- Verifica feature 001 y feature 002 como conjunto, con IDs globalmente únicos.
- Crea solo scripts/configuración autorizados por tasks.md.
- Congela los contratos de domain/UI y no los cambies después del fan-out salvo retorno explícito a Plan/Tasks.
- Actualiza tasks.md y traceability.md solo desde esta sesión principal con SHA reales.
- Ejecuta los sensores previstos y deja una base limpia/verde.

DETENTE
Si una tarea fundacional contradice spec/plan, si el test no falla por la ausencia del gate o si el gate rompe la feature 001. No avances a código de producto.

SALIDA
Reporta BASE_SHA_SWARM, commits del GATE, contratos congelados, comandos verdes y lista exacta de tareas productivas listas para domain/interfaz.
```
