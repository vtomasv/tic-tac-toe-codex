# Prompt orquestador: consolidar evidencia después de merges

```text
$speckit-implement

Desde la rama integrada, ejecuta únicamente las tareas pendientes OWNER:orchestrator de consolidación y validación final de la feature 002.

ENTRADAS
- `.swarm/handoffs/domain/`
- `.swarm/handoffs/interfaz/`
- `.swarm/handoffs/e2e/`
- git log real de las ramas ya mergeadas

REGLAS
- No cambies comportamiento ni tests de producto.
- Valida que cada SHA exista, que cada asunto coincida con tasks.md y que RED sea ancestro de GREEN.
- Actualiza tasks.md y traceability.md con evidencia y SHA reales; nunca inventes.
- Registra todos los GATE-ID fundacionales.
- Rechaza handoffs incompletos o cambios fuera de ownership.
- Ejecuta unit, component, e2e, build y verify:traceability.
- Deja todos los rows de feature 002 en VERIFIED solo cuando exista evidencia completa.
- Confirma que feature 001 sigue completamente verde.

Si falta evidencia, detente con la lista exacta; no marques tareas como completas.
```
