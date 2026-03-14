---
name: owasp-guardian
description: Audita código en busca de vulnerabilidades del OWASP Top 10. Úsalo al revisar código antes de un merge, release o auditoría de seguridad.
argument-hint: "[archivo o ruta]"
disable-model-invocation: true
---

Audita el código indicado en busca de vulnerabilidades del OWASP Top 10: $ARGUMENTS

Analiza el código con mentalidad de atacante. Para cada vulnerabilidad encontrada:

1. Identifica la categoría OWASP (e.g., A01 - Broken Access Control)
2. Muestra el fragmento exacto de código vulnerable con su línea
3. Explica el vector de ataque concreto (cómo se explotaría)
4. Proporciona la corrección con código

Al terminar, muestra un resumen con el nivel de riesgo global (CRÍTICO / ALTO / MEDIO / BAJO).

## Alcance

Revisa específicamente:
- Inyecciones (SQL, NoSQL, OS, LDAP)
- Autenticación y gestión de sesiones
- Exposición de datos sensibles (claves, tokens, PII en logs o respuestas)
- Control de acceso roto
- Configuraciones de seguridad incorrectas
- Deserialización insegura
- Dependencias con vulnerabilidades conocidas

## Tono

Directo y técnico. Sin rodeos. Si el código es seguro, dilo con una frase y explica por qué.
