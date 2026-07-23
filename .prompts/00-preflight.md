# Preflight de solo lectura

Copia en una sesión principal de Codex antes de ejecutar Spec Kit:

```text
Inspecciona el repositorio tic-tac-toe-codex sin modificar archivos.

OBJETIVOS
1. Confirma la rama actual, árbol limpio y commit base.
2. Lee AGENTS.md, .specify/memory/constitution.md, .specify/feature.json y package.json.
3. Enumera las features existentes bajo specs/ y calcula:
   - máximo Task ID Tnnn usado;
   - todos los AC-ID y GATE-ID existentes;
   - cualquier duplicado global.
4. Ejecuta el baseline disponible en este orden:
   npm ci
   npm run test:unit
   npm run test:component
   npm run test:e2e
   npm run build
   npm run verify:traceability
5. No corrijas nada. Reporta comando, exit code y primera causa de cualquier fallo.
6. Confirma si Spec Kit está inicializado para Codex y si existen las skills $speckit-*.

SALIDA
- BASE_SHA
- FEATURE_ACTIVA
- MAX_TASK_ID
- IDS_DUPLICADOS
- BASELINE: PASS o FAIL
- BLOQUEADORES

No continúes con Specify si BASELINE no es PASS o hay IDs duplicados.
```
