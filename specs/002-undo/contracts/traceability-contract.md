# Traceability Contract: Feature 002 Undo

## Scope

Este contrato define la cadena obligatoria criterio → tarea → commit → test para `US-005`, el gate
multi-feature y el preflight operacional del swarm. Plan no crea `tasks.md` ni `traceability.md`. El primer pase Tasks produce la forma
bootstrap compatible con el verificador vigente; después de `T063`, un segundo pase añade la
evidencia suplementaria y vuelve a Analyze antes del fan-out.

## Global identity rules

- Los AC de producto usan exclusivamente `AC-US5-CATEGORIA-nnn` y los 34 IDs definidos en `spec.md`.
- El gate de trazabilidad usa `GATE-MULTIFEATURE-001`.
- El preflight del runner usa `GATE-SWARM-001`.
- El máximo previo es `T061`; esta feature continúa con `T062`.
- `T062` queda reservado para RED de `GATE-MULTIFEATURE-001`.
- `T063` queda reservado para GREEN de `GATE-MULTIFEATURE-001`.
- `T088/T089` completan el modelo multi-familia del mismo gate.
- `T090/T091` quedan reservados para RED/GREEN de `GATE-SWARM-001`.
- `T105/T106` completan el mismo gate con dependencias y frontera explícita de workers.
- `T110/T111` completan el gate con el contrato soportado de Codex CLI.
- `T113/T114` completan el gate con inicialización segura bajo `set -u`.
- `T116/T117` completan el gate con permisos de linked worktree, ignore del enlace y propagación de
  handoffs bloqueantes.
- Tasks asignará IDs consecutivos desde `T064` al trabajo de producto, sin reutilizar IDs de feature 001.
- Ningún AC, GATE o Task ID puede redefinirse en otra feature.

## Required chain

Cada fila de aceptación debe contener:

1. un AC o GATE canónico;
2. una task RED que crea evidencia fallida;
3. una task GREEN que satisface esa evidencia;
4. commits exactos de ambas tasks;
5. uno o más tests que contienen literalmente el ID;
6. SHA RED y GREEN como `PENDING` antes de implementación y registrados con valores reales después de
   cada merge.

El pase bootstrap registra un par canónico por AC. El pase ampliado puede registrar varios pares para
un mismo AC, siempre que cada task y commit conserve identidad propia y que el ledger enumere qué
tests pertenecen a cada par. No se fusionan familias no relacionadas bajo una única task GREEN.

Formatos de commit:

```text
test(US5): Tnnn descripción [AC-US5-...]
feat(US5): Tnnn descripción [AC-US5-...]
test(tooling): T062 descripción [GATE-MULTIFEATURE-001]
feat(tooling): T063 descripción [GATE-MULTIFEATURE-001]
test(tooling): T090 descripción [GATE-SWARM-001]
fix(tooling): T091 descripción [GATE-SWARM-001]
```

Una task no mezcla tooling y producto. Un commit no reclama IDs que su task no declara.

## Planned failing-first AC test matrix

Cada nombre de test se conserva literalmente o se amplía sin eliminar el AC-ID. Cuando un AC tiene evidencia adicional en otra capa, el ledger puede registrar todos los archivos; la siguiente es la evidencia primaria mínima.

