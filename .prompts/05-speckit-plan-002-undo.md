# Prompt: derivar plan y contratos

```text
$speckit-plan

Crea el plan técnico de la feature activa `specs/002-undo` preservando exactamente su spec y la constitución.

REPOSITORIO EXISTENTE
- React 19 + TypeScript estricto + Vite.
- Vitest: dominio y componentes.
- React Testing Library/user-event: componentes e integración.
- Playwright: E2E.
- Cliente local sin backend, persistencia ni red.
- No añadas dependencias.

ARQUITECTURA OBLIGATORIA
1. `src/domain/` conserva autoridad exclusiva sobre reglas, historial y transiciones.
2. Añadir una acción de dominio UNDO y una representación inmutable mínima del historial.
3. Solo una jugada legal aceptada crea un punto de historial.
4. UNDO restaura el snapshot inmediatamente anterior y elimina exactamente una entrada.
5. RESET produce estado inicial e historial vacío.
6. El dominio sigue puro, total, determinista e independiente de React/browser.
7. El componente de interfaz es controlado por props; contrato mínimo esperado: disponibilidad + callback. No importa reducer ni deduce reglas.
8. `src/App.tsx` es composition root: despacha acciones, conecta props, conserva foco/anuncios y no duplica algoritmos de dominio.
9. Los contratos compartidos se escriben y congelan antes del fan-out.

COMPATIBILIDAD
- Decide una migración explícita para tests/fixtures existentes que construyen GameState sin historial; no permitas estados ambiguos.
- Los 42 criterios y tests previos continúan verdes.
- No cambies reglas de victoria, empate, bloqueo terminal o reinicio salvo lo requerido para Undo.

FRONTERAS DE AGENTES
- domain: solo src/domain/** y tests unitarios.
- interfaz: componente nuevo y su test bajo src/components/**; nunca App.tsx.
- e2e: App.tsx, test de integración, tests/e2e/** y estilos globales asignados.
- reviewer: read-only.
- orquestador: SDD, scripts, configuración raíz, package/lockfiles y merges.
- domain e interfaz pueden ejecutarse en paralelo; e2e depende de ambos.

GATE MULTI-FEATURE OBLIGATORIO
Diseña la extensión de `scripts/verify-traceability.mjs` para que el comando final valide todas las features completas bajo `specs/NNN-*`, no solo la ruta activa de `.specify/feature.json`.

El diseño debe:
- descubrir features que contengan spec.md, tasks.md y traceability.md;
- validar cada feature de forma independiente y agregar resultados;
- exigir unicidad global de AC-ID, GATE-ID y Task ID;
- permitir que `.specify/feature.json` siga seleccionando la feature activa para comandos Spec Kit;
- cruzar git log contra la unión de tasks de todas las features;
- conservar compatibilidad con feature 001 y el comando `npm run verify:traceability`;
- tener tests RED/GREEN propios con un GATE-ID nuevo y globalmente único;
- producir errores deterministas por feature y exit code binario.

ARTEFACTOS DEL PLAN
Pide a Spec Kit que genere/actualice solo sus artefactos normales: plan, research si aplica, data-model, quickstart y contratos. Incluye al menos:
- contrato de dominio para GameState/GameAction/UNDO;
- contrato de UI para el control y la integración;
- tabla de transiciones incluyendo UNDO y RESET;
- estrategia de migración/compatibilidad;
- estrategia de tests por AC;
- diseño del gate multi-feature;
- matriz de ownership y orden de merges.

TEST STRATEGY
- Unit: historial, una jugada, repetición, vacío, intentos rechazados, terminales y reset.
- Component: visibilidad, disponibilidad, nombre, puntero/teclado, foco, señal no cromática.
- Integration/E2E: composición real, anuncio, orden de foco, terminal->playing, repetición, reset, responsive y regresión completa.
- Cada test contiene AC-ID.
- RED antes de GREEN y commits separados.

COMANDOS FINALES
npm run test:unit
npm run test:component
npm run test:e2e
npm run build
npm run verify:traceability

No escribas código de producción ni tests en esta fase.
```
