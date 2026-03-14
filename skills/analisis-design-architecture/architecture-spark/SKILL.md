---
name: architecture-spark
description: Genera una reflexión sobre análisis, diseño o arquitectura de software de la que tirar del hilo. Úsalo cuando quieras explorar nuevas perspectivas sobre cómo estructurar sistemas, tomar decisiones técnicas o pensar en el diseño antes de llegar a una solución concreta.
disable-model-invocation: true
---

Elige una de las semillas de reflexión del repertorio de abajo. Selecciona la que consideres más inesperada o menos obvia dado el contexto actual de la conversación. Si no hay contexto previo, elige al azar.

Presenta la reflexión siguiendo siempre este formato:

---

## Semilla de hoy

**[Título de la reflexión]**

[2-3 párrafos que desarrollen la tensión central del tema. No lo resuelvas — plántalo. Usa ejemplos concretos, no abstracciones. Busca la contradicción o el punto incómodo que hace que el tema valga la pena pensar.]

---

## Hilos de los que tirar

Tres direcciones distintas desde las que explorar esta semilla. Cada una debe llevar a un territorio diferente:

- **→ [Hilo 1]**: [Una frase que abra una pregunta o un experimento mental]
- **→ [Hilo 2]**: [Una frase que conecte con una decisión concreta de diseño o de equipo]
- **→ [Hilo 3]**: [Una frase que lleve el concepto a un extremo o a un dominio inesperado]

---

## La pregunta

> [Una sola pregunta directa, sin respuesta aquí. Que incomode. Que sea difícil de ignorar.]

---

## Repertorio de semillas

### Sobre qué es una buena arquitectura
- La arquitectura perfecta que nadie del equipo entiende no es buena arquitectura
- El sistema que nunca necesitó escalar: ¿fue un error de diseño o una buena decisión de negocio?
- Una arquitectura es también un argumento: ¿qué está afirmando la tuya sobre el negocio?
- La frontera entre framework y arquitectura: cuándo el primero secuestra a la segunda
- El diagrama de arquitectura que describe lo que debería ser, no lo que hay: ¿documento o deuda?

### Sobre decisiones y trade-offs
- Toda decisión de arquitectura es una apuesta sobre qué cambiará en el futuro — y casi siempre nos equivocamos
- La decisión que nadie tomó pero que está en producción: cómo los sistemas adquieren forma por inercia
- El momento en el que "lo arreglamos después" se convierte en "así funciona esto"
- Reversibilidad como criterio de diseño: por qué no se habla más de ella
- Las decisiones que se tomaron en el primer sprint y que gobiernan todo lo demás cinco años después

### Sobre acoplamiento y cohesión
- El servicio que sabe demasiado sobre sus vecinos: ¿microservicio o monolito distribuido disfrazado?
- La diferencia entre una API y un contrato — y por qué confundirlas duele durante años
- El evento que nadie consume pero que nadie se atreve a eliminar
- Shared database como patología: cuándo es un error de diseño y cuándo es pragmatismo honesto
- Cohesión sin cohesión: módulos que agrupan código que no tiene nada que ver

### Sobre simplicidad y complejidad
- El sistema más simple posible que resuelve el problema real: ¿alguien lo ha intentado de verdad?
- La complejidad accidental como sedimento: se acumula sin que nadie la elija explícitamente
- Abstraer demasiado pronto vs. abstraer demasiado tarde — y cómo saber en qué lado estás
- El patrón de diseño aplicado porque sí: elegancia técnica vs. solución al problema
- YAGNI como principio y como excusa: la diferencia entre los dos usos

### Sobre la evolución de los sistemas en el tiempo
- El sistema que fue diseñado para durar 2 años y cumplió 10: ¿éxito o fracaso de diseño?
- La migración que nunca termina: cómo los sistemas viven en dos épocas a la vez
- Backwards compatibility como deuda acumulada — y cuándo es honesto romperla
- El momento en el que añadir una feature es más costoso que reescribir el módulo
- Strangler fig pattern: cuándo es una estrategia y cuándo es procrastinación arquitectónica

### Sobre los límites y fronteras del sistema
- El bounded context que nadie definió pero que existe en la cabeza de una sola persona
- La frontera entre dos sistemas que es también la frontera entre dos equipos: ¿coinciden bien?
- Lo que queda fuera del sistema define al sistema tanto como lo que está dentro
- El dato que vive en tres sitios distintos porque nadie acordó dónde debía vivir
- API pública vs. API interna: por qué tratarlas igual es un error y tratarlas diferente también lo es

### Sobre diseño emergente vs. planificado
- Big design up front: cuándo es disciplina y cuándo es ansiedad disfrazada de rigor
- El equipo que no diseña porque "somos ágiles": la confusión entre no documentar y no pensar
- La arquitectura que emerge del código vs. la que emerge de las conversaciones
- Spike como herramienta de diseño: cuándo explorar es más valioso que planificar
- El prototipo que se fue a producción: historia de todos los equipos

### Sobre análisis de requisitos y diseño
- El requisito que nadie cuestionó y que costó seis meses de trabajo innecesario
- La diferencia entre lo que el usuario dice que quiere, lo que quiere de verdad y lo que necesita
- El sistema que resuelve perfectamente el problema equivocado
- Non-functional requirements como ciudadanos de segunda clase — hasta que explotan
- El análisis que revela que el problema real no era el problema descrito
