![YACS](https://boletinstatics.blob.core.windows.net/imagenes/yacs_logo.png)
# YACS — Yet Another Claude Skills Repo

> Una colección diferente de **Skills para Claude Code** que expanden lo que puedes hacer en cada sesión: desde auditorías de seguridad hasta diseño de sistemas, gamificación de procesos o simplemente pensar diferente.

---

## ¿Qué es esto?

**YACS** es un repertorio de Skills — herramientas basadas en prompts que Claude Code invoca automáticamente cuando es relevante, o tú invocas manualmente con `/skill-name`.

No son comandos genéricos. Cada skill está diseñado para resolver un tipo de problema específico con rigor y profundidad:

- **Auditorías de seguridad** que buscan los vectores reales, no solo las obviedades
- **Reflexiones sobre calidad** que te hacen pensar diferente
- **Análisis de datos** que explora dos interpretaciones opuestas del mismo número
- **Diseño de gamificación** específico para contextos corporativos
- **Exploración de patrones** de diseño aplicados a tu problema concreto

---

## Instalación

### Opción 1: Con npx (Recomendado)

```bash
npx @mammals-at-work/yacs
```

Sin necesidad de instalar nada — se ejecuta directamente.

### Opción 2: Instalar globalmente

```bash
npm install -g @mammals-at-work/yacs
yacs
```

### Opción 3: Desde el repositorio

```bash
git clone https://github.com/munchkin09/YACS.git
cd YACS/cli
npm install
npm start
```

---

Selecciona tu idioma, elige dónde instalar los skills y qué skills quieres. ¡Así de fácil!

### Ejecución de Tests

El CLI incluye un suite de tests completo que valida:
- Funcionalidad del módulo i18n (7 idiomas, traducciones)
- Estructura del directorio de skills
- Validez de archivos de traducción

```bash
cd cli
npm test
```

Resultado esperado: **31 tests pasando** con 100% de éxito.

---

## Estructura

```
skills/
├── quality-and-security/          Auditoría, análisis y mejora de seguridad
├── development/                    Gamificación, deuda técnica, planificación
├── analisis-design-architecture/ ADRs, sparks arquitectónicas, patrones
├── idea-confrontation-and-debate/ Red team, brainstorming, validación de ideas
└── data-and-interpretation/        Data storytelling, debate de datos, trampas métricas
```

---

## Skills por categoría

### 🔒 Calidad y Seguridad

#### `/owasp-guardian`
Audita código en busca de vulnerabilidades OWASP Top 10. Muestra el fragmento exacto, explica el vector de ataque y proporciona la corrección.

```bash
/owasp-guardian src/auth/login.ts
```

#### `/llm-safety-checks`
Audita código, prompts o flujos de agentes en busca de vulnerabilidades específicas de LLMs: prompt injection indirecta, obfuscación de instrucciones, jailbreak, envenenamiento de RAG.

```bash
/llm-safety-checks agent.py
```

#### `/task-flow-planner`
Lee un fichero de tareas (MD o JSON), detecta dependencias y bloqueos, prioriza el trabajo por equipos y genera tabla + diagrama Mermaid para minimizar TTM.

```bash
/task-flow-planner roadmap.md
```

#### `/quality-spark`
Genera una semilla de reflexión sobre calidad de software — de la que tirar del hilo. Sin argumentos, cada invocación te da un ángulo distinto para pensar.

```bash
/quality-spark
```

---

### 💻 development

#### `/gamify`
Diseña una estrategia de gamificación para un proceso interno de empresa. Mapea motivaciones, selecciona mecánicas, diseña progresión y evita anti-patrones.

```bash
/gamify proceso de code review semanal del equipo
```

#### `/tech-debt-hunter`
Identifica y prioriza la deuda técnica. Clasifica por impacto real, estima coste de no actuar, propone acciones mínimas de resolución.

```bash
/tech-debt-hunter src/core/auth/
```

---

### 🏗️ Análisis, Diseño y Arquitectura

#### `/adr-writer`
Genera un Architecture Decision Record (ADR) completo y listo para commitear. A partir de una decisión técnica, produce contexto, decisión, alternativas y consecuencias.

```bash
/adr-writer migrar del monolito a microservicios usando event sourcing
```

#### `/pattern-finder`
Explora patrones de diseño aplicables a un problema concreto. Descompone las fuerzas en juego, identifica candidatos, compara trade-offs y recomienda la mejor solución.

```bash
/pattern-finder tengo un sistema de notificaciones que crece a múltiples canales (email, SMS, push)
```

#### `/architecture-spark`
Genera una reflexión sobre arquitectura que te hace pensar diferente. Cubre diseño emergente vs. planificado, acoplamiento, evolución de sistemas, límites y fronteras.

```bash
/architecture-spark
```

---

### 💡 Debate y Confrontación de Ideas

#### `/red-team`
Actúa como oponente intelectual riguroso. Cuestiona supuestos, genera argumentos contundentes en contra y describe el escenario más probable de fracaso.

```bash
/red-team la idea de cambiar todo a serverless
```

#### `/brainstorm`
Explora el espacio de soluciones desde ángulos radicalmente distintos: inversión del problema, extremos de recursos, cambio de protagonista, anti-soluciones, combinaciones inesperadas.

```bash
/brainstorm cómo mejorar el onboarding de nuevos usuarios
```

---

### 📊 Datos e Interpretación

#### `/data-storyteller`
Interpreta datos y extrae la narrativa real detrás de los números. Identifica anomalías, formula hipótesis causales y comunica con claridad.

```bash
/data-storyteller nuestro NPS subió 12 puntos tras el rediseño
```

#### `/data-debate`
Genera dos interpretaciones completamente opuestas, rigurosas y defendibles del mismo conjunto de datos. Fuerza a ver que casi nunca hay una sola lectura honesta.

```bash
/data-debate [adjunta tus métricas o análisis]
```

#### `/metric-trap`
Desmonta un KPI mostrando formas de gaming, incentivos perversos, sesgos de medición y qué deja fuera. Termina con valoración y recomendación accionable.

```bash
/metric-trap tasa de resolución en primer contacto de soporte
```

---

## Cómo usar

### 1. **Invocación manual**
Escribe `/` seguido del nombre del skill:

```
/red-team mi idea de arquitectura
```

Claude recibe el argumento (todo lo que va después del nombre) como `$ARGUMENTS` dentro del skill.

### 2. **Invocación automática**
Algunos skills se cargan automáticamente cuando es relevante. Por ejemplo, si preguntas sobre deuda técnica, Claude puede invocar `/tech-debt-hunter` sin que lo pidas.

Los skills con `disable-model-invocation: true` solo se invocan manualmente.

### 3. **Mejores prácticas**

- **Da contexto real**: en lugar de "audita este código", pega el código o la ruta del archivo
- **Sé específico**: los skills funcionan mejor con problemas concretos que con preguntas genéricas
- **Tira del hilo**: muchos skills terminan con una pregunta o un espacio abierto — úsalo para profundizar
- **Combina skills**: a menudo un skill te lleva a otro — `/data-storyteller` → `/data-debate` → `/metric-trap`

---

## Estructura de un skill

Cada skill sigue el estándar [Agent Skills](https://agentskills.io) extendido por Claude Code:

```
skill-name/
├── SKILL.md              # Frontmatter YAML + instrucciones de Claude
├── [templates/]          # Opcional: plantillas para completar
├── [examples/]           # Opcional: ejemplos de salida esperada
└── [scripts/]            # Opcional: herramientas ejecutables
```

El archivo `SKILL.md` contiene:

```yaml
---
name: skill-name
description: Qué hace el skill y cuándo usarlo
argument-hint: "[tipo de argumento esperado]"
disable-model-invocation: true  # Solo invocación manual (opcional)
---

[Instrucciones en markdown que Claude sigue cuando invoca el skill]
```

---

## Créditos

Creado con rigor y cuidado. Cada skill fue pensado para:
- ✨ Resolver un problema específico, no genérico
- 🧠 Forzar análisis profundo, no superficial
- 🎯 Ser accionable, no solo inspiracional
- 🔄 Complementarse con otros skills, no estar aislado

**Diseñado para trabajar en equipos reales, con problemas reales.**

---

## Licencia

MIT — úsalo, compartelo, forkéalo, mejoralo.

---

**YACS** — porque a veces lo que necesitas es un skill que sepa realmente qué hacer.
