<!--
Sync Impact Report
- Version change: 1.0.0 -> 1.1.0
- Modified principles:
  - III. Trazabilidad completa: añade GATE-IDs para tooling fundacional sin AC de producto.
  - VI. Commits pequeños y auditables: distingue formatos de producto y tooling.
- Added sections: ninguna.
- Removed sections: ninguna.
- Templates requiring updates:
  - ✅ .specify/templates/spec-template.md
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/tasks-template.md
  - ✅ .agents/skills/speckit-specify/SKILL.md
  - ✅ .agents/skills/speckit-plan/SKILL.md
  - ✅ .agents/skills/speckit-tasks/SKILL.md
  - ✅ .agents/skills/speckit-analyze/SKILL.md
  - ✅ .agents/skills/speckit-implement/SKILL.md
  - ✅ specs/001-tres-en-raya-web/plan.md
  - ✅ specs/001-tres-en-raya-web/tasks.md
  - ✅ specs/001-tres-en-raya-web/traceability.md
  - ✅ specs/001-tres-en-raya-web/contracts/traceability-contract.md
  - ✅ specs/001-tres-en-raya-web/research.md
  - ✅ scripts/verify-traceability.test.mjs
  - ✅ scripts/verify-traceability.mjs
  - ✅ demás comandos Spec Kit revisados; sin referencias incompatibles detectadas
- Follow-up TODOs: ninguno.
-->
# Constitución de Tres en Raya

## Core Principles

### I. Spec como fuente de verdad

El comportamiento aceptado de cada feature DEBE vivir en `specs/<feature>/spec.md`. El código,
`plan.md` y `tasks.md` son artefactos derivados de esa especificación. Ningún cambio de
comportamiento PUEDE comenzar modificando código: primero se crea o actualiza la spec y después se
regeneran los artefactos derivados afectados. Esta jerarquía evita que la implementación se convierta
en una fuente de requisitos implícitos.

### II. Requisitos EARS

Cada criterio de aceptación DEBE usar explícitamente un patrón EARS y DEBE tener un ID estable con
formato `AC-USn-CATEGORIA-nnn`. La categoría DEBE identificar el área cubierta, por ejemplo
`DOMINIO`, `ESTADO`, `INTERACCION`, `A11Y` o `RESPONSIVE`. Cada criterio DEBE expresar una respuesta
observable y verificable. El conjunto de criterios de una user story DEBE cubrir, cuando aplique,
lógica de dominio, estados, interacción y accesibilidad de la interfaz; no basta con escenarios
narrativos sin un patrón EARS identificable.

### III. Trazabilidad completa

Cada criterio de aceptación DEBE aparecer explícitamente en una o más tareas. Cada tarea perteneciente
a una user story DEBE declarar los IDs de los criterios que satisface. Cada nombre de test DEBE incluir
el ID del criterio que verifica. Cada commit de test o implementación DEBE incluir el ID de tarea y los
IDs de criterios correspondientes. Cada feature DEBE mantener `specs/<feature>/traceability.md` con el
mapeo criterio -> tareas -> tests -> commits. El repositorio DEBE disponer de un script automático que
falle cuando falte cualquier enlace obligatorio de trazabilidad; las coincidencias inferidas no
sustituyen referencias explícitas. El tooling fundacional que implementa una puerta de calidad y no
corresponde a comportamiento aceptado NO DEBE inventar una user story ni un AC-ID. Cada una de esas
puertas DEBE tener un ID estable `GATE-CATEGORIA-nnn`, tareas RED/GREEN explícitas y un registro en
`traceability.md` que vincule puerta -> tareas -> tests -> commits.

### IV. Desarrollo dirigido por tests

Los tests de cada criterio DEBEN escribirse y ejecutarse en rojo antes de implementar el
comportamiento correspondiente. La evidencia del resultado rojo DEBE registrarse en la tarea o en el
artefacto de trazabilidad. Una tarea NO PUEDE marcarse como completada mientras sus tests no pasen y
NO PUEDE crearse un commit de implementación con tests fallando. El ciclo obligatorio es
red -> green -> refactor, conservando la trazabilidad durante todas las etapas.

### V. Depuración spec-first

Ante un defecto, primero DEBE existir una reproducción vinculada a un criterio. Si el comportamiento
no está definido o es ambiguo, `spec.md` DEBE corregirse antes de modificar código. Después DEBEN
regenerarse `plan.md` y `tasks.md` para el alcance afectado, ejecutarse `speckit-analyze` y resolverse
todos sus hallazgos críticos antes de reanudar la implementación. El código afectado DEBE ser
regenerado mediante `speckit-implement`. Se PROHÍBEN parches manuales que cambien comportamiento sin
cambiar primero la especificación.

