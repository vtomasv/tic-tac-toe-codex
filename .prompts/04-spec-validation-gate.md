# Gate manual después de Specify / Clarify / Checklist

Ejecutar en terminal. No continuar a Plan si cualquiera falla.

```bash
set -euo pipefail

test "$(node -p "JSON.parse(require('fs').readFileSync('.specify/feature.json','utf8')).feature_directory")" = "specs/002-undo"

test -f specs/002-undo/spec.md
! grep -R -n "NEEDS CLARIFICATION\|TODO\|TKTK\|???" specs/002-undo

grep -q "US-005" specs/002-undo/spec.md
grep -q "AC-US5-" specs/002-undo/spec.md
grep -q "Deshacer jugada" specs/002-undo/spec.md

# AC globalmente únicos entre 001 y 002
ids_file="$(mktemp)"
grep -RhoE 'AC-US[0-9]+-[A-Z0-9]+-[0-9]{3}' specs/*/spec.md | sort > "$ids_file"
test -z "$(uniq -d "$ids_file")"
rm -f "$ids_file"

# Todos los checklists de la feature sin pendientes
! grep -R -n -F -- '- [ ]' specs/002-undo/checklists

git diff --check
```

Revisión humana obligatoria:

```text
Lee specs/002-undo/spec.md como reviewer de requisitos. Confirma que no contiene decisiones técnicas, que cada AC tiene una respuesta observable y que las decisiones cerradas de Undo están representadas sin contradicciones. Entrega PASS o lista de bloqueadores; no edites.
```
