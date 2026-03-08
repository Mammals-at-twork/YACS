---
name: tech-debt-hunter
description: Identifica y prioriza la deuda técnica de un archivo o módulo. Úsalo cuando el usuario pregunte por deuda técnica, calidad del código o qué refactorizar primero.
argument-hint: "[archivo o módulo]"
---

Identifica y prioriza la deuda técnica de: $ARGUMENTS

Analiza el código y clasifica cada problema encontrado según su impacto real en el equipo y el negocio:

| Prioridad | Criterio |
|-----------|----------|
| P1 | Bloquea escalar o introduce bugs silenciosos |
| P2 | Ralentiza el desarrollo de forma medible |
| P3 | Fricción menor, refactor deseable pero no urgente |

Para cada elemento de deuda:
- Describe el problema con precisión (no el síntoma, la causa)
- Estima el coste de no actuar (en tiempo de desarrollo o riesgo)
- Propone la acción concreta mínima para resolverlo

## Categorías que analiza

- Código duplicado o mal abstraído
- Acoplamiento excesivo entre módulos
- Tests ausentes en lógica crítica
- Dependencias desactualizadas o con alternativas superiores
- Patrones obsoletos o antipatrones reconocidos
- Documentación inexistente donde es necesaria

## Output

Termina con una tabla resumen ordenada por prioridad y un párrafo con la recomendación de qué atacar primero y por qué.
