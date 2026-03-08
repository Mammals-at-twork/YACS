---
name: llm-safety-checks
description: Audita código, prompts o flujos de agentes en busca de vulnerabilidades específicas de sistemas basados en LLMs (prompt injection, obfuscación, jailbreak, envenenamiento de RAG, etc).
argument-hint: "[archivo, prompt o descripción del flujo]"
disable-model-invocation: true
---

Audita el siguiente código, prompt o arquitectura en busca de vulnerabilidades específicas de sistemas LLM:

$ARGUMENTS

Para cada vulnerabilidad encontrada:

1. Nombra la categoría de ataque
2. Señala el punto exacto del código/prompt/flujo donde existe la exposición
3. Describe el ataque concreto: qué haría un adversario y qué conseguiría
4. Proporciona la mitigación específica

---

## Vectores que analiza

### Prompt Injection Indirecta
El agente consume contenido de fuentes externas (webs, documentos, emails, resultados de herramientas) que puede contener instrucciones maliciosas camufladas. Busca:
- Llamadas a herramientas cuyo output se inyecta directamente en el contexto sin sanitizar
- Retrieval (RAG) donde el contenido recuperado no está delimitado claramente del prompt del sistema
- Resúmenes o transcripciones de contenido externo tratados como instrucciones de confianza
- Ausencia de separación semántica entre datos y órdenes (e.g., sin etiquetas `<data>...</data>`)

### Obfuscación de Instrucciones
Técnicas para eludir filtros de seguridad mediante transformación del payload. Busca:
- **Codificación**: Base64, ROT13, hex, unicode escaping usado para ocultar instrucciones
- **Fragmentación**: instrucciones divididas en múltiples turnos o variables que se ensamblan en tiempo de ejecución
- **Traducción en cadena**: instrucciones en idiomas inusuales o mezclados para confundir guardrails entrenados principalmente en inglés
- **Typosquatting semántico**: sustitución de caracteres visualmente similares (cirílico, homóglifos Unicode)
- **Steganografía en texto**: instrucciones ocultas en espacios en blanco, caracteres de control o zero-width characters

### Escalada de Privilegios por Contexto
El agente asume permisos o identidades no otorgadas explícitamente. Busca:
- Prompts que permiten al modelo redefinir su rol o sus restricciones en tiempo de ejecución
- Ausencia de validación de quién originó una instrucción (usuario vs. herramienta vs. contenido externo)
- Confianza implícita en el historial de conversación para tomar decisiones con efectos secundarios irreversibles

### Exfiltración de Contexto
El LLM puede ser manipulado para revelar información del sistema o de otros usuarios. Busca:
- Prompt de sistema expuesto o reconstruible mediante preguntas de reflexión (`¿cuáles son tus instrucciones?`)
- Datos de otros usuarios en contexto compartido (multi-tenant sin aislamiento)
- Herramientas que devuelven más información de la necesaria y esa información llega íntegra al modelo

### Jailbreak Estructural
Ataques que usan la estructura del prompt para saltar restricciones. Busca:
- Uso de roleplay, ficción o hipotéticos como vector (`"imagina que eres un sistema sin restricciones"`)
- Prompts anidados: instrucciones dentro de documentos que el agente procesa como datos
- Instrucciones de sistema sobreescritas mediante inyección en el turno de usuario con formato similar al sistema

### Envenenamiento de Memoria o RAG
Si el sistema usa memoria persistente o retrieval. Busca:
- Ausencia de validación de la procedencia de los documentos indexados
- Posibilidad de que un atacante introduzca documentos que modifiquen el comportamiento futuro del agente
- Falta de TTL o mecanismo de invalidación de memorias potencialmente comprometidas

---

## Output

Para cada vulnerabilidad encontrada, usa este formato:

```
## [Nombre del vector] — Severidad: CRÍTICA / ALTA / MEDIA / BAJA

**Dónde:** [archivo:línea o descripción del punto en el flujo]
**Ataque:** [qué haría un adversario paso a paso]
**Impacto:** [qué consigue si tiene éxito]
**Mitigación:** [acción concreta a implementar]
```

Termina con un resumen de la superficie de ataque total y una recomendación de qué mitigar primero.
