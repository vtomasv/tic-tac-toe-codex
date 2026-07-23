# Prompt worker: interfaz

Ejecutar dentro del worktree de interfaz, en paralelo con domain:

```text
Actúa estrictamente como el agente `interfaz` definido en `.codex/agents/interfaz.toml`.

$speckit-implement

Ejecuta solo las tareas pendientes de la feature activa 002 Undo cuyo OWNER sea interfaz. No modifiques artefactos SDD.

- Implementa únicamente el componente presentacional y sus tests asignados bajo src/components/.
- Cumple el contrato congelado de props/eventos; no importes ni reimplementes reglas de dominio.
- Usa botón nativo, accesibilidad, foco y señal no cromática según ACs.
- RED antes de GREEN y commits exactos.
- Evidencia bajo `.swarm/handoffs/interfaz/`.
- Ejecuta componente filtrado, suite component, build y gate de frontera.
- No modifiques App.tsx, domain, E2E, estilos globales no asignados, scripts, package/lockfiles ni SDD.
- Si falta una decisión de UX/contrato, detente y devuelve REQUEST_ORCHESTRATOR.

Termina con handoff estructurado.
```