| AC-ID | Nivel / propietario | Archivo planificado | Test RED planificado |
|---|---|---|---|
| `AC-US5-INTERACCION-001` | Integration / e2e | `src/components/App.integration.test.tsx` | `AC-US5-INTERACCION-001 muestra Deshacer jugada en cada estado canónico` |
| `AC-US5-INTERACCION-002` | Integration / e2e | `src/components/App.integration.test.tsx` | `AC-US5-INTERACCION-002 ubica Undo entre tablero y Reiniciar partida` |
| `AC-US5-DISPONIBILIDAD-003` | Component / interfaz | `src/components/UndoButton.test.tsx` | `AC-US5-DISPONIBILIDAD-003 expone disponible el control cuando available es true` |
| `AC-US5-DISPONIBILIDAD-004` | Component / interfaz | `src/components/UndoButton.test.tsx` | `AC-US5-DISPONIBILIDAD-004 expone semántica no disponible cuando available es false` |
| `AC-US5-DOMINIO-005` | Unit / domain | `src/domain/game.test.ts` | `AC-US5-DOMINIO-005 restaura exactamente las nueve celdas del último snapshot` |
| `AC-US5-ESTADO-006` | Unit / domain | `src/domain/game.test.ts` | `AC-US5-ESTADO-006 restaura por separado el estado canónico del último snapshot` |
| `AC-US5-ESTADO-007` | Unit / domain | `src/domain/game.test.ts` | `AC-US5-ESTADO-007 devuelve el turno al jugador cuya jugada se retira` |
| `AC-US5-DOMINIO-008` | Unit / domain | `src/domain/game.test.ts` | `AC-US5-DOMINIO-008 elimina una sola marca por acción UNDO` |
| `AC-US5-TERMINAL-009` | Unit / domain | `src/domain/game.test.ts` | `AC-US5-TERMINAL-009 restaura PLAYING desde WON_X WON_O y DRAW` |
| `AC-US5-HISTORIAL-010` | Unit / domain | `src/domain/game.test.ts` | `AC-US5-HISTORIAL-010 deshace repetidamente la siguiente jugada más reciente` |
| `AC-US5-HISTORIAL-011` | Unit / domain | `src/domain/game.test.ts` | `AC-US5-HISTORIAL-011 llega a nueve celdas vacías al consumir el historial` |
| `AC-US5-UNWANTED-012` | Unit / domain | `src/domain/game.test.ts` | `AC-US5-UNWANTED-012 conserva por separado el tablero con historial vacío` |
| `AC-US5-UNWANTED-013` | Unit / domain | `src/domain/game.test.ts` | `AC-US5-UNWANTED-013 conserva por separado el status con historial vacío` |
| `AC-US5-UNWANTED-014` | Unit / domain | `src/domain/game.test.ts` | `AC-US5-UNWANTED-014 mantiene canUndo falso tras UNDO vacío` |
| `AC-US5-HISTORIAL-015` | Unit / domain | `src/domain/game.test.ts` | `AC-US5-HISTORIAL-015 añade exactamente un snapshot por jugada legal` |
| `AC-US5-HISTORIAL-016` | Unit / domain | `src/domain/game.test.ts` | `AC-US5-HISTORIAL-016 no añade historial por intento en celda ocupada` |
| `AC-US5-HISTORIAL-017` | Unit / domain | `src/domain/game.test.ts` | `AC-US5-HISTORIAL-017 no añade historial por intento en estado terminal` |
| `AC-US5-RESET-018` | Unit / domain | `src/domain/game.test.ts` | `AC-US5-RESET-018 RESET deja nueve celdas vacías` |
| `AC-US5-RESET-019` | Unit / domain | `src/domain/game.test.ts` | `AC-US5-RESET-019 RESET restaura PLAYING_X` |
| `AC-US5-RESET-020` | Unit / domain | `src/domain/game.test.ts` | `AC-US5-RESET-020 RESET elimina historial y deja canUndo falso` |
| `AC-US5-PUNTERO-021` | Component / interfaz | `src/components/UndoButton.test.tsx` | `AC-US5-PUNTERO-021 una activación de puntero invoca onUndo una vez` |
| `AC-US5-PUNTERO-022` | E2E / e2e | `tests/e2e/game.spec.ts` | `AC-US5-PUNTERO-022 toque real deshace una jugada legal` |
| `AC-US5-TECLADO-023` | Component / interfaz | `src/components/UndoButton.test.tsx` | `AC-US5-TECLADO-023 Enter invoca onUndo una vez con historial` |
| `AC-US5-TECLADO-024` | Component / interfaz | `src/components/UndoButton.test.tsx` | `AC-US5-TECLADO-024 Espacio invoca onUndo una vez con historial` |
| `AC-US5-FOCO-025` | Component / interfaz | `src/components/UndoButton.test.tsx` | `AC-US5-FOCO-025 conserva el mismo botón enfocado tras activación y rerender` |
| `AC-US5-FOCO-026` | Integration / e2e | `src/components/App.integration.test.tsx` | `AC-US5-FOCO-026 ordena nueve celdas Undo y Reiniciar en la secuencia de foco` |
| `AC-US5-FOCO-027` | E2E / e2e | `tests/e2e/game.spec.ts` | `AC-US5-FOCO-027 muestra contorno continuo al enfocar Deshacer jugada` |
| `AC-US5-A11Y-028` | Component / interfaz | `src/components/UndoButton.test.tsx` | `AC-US5-A11Y-028 tiene nombre visible y accesible exacto Deshacer jugada` |
| `AC-US5-A11Y-029` | Integration / e2e | `src/components/App.integration.test.tsx` | `AC-US5-A11Y-029 anuncia exactamente Jugada deshecha Turno de X` |
| `AC-US5-A11Y-030` | Integration / e2e | `src/components/App.integration.test.tsx` | `AC-US5-A11Y-030 anuncia exactamente Jugada deshecha Turno de O` |
| `AC-US5-A11Y-031` | Integration / e2e | `src/components/App.integration.test.tsx` | `AC-US5-A11Y-031 no cambia la región de estado al intentar Undo vacío` |
| `AC-US5-RESPONSIVE-032` | E2E / e2e | `tests/e2e/game.spec.ts` | `AC-US5-RESPONSIVE-032 evita overflow horizontal entre 320 y 1920 px` |
| `AC-US5-RESPONSIVE-033` | E2E / e2e | `tests/e2e/game.spec.ts` | `AC-US5-RESPONSIVE-033 evita superposición de controles con zoom 200 por ciento` |
| `AC-US5-VISUAL-034` | Component / interfaz | `src/components/UndoButton.test.tsx` | `AC-US5-VISUAL-034 comunica No disponible sin depender solo del color` |

