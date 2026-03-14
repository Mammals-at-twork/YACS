---
name: data-debate
description: Genera dos interpretaciones completamente opuestas y ambas defendibles de los mismos datos o análisis. Úsalo cuando quieras cuestionar una conclusión, preparar una discusión o evitar el sesgo de confirmación al leer resultados.
argument-hint: "[datos, métricas o análisis a debatir]"
disable-model-invocation: true
---

Genera dos interpretaciones radicalmente opuestas, rigurosas y defendibles de los siguientes datos o análisis:

$ARGUMENTS

Los datos no tienen una sola lectura honesta. Tu trabajo es demostrar eso construyendo dos argumentos sólidos que lleguen a conclusiones contrarias usando exactamente la misma evidencia.

---

## Estructura

### Contexto compartido

Antes del debate, establece los hechos desnudos: qué dicen los datos sin interpretación. Solo lo observable, sin adjetivos.

---

### Interpretación A — [Título que capture la tesis]

Construye el argumento más sólido posible para esta lectura:

- **Tesis**: una frase que resuma la conclusión
- **Evidencia**: qué datos concretos la sostienen y cómo
- **Mecanismo**: por qué tiene sentido causalmente, no solo estadísticamente
- **Lo que explica**: qué otros hechos o patrones encajan con esta interpretación
- **Su punto más débil**: la grieta que un crítico atacaría primero

---

### Interpretación B — [Título que capture la tesis contraria]

Construye el argumento más sólido posible para la lectura opuesta. Misma estructura:

- **Tesis**: una frase que resuma la conclusión contraria
- **Evidencia**: los mismos datos vistos desde otro ángulo, o los que la Interpretación A ignora
- **Mecanismo**: la explicación causal alternativa
- **Lo que explica**: qué patrones o anomalías encajan mejor aquí que en A
- **Su punto más débil**: la grieta que un crítico atacaría primero

---

### Veredicto del árbitro

No declares un ganador — eso es trabajo del usuario. En su lugar:

- **Qué dato o información adicional resolvería el debate**: lo más específico posible
- **Qué sesgo favorece cada interpretación**: quién tiende a preferir A y por qué, quién tiende a preferir B y por qué
- **La pregunta que ninguna de las dos responde**: el hueco que ambas interpretaciones dejan abierto

---

## Reglas

- Ambas interpretaciones deben ser defendibles por alguien razonable e informado — no una posición de paja.
- No mezcles evidencia inventada con la real. Si algo no está en los datos, di explícitamente que es una hipótesis.
- Si los datos son tan ambiguos que cualquier conclusión es igualmente válida, dilo — eso también es información.
- Evita que una interpretación sea claramente "la buena" y la otra "la mala". Si el debate no es genuino, no sirve.
