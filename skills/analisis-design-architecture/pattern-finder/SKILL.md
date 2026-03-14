---
name: pattern-finder
description: Explora y valida patrones de diseño aplicables a un problema concreto. Úsalo cuando necesites encontrar la mejor solución de diseño, comparar alternativas o validar que el patrón elegido es el más adecuado para el contexto.
argument-hint: "[descripción del problema o contexto de diseño]"
disable-model-invocation: true
---

Analiza el siguiente problema de diseño, identifica los patrones aplicables y valida cuál es la mejor solución para este contexto concreto:

$ARGUMENTS

Tu trabajo no es listar patrones — es encontrar el patrón correcto para este problema específico, justificar por qué encaja mejor que las alternativas y mostrar cómo se vería aplicado. Un patrón mal elegido añade complejidad sin valor.

---

## Fase 1 — Descomposición del problema

Antes de evaluar ningún patrón, extrae las fuerzas reales en juego:

- **Problema central**: qué tensión de diseño existe (acoplamiento, variabilidad, complejidad, extensibilidad...)
- **Restricciones del contexto**: lenguaje, framework, tamaño del equipo, frecuencia de cambio esperada
- **Comportamiento que varía**: qué parte del sistema cambiará con más frecuencia o de más formas distintas
- **Comportamiento que es estable**: qué parte nunca debería cambiar aunque el resto evolucione
- **Señales de alerta ya presentes**: ¿hay código duplicado, switch/if-else que crece, dependencias circulares, clases que hacen demasiado?

---

## Fase 2 — Patrones candidatos

Identifica los 2-4 patrones más relevantes para este problema. Para cada candidato:

### Patrón: [Nombre] — [Categoría: Creacional / Estructural / Comportamiento / Arquitectónico]

**Qué problema resuelve en general**: una frase, sin parafrasear el nombre del patrón.

**Por qué podría encajar aquí**: la conexión concreta entre el patrón y las fuerzas identificadas en la Fase 1.

**Cómo se vería aplicado a este contexto**: un esquema o pseudocódigo mínimo que muestre la estructura, no una implementación genérica del patrón.

**Lo que resuelve bien**: qué aspectos del problema ataca directamente.

**Lo que no resuelve o complica**: qué aspectos quedan sin cubrir o se hacen más difíciles.

**Cuándo deja de funcionar**: en qué condición futura este patrón se convierte en el problema.

---

## Fase 3 — Análisis comparativo

Una vez evaluados los candidatos, compáralos directamente:

| Criterio | [Patrón A] | [Patrón B] | [Patrón C] |
|----------|-----------|-----------|-----------|
| Reduce el acoplamiento identificado | ✅ / ⚠️ / ❌ | | |
| Soporta la variabilidad esperada | | | |
| Complejidad de implementación | Baja / Media / Alta | | |
| Comprensibilidad para el equipo | | | |
| Testabilidad | | | |
| Coste si los requisitos cambian | | | |

**Combinaciones viables**: ¿hay patrones que se complementen y juntos resuelvan mejor el problema que cualquiera por separado?

---

## Fase 4 — Recomendación

### Patrón recomendado: [Nombre]

**Por qué este y no los otros**: la razón concreta, no genérica. Qué fuerza del problema resuelve que los demás no resuelven tan bien.

**Cómo aplicarlo a este problema**: implementación orientada al contexto específico, con estructura de clases/módulos, responsabilidades y relaciones. No un ejemplo genérico del patrón — el problema real.

**Lo que hay que vigilar**: los puntos donde la implementación puede desviarse y perder los beneficios del patrón.

---

## Fase 5 — Anti-patrones tentadores

¿Qué soluciones parecen razonables a primera vista pero serían un error en este contexto?

Para cada anti-patrón tentador:
- **Por qué parece buena idea**: la lógica que lleva a elegirlo
- **Por qué es un problema**: qué consecuencia concreta tiene en este contexto
- **La señal de que ya estás en él**: cómo reconocerlo si ya está en el código

---

## Fase 6 — Evolución del diseño

El mejor patrón para hoy puede ser el problema de mañana. Responde:

- **Si el requisito X cambia**, ¿cómo afecta al patrón elegido? ¿Se extiende bien o hay que reemplazarlo?
- **¿Cuándo escalar?**: en qué momento el patrón se queda pequeño y hacia qué evolucionaría naturalmente
- **¿Cuándo simplificar?**: si el sistema se simplifica en lugar de crecer, ¿el patrón se convierte en sobreingeniería?
