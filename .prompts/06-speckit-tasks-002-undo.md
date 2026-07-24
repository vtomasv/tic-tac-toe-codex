# Prompt: generar tareas ejecutables y paralelizables

```text
$speckit-tasks

Genera `tasks.md` para la feature activa 002 Undo siguiendo la constitución, spec y plan.

NUMERACIÓN GLOBAL
- Escanea todos los tasks.md existentes y continúa desde el máximo Task ID global. En este repositorio la secuencia histórica llega al menos a T061; no reutilices ningún Tnnn.
- Los GATE-ID y AC-ID también deben ser globalmente únicos.

FORMATO OBLIGATORIO
- `- [ ] Tnnn [P?] [US5] [OWNER:<rol>] [AC:<ids>] [RED|GREEN] descripción con rutas exactas; Expected commit: ...`
- Tooling: usa `[OWNER:orchestrator] [GATE:<id>]` y commits `test(tooling)` / `feat(tooling)`.
- Cada AC tiene al menos una tarea RED y una GREEN.
- Cada RED precede inmediatamente al GREEN o bloque cohesivo que lo satisface.
- Cada tarea declara archivos, comando de prueba filtrado y asunto exacto de commit.
- No agrupes AC no relacionados ni marques [P] si comparten archivo o dependencia.

FASES Y DEPENDENCIAS
1. Setup/documentación de la feature si falta, propiedad del orquestador.
2. Foundational: gate multi-feature con test RED, implementación GREEN y validación de compatibilidad con feature 001. Debe terminar verde antes del swarm.
3. Contratos congelados y preflight de ownership, orquestador.
4. Bloque domain, OWNER:domain, archivos exclusivos bajo src/domain/**.
5. Bloque interfaz, OWNER:interfaz, archivos exclusivos del nuevo componente/test bajo src/components/**.
   - Los bloques domain e interfaz pueden llevar [P] porque sus archivos son disjuntos y parten del contrato congelado.
6. Bloque integración/E2E, OWNER:e2e, después de completar/mergear domain e interfaz.
7. Consolidación de tasks/traceability con evidencia y SHA reales, OWNER:orchestrator.
8. Verificación final y auditoría reviewer read-only.

REGLAS DE PARALELISMO
- Ningún worker modifica spec.md, plan.md, tasks.md, traceability.md, package.json, lockfiles, scripts o configuración raíz.
- Los workers registran evidencia en `.swarm/handoffs/<rol>/` y el orquestador la consolida después de merges.
- El agente e2e no puede tocar archivos de domain/interfaz; si encuentra un defecto crea un hallazgo para devolver al propietario.
- Reviewer no tiene tareas de escritura.

COBERTURA OBLIGATORIA
Mapea explícitamente todos los AC-US5-* a tests y GREEN. Incluye tasks para:
- una jugada individual y turno restaurado;
- terminales;
- repetición y vacío;
- historial solo de jugadas legales;
- reset;
- control visible/disponible;
- puntero/teclado;
- foco y orden de foco;
- nombre/anuncio accesible y ausencia de falso anuncio;
- responsive/no color;
- regresión de los 42 AC existentes.

GATES
- Gate multi-feature con RED/GREEN y ledger de GATE.
- Gate de propiedad de archivos/handoff como tooling si el plan lo define.
- Final: unit, component, e2e, build, traceability, cero tasks obligatorias pendientes, git limpio.

COVERAGE AUDIT
Al final incluye una tabla AC -> RED -> GREEN -> test previsto -> OWNER y otra tabla GATE -> RED -> GREEN -> test. No inventes SHA; usa PENDING hasta implementación.
```