## Observable separation

- `AC-US5-DOMINIO-005` aserta solo las nueve celdas restauradas.
- `AC-US5-ESTADO-006` aserta solo el estado canónico restaurado.
- `AC-US5-ESTADO-007` aserta la identidad del turno derivada de ese estado.
- `AC-US5-UNWANTED-012`, `013` y `014` usan assertions distintas para tablero, estado y disponibilidad.
- `AC-US5-RESET-018`, `019` y `020` usan assertions distintas para tablero, estado e historial/disponibilidad.

Un mismo escenario de setup puede alojar varias pruebas, pero cada test mantiene una respuesta observable principal.

## Mandatory integration and E2E evidence

La evidencia primaria anterior no sustituye estos escenarios de composición. Se incorporan en el
segundo pase Tasks, después de `T063` y antes del segundo Analyze. Sus tests RED deben existir y
fallar antes de cualquier GREEN en `src/App.tsx` o `src/styles.css`.

| AC-ID | Nivel / archivo | Test adicional obligatorio |
|---|---|---|
| `AC-US5-DOMINIO-005` | Integration / `src/components/App.integration.test.tsx` | `AC-US5-DOMINIO-005 App presenta por separado las nueve celdas restauradas` |
| `AC-US5-ESTADO-006` | Integration / `src/components/App.integration.test.tsx` | `AC-US5-ESTADO-006 App presenta por separado el estado restaurado` |
| `AC-US5-ESTADO-007` | Integration / `src/components/App.integration.test.tsx` | `AC-US5-ESTADO-007 App devuelve el turno al jugador de la marca retirada` |
| `AC-US5-DOMINIO-008` | Integration / `src/components/App.integration.test.tsx` | `AC-US5-DOMINIO-008 App retira una sola marca por activación` |
| `AC-US5-TERMINAL-009` | E2E / `tests/e2e/game.spec.ts` | `AC-US5-TERMINAL-009 recupera juego desde WON_X WON_O y DRAW` |
| `AC-US5-HISTORIAL-010` | E2E / `tests/e2e/game.spec.ts` | `AC-US5-HISTORIAL-010 repite Undo una vez por jugada legal` |
| `AC-US5-HISTORIAL-011` | E2E / `tests/e2e/game.spec.ts` | `AC-US5-HISTORIAL-011 llega al tablero vacío y turno de X` |
| `AC-US5-RESET-018` | E2E / `tests/e2e/game.spec.ts` | `AC-US5-RESET-018 reset presenta por separado nueve celdas vacías` |
| `AC-US5-RESET-019` | E2E / `tests/e2e/game.spec.ts` | `AC-US5-RESET-019 reset presenta por separado PLAYING_X` |
| `AC-US5-RESET-020` | E2E / `tests/e2e/game.spec.ts` | `AC-US5-RESET-020 reset elimina historial y bloquea recuperar la partida` |
| `AC-US5-TECLADO-023` | E2E / `tests/e2e/game.spec.ts` | `AC-US5-TECLADO-023 completa jugar y deshacer repetidamente con Enter` |
| `AC-US5-TECLADO-024` | E2E / `tests/e2e/game.spec.ts` | `AC-US5-TECLADO-024 completa Undo y reset con Espacio` |
| `AC-US5-FOCO-025` | Integration / `src/components/App.integration.test.tsx` | `AC-US5-FOCO-025 App conserva foco tras cada Undo aceptado` |
| `AC-US5-A11Y-029` | Integration / `src/components/App.integration.test.tsx` | `AC-US5-A11Y-029 App anuncia exactamente Jugada deshecha Turno de X` |
| `AC-US5-A11Y-030` | Integration / `src/components/App.integration.test.tsx` | `AC-US5-A11Y-030 App anuncia exactamente Jugada deshecha Turno de O` |
| `AC-US5-A11Y-031` | Integration / `src/components/App.integration.test.tsx` | `AC-US5-A11Y-031 App no anuncia cambio al intentar Undo vacío` |
| `AC-US5-RESPONSIVE-032` | E2E / `tests/e2e/game.spec.ts` | `AC-US5-RESPONSIVE-032 evita overflow a 320 768 1280 y 1920 px` |
| `AC-US5-RESPONSIVE-033` | E2E / `tests/e2e/game.spec.ts` | `AC-US5-RESPONSIVE-033 evita superposición al 200 por ciento` |
| `AC-US5-VISUAL-034` | E2E / `tests/e2e/game.spec.ts` | `AC-US5-VISUAL-034 mantiene señal textual No disponible` |

