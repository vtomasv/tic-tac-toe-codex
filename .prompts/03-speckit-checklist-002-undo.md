# Prompt: checklist de calidad de requisitos

```text
$speckit-checklist

Genera un checklist formal para revisión de la calidad de requisitos de la feature 002 Undo.

CONTEXTO CERRADO
- Audiencia: autor y reviewer de PR.
- Profundidad: release gate formal, no sanity checklist.
- Foco: semántica de estado/historial, accesibilidad, casos límite, compatibilidad y trazabilidad multi-feature.
- No preguntes por alcance, audiencia o profundidad: ya están definidos.

IMPORTANTE
El checklist debe evaluar lo escrito en la spec, no probar la implementación. Formula "¿Está especificado...?", "¿Es inequívoco...?" o "¿Es medible...?". No uses instrucciones como probar, hacer clic, ejecutar o verificar que el código funcione.

COBERTURA MÍNIMA
- Definición inequívoca de una jugada individual.
- Restauración exacta de tablero y estado/turno.
- Estados terminales.
- Undo repetido y límite vacío.
- Diferencia entre jugadas legales e intentos rechazados.
- Reset y pérdida del historial previo.
- Visibilidad/disponibilidad del control.
- Operación por puntero y teclado.
- Orden y permanencia del foco.
- Nombre y anuncio accesible exactos; ausencia de falso anuncio.
- Señal de indisponibilidad no dependiente solo del color.
- Responsive/zoom.
- Fuera de alcance y compatibilidad con feature 001.
- IDs globalmente únicos y Traceability Contract.
- Outcomes cuantificados y testables.

TRAZABILIDAD DEL CHECKLIST
- Al menos 80 % de ítems debe referenciar una sección/AC o usar [Gap], [Ambiguity], [Conflict] o [Assumption].
- Prioriza 25-35 ítems de alto riesgo y elimina duplicados.
- Guarda un archivo de checklist con nombre específico para undo sin reemplazar otros checklists existentes.
```