### VI. Commits pequeños y auditables

Cada tarea de test DEBE producir un commit `test(...)`; cada tarea de implementación DEBE producir un
commit `feat(...)` o `fix(...)`. Para comportamiento aceptado, el asunto DEBE seguir exactamente
`<tipo>(USn): <TaskID> <descripción> [<AC-ID> ...]`. Para tooling fundacional sin comportamiento de
producto, el asunto DEBE seguir exactamente
`<tipo>(tooling): <TaskID> <descripción> [<GATE-ID> ...]`. Un commit de tooling DEBE limitarse a la
puerta declarada, no puede incluir comportamiento de producto y DEBE conservar la misma evidencia
RED antes de GREEN. Los cambios de especificación, plan y tareas DEBEN registrarse en commits
separados entre sí y separados de tests e implementación. Un commit NO DEBE mezclar tareas,
criterios o puertas no relacionados.

### VII. Calidad de interfaz

Los estados visuales e interactivos DEBEN especificarse mediante criterios EARS. La spec DEBE cubrir
entrada por puntero y teclado, foco visible y orden de foco, anuncios para tecnologías asistivas,
estados terminales y comportamiento responsive. La información esencial NO PUEDE comunicarse solo
mediante color; DEBE existir al menos una señal adicional perceptible. Estas obligaciones aplican a
cualquier user story que exponga interfaz, incluso si su objetivo principal es lógica de dominio.

### VIII. Puertas de calidad

`speckit-plan` NO PUEDE ejecutarse mientras exista un marcador `NEEDS CLARIFICATION` en la spec.
`speckit-tasks` NO PUEDE generar tareas si el plan contradice la spec. `speckit-implement` NO PUEDE
comenzar mientras algún criterio carezca de tarea o de test previsto. La Definition of Done exige que
todos los tests, el build y la comprobación automática de trazabilidad finalicen correctamente.

## Flujo de desarrollo y artefactos obligatorios

El flujo normativo es:

1. Crear o actualizar `spec.md` con criterios EARS identificados y verificables.
2. Resolver todas las aclaraciones y generar `plan.md` sin contradecir la spec.
3. Generar `tasks.md` con tareas de test e implementación separadas y cobertura explícita de AC.
4. Crear o actualizar `traceability.md`, registrar cada `GATE-ID` fundacional y crear el script
   automático de validación.
5. Ejecutar `speckit-analyze` y resolver cualquier conflicto crítico.
6. Ejecutar tests en rojo, confirmar la evidencia y realizar el commit de test.
7. Implementar únicamente mediante `speckit-implement`, llevar los tests a verde y realizar el commit
   de implementación.

Los artefactos derivados DEBEN regenerarse cuando cambie el comportamiento especificado. Las revisiones
DEBEN rechazar cambios cuyo orden o evidencia no demuestren este flujo.

## Cumplimiento y Definition of Done

Antes de implementar, una revisión DEBE confirmar que cada AC tiene tareas de test e implementación
previstas y que `traceability.md` puede representar todos los enlaces de AC y GATE. Antes de completar
una tarea, DEBEN pasar sus tests asociados. Antes de completar una feature, DEBEN pasar el conjunto de
tests, el build y el script de trazabilidad. La revisión de commits DEBE validar el formato de producto
o tooling aplicable y la separación de artefactos, tests e implementación.

## Governance

Esta constitución prevalece sobre las prácticas, plantillas y decisiones locales que la contradigan.
Toda enmienda DEBE modificar primero este documento, incluir su justificación y un informe de impacto,
actualizar las plantillas o instrucciones dependientes y aplicar versionado semántico: MAJOR para
cambios incompatibles o eliminación/redefinición de principios, MINOR para principios o exigencias
materiales nuevas y PATCH para aclaraciones no semánticas.

Toda excepción DEBE documentarse explícitamente en `plan.md`, con alcance, motivo, riesgos, responsable
y estrategia de retorno al cumplimiento. Ninguna excepción PUEDE debilitar la trazabilidad, TDD ni la
regla spec-first, ni autorizar que se omita una puerta de calidad. Cada revisión de plan, tareas, PR o
release DEBE comprobar cumplimiento constitucional; una violación de una regla MUST/DEBE es bloqueante.

**Version**: 1.1.0 | **Ratified**: 2026-07-14 | **Last Amended**: 2026-07-14