Los tests de `GameStatus` que prueben la prop opcional son evidencia de frontera de componente. No
reemplazan los RED/GREEN de integración para AC029 y AC030, que demuestran que App selecciona el
mensaje correcto desde el estado restaurado.

| AC-ID | Nivel / propietario | Archivo planificado | Test de frontera RED |
|---|---|---|---|
| `AC-US5-A11Y-029` | Component / interfaz | `src/components/GameStatus.test.tsx` | `AC-US5-A11Y-029 GameStatus presenta exactamente el anuncio X recibido` |
| `AC-US5-A11Y-030` | Component / interfaz | `src/components/GameStatus.test.tsx` | `AC-US5-A11Y-030 GameStatus presenta exactamente el anuncio O recibido` |

La suite previa de feature 001 y el build de la rama interfaz demuestran que omitir `announcement`
conserva los mensajes canónicos y que `<GameStatus status={status} />` continúa siendo compatible.

## Gate RED/GREEN contract

Los tests `GATE-MULTIFEATURE-001` cubren como mínimo:

1. descubre dos features completas aunque `.specify/feature.json` señale solo una;
2. valida cada feature de forma independiente antes de agregar;
3. rechaza AC-ID duplicado entre specs distintas;
4. rechaza GATE-ID duplicado entre features;
5. rechaza Task ID duplicado entre `tasks.md` distintos;
6. cruza commits contra la unión de tasks;
7. conserva un fixture compatible con feature 001;
8. informa una feature parcial en fase final;
9. ordena diagnósticos de forma determinista por feature e ID;
10. retorna `0` para el conjunto válido y `1` para cualquier error;
11. acepta fases `PLANNED`, `IMPLEMENTING`, `RELEASE_CANDIDATE` y `VERIFIED`, y rechaza cualquier
    otra;
12. en fase final descubre y valida estructuralmente una feature `PLANNED` sin exigir sus SHA
    futuros;
13. rechaza un `RELEASE_CANDIDATE` o `VERIFIED` con cualquier `PENDING`;
14. cruza el log con la unión de tasks de todas las fases;
15. representa varios pares RED/GREEN para un AC y bloques RED asociados a varias GREEN sin perder
    orden ni identidad.

No se añaden dependencias: se reutiliza `node:test`, archivos temporales y las funciones exportadas del verificador.

Los tests `GATE-SWARM-001` cubren la raíz canónica `.prompts/`, la presencia de los prompts domain
e interfaz, el enlace local de `node_modules` para domain/interfaz/e2e y comandos explícitos de
trazabilidad/ownership en los prompts paralelos. También rechazan opciones CLI inexistentes y
exigen la política no interactiva mediante configuración soportada. El gate no lanza agentes ni
crea worktrees. Una regresión adicional impide declaraciones locales dependientes en una única
sentencia bajo `set -u`. El último bloque exige raíces escribibles explícitas para el Git común y
la caché Vite, ignora el enlace local de dependencias y convierte `REQUEST_ORCHESTRATOR` en un exit
no cero del runner.

