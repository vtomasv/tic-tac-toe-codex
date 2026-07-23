# Prompt: análisis de consistencia antes de implementar

```text
$speckit-analyze

Realiza un análisis estrictamente read-only de la feature activa 002 Undo. No corrijas archivos.

FUENTES
- .specify/memory/constitution.md
- specs/002-undo/spec.md
- plan.md, data-model.md, contratos y quickstart
- tasks.md y traceability.md
- artefactos equivalentes de feature 001 solo para comprobar compatibilidad, IDs globales y gate multi-feature

HALLAZGOS BLOQUEANTES
Marca CRITICAL/HIGH cuando ocurra cualquiera:
- AC sin RED o sin GREEN.
- Test previsto sin AC-ID literal.
- GREEN antes de RED.
- Task, AC o GATE duplicado globalmente.
- Task de US5 sin [OWNER] o sin AC.
- Dos agentes escritores asignados al mismo archivo.
- domain o interfaz no pueden ejecutarse de forma independiente desde contratos congelados.
- e2e no depende explícitamente de los dos merges.
- Un worker debe editar tasks/traceability durante el fan-out.
- Falta el bloque fundacional para gate multi-feature o no tiene test RED/GREEN/GATE-ID.
- El plan contradice las decisiones confirmadas de Undo.
- Falta cobertura de terminales, vacío, reset, foco, anuncios o responsive.
- Se añade una dependencia sin justificación constitucional.
- Los 42 AC existentes no aparecen como regresión obligatoria.

SALIDA
- Tabla compacta de hallazgos con severidad y ubicación.
- Cobertura de cada AC-US5-* y cada GATE.
- Matriz de ownership y dependencias.
- Métricas y recomendación GO/NO-GO.

GO solo si no hay CRITICAL ni HIGH y el 100 % de AC/GATE tiene cobertura RED/GREEN. Si NO-GO, indica qué comando debe repetirse: clarify, plan o tasks. No implementes.
```