Para producto, `AC-US5-HISTORIAL-010/011` y `AC-US5-UNWANTED-012/013/014` comparten un único bloque
RED domain: todas las pruebas se commitean antes del GREEN y el bloque falla por la ausencia
observable de `canUndo`. No se exige que una aserción individual vuelva a fallar si ya quedó
satisfecha por un GREEN anterior del mismo reducer.

## Ledger lifecycle and obligations

### Pase bootstrap y primer Analyze

Inmediatamente después del primer Tasks, `traceability.md` declara `PLANNED` y registra por AC/GATE:

- US o gate;
- un RED Task ID canónico y SHA `PENDING`;
- un GREEN Task ID canónico y SHA `PENDING`;
- archivos y nombres de test con el ID literal;
- estado de evidencia `PENDING`;
- notas solo si no sustituyen evidencia.

El bootstrap histórico contiene 35 filas estructurales: 34 AC y `GATE-MULTIFEATURE-001`. No
introduce todavía pares suplementarios para el mismo AC. El verificador vigente en `--phase=tasks`
debe aceptar esa forma antes del primer Analyze. El pase ampliado conserva esas filas, añade los
pares suplementarios y agrega `GATE-SWARM-001` antes del segundo Analyze.

### Modelo instalado por el gate

`T063` introduce estas fases explícitas:

| Fase | Obligación en `--phase=tasks` | Obligación en `--phase=final` |
|---|---|---|
| `PLANNED` | cobertura y enlaces estructurales completos; evidencia futura puede ser `PENDING` | descubrimiento, parsing, unicidad global y unión de tasks; no exige evidencia futura |
| `IMPLEMENTING` | igual que `PLANNED`, incluyendo toda evidencia suplementaria ya planificada | igual validación global/estructural; reporta madurez sin tratar `PENDING` como release |
| `RELEASE_CANDIDATE` | estructura completa y cero `PENDING` | evidencia completa, tests y SHA válidos obligatorios |
| `VERIFIED` | estructura completa y cero `PENDING` | mismas obligaciones finales que una candidata |

El parser normaliza la capitalización, por lo que los encabezados históricos `Planned` y `Verified`
se interpretan como los valores anteriores sin editar feature 001. Fase ausente o desconocida es
error. Ninguna fase excluye una tripleta del descubrimiento, de la unicidad global ni de la unión de
Task IDs. La diferencia afecta únicamente cuándo la evidencia futura pasa a ser requisito de release.

### Pase ampliado y segundo Analyze

Después de integrar `T062/T063`:

1. Tasks conserva los IDs ya commiteados y anexa nuevos IDs globales para los pares suplementarios;
2. el ledger registra cada par adicional y su test previsto;
3. las RED se separan por familias observables y preceden al bloque GREEN;
4. las GREEN de composición se particionan en shell/orden/disponibilidad, conexión Undo al dominio,
   anuncio/foco y estilos responsive/no cromáticos;
5. el nuevo `--phase=tasks` pasa;
6. se repite Analyze y ningún worker de producto comienza sin GO.

### Durante implementación y cierre

- El segundo Tasks incluye tareas del orquestador para commitear las transiciones de ciclo de vida;
  ningún cambio de fase queda fuera del grafo auditable.
- Tras el segundo Analyze en GO, el orquestador congela contratos, cambia el ledger a
  `IMPLEMENTING`, commitea la transición y ejecuta el baseline completo sobre ese commit exacto.
- Los worktrees de producto solo nacen si ese baseline está verde.
- Ningún worker modifica el ledger.
- El orquestador actualiza exclusivamente las filas cubiertas después de cada merge, usando el
  handoff y SHA observados en `git log`.
- Las filas de `GATE-MULTIFEATURE-001` se completan al integrar `T062/T063` y `T088/T089`.
- La fila de `GATE-SWARM-001` se completa al integrar `T090/T091`, antes del fan-out.
- Las filas domain, interfaz e integración/E2E se completan después de sus merges respectivos.
- Con cero `PENDING`, el orquestador cambia a `RELEASE_CANDIDATE` y ejecuta la validación final.
- Solo después de PASS cambia a `VERIFIED` y repite la validación final.

El verificador final lee todas las tripletas, no solo la feature activa. Exige evidencia completa a
`RELEASE_CANDIDATE` y `VERIFIED`, mientras mantiene descubrimiento, IDs y tasks globales para
`PLANNED` e `IMPLEMENTING`.

## Final command contract

La entrega solo puede declararse verde si pasan, en este orden:

```bash
npm run test:unit
npm run test:component
npm run test:e2e
npm run build
npm run verify:traceability
```
