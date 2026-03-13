# Agentes YACS

Agentes especializados para Claude Code. Cada agente tiene conocimiento profundo del dominio e implementa buenas prácticas dentro de su área.

## ¿Qué son los agentes?

Los agentes son personas expertas persistentes que:
- Aprenden la estructura de tu proyecto en la primera invocación
- Mantienen experiencia en conversaciones dentro de una sesión
- Pueden ser invocados explícitamente o activados automáticamente por Claude Code
- Proporcionan recomendaciones ancladas en tu código real
- Implementan principios y patrones específicos del dominio

A diferencia de las skills (comandos puntuales), los agentes son contextuales y con estado.

## Agentes

### 🏢 Experto Backend (`backend-expert/`)
Se especializa en arquitectura del servidor: APIs, servicios, modelos de datos, autenticación y performance.

**Cuándo usarlo:**
- Revisar diseño de API o contratos de endpoints
- Diseñar esquemas de base de datos o patrones de acceso a datos
- Implementar autenticación, autorización o middleware de seguridad
- Optimizar queries, estrategias de caché o patrones asincronos
- Investigar bugs en servicios o repositorios

**Principios clave:**
- Sin lógica de negocio en controladores; toda la lógica en servicios
- Validación en el límite (validación de entrada antes de servicios)
- Sin queries raw cuando hay ORM disponible
- Secretos nunca hardcodeados; siempre gestionados vía variables de entorno

### 🎨 Experto Frontend (`frontend-expert/`)
Se especializa en UI: componentes, gestión de estado, enrutamiento, estilos, accesibilidad y performance.

**Cuándo usarlo:**
- Diseñar jerarquías de componentes o APIs de props
- Implementar formularios con validación y estados de error
- Configurar gestión de estado (Context, Redux, Zustand, etc.)
- Optimizar performance (lazy loading, memoización, code splitting)
- Asegurar estándares de accesibilidad (a11y)
- Revisar enfoques de estilos y diseño responsivo

**Principios clave:**
- Componentes renderizan UI e manejan interacción; lógica de negocio en hooks/stores
- Sin prop drilling más allá de 2 niveles; usar context o stores en su lugar
- Toda búsqueda de datos requiere estados loading, error y success
- Accesibilidad es innegociable; navegación por teclado y soporte para lectores de pantalla requerido
- Patrones consistentes en toda la base de código

### 🔐 Experto Seguridad (`security-expert/`)
Audita vulnerabilidades, configuraciones erróneas y antipatrones de seguridad en todas las capas.

**Cuándo usarlo:**
- Revisiones de seguridad pre-merge
- Antes de releases o despliegues
- Cuando implementas autenticación, autorización o criptografía
- Revisar dependencias de terceros o cadena de suministro
- Modelado de amenazas antes de una nueva feature
- Investigación de incidentes

**Principios clave:**
- Secretos nunca en código, logs o respuestas de error
- Chequeos de autorización niegan por defecto (deny > allow)
- Toda entrada validada en límites del sistema
- Usa solo criptografía verificada (sin crear tu propia)
- Errores fallan de forma segura sin exponer internals
- Defensa en profundidad: sin punto único de fallo

### ☁️ Experto Infraestructura (`infra-expert/`)
Se especializa en despliegue, CI/CD, contenedorización, IaC, recursos cloud y operaciones.

**Cuándo usarlo:**
- Diseñar o revisar pipelines de CI/CD
- Construir Dockerfiles y setups de compose
- Escribir Terraform, Pulumi u otra IaC
- Configurar manifiestos de Kubernetes
- Configurar observabilidad (logging, métricas, tracing)
- Gestionar configuración de entorno y secretos
- Diseñar para confiabilidad, escalado y recuperación ante desastres

**Principios clave:**
- Secretos gestionados vía secret managers; nunca en imágenes o código
- Infraestructura inmutable: reemplazar en lugar de mutar
- Entornos deben ser reproducibles desde código
- Health checks (liveness y readiness) son obligatorios
- Principio de menor privilegio en IAM, service accounts y políticas de red
- Pipelines fallan rápido: lint y unit tests antes de pasos costosos

### 🧪 Experto QA (`qa-expert/`)
Se especializa en estrategia de testing, análisis de cobertura, calidad de tests e investigación de bugs.

**Cuándo usarlo:**
- Diseñar estrategias de testing (qué testear en cada nivel)
- Analizar gaps de cobertura
- Investigar fallos de tests o flakiness
- Revisar código de tests por calidad y mantenibilidad
- Diseñar tests para una nueva feature
- Analizar causas raíz de bugs reportados

**Principios clave:**
- Tests verifican comportamiento, no detalles de implementación
- Cada test tiene una razón para fallar
- Pirámide de testing: unit >> integration >> E2E
- Mocks para sistemas externos, no tu propio código
- Todo bug arreglado obtiene un test de regresión
- Cobertura es un piso, no una meta (100% tests malos < 80% tests buenos)

## Instalación

### Opción 1: Copiar a tu proyecto

Copia agentes individuales o todos a `.claude/agents/`:

```bash
# Copiar un agente
cp -r YACS/agents/backend-expert ~/.claude/agents/

# Copiar todos los agentes
cp -r YACS/agents/* ~/.claude/agents/
```

### Opción 2: Referenciar desde repositorio YACS

Si tienes YACS clonado localmente, puedes referenciar rutas de agentes directamente en Claude Code sin copiar.

## Usando Agentes

### Invocación explícita

Pídele a Claude Code que use un agente específico:

```
@backend-expert revisa el servicio de usuario por queries N+1
Usa infra-expert para analizar este Dockerfile
security-expert, audita este flujo de autenticación
qa-expert, qué tests faltan para esta feature?
```

### Activación proactiva

Claude Code puede activar automáticamente agentes relevantes basado en contexto. Por ejemplo:
- Preguntar sobre diseño de API puede activar `backend-expert`
- Discutir arquitectura de componentes puede activar `frontend-expert`
- Revisar un archivo de Kubernetes puede activar `infra-expert`
- Una preocupación de seguridad puede activar `security-expert`
- Discutir tests puede activar `qa-expert`

## Estructura del Agente

Cada agente es un único archivo `AGENT.md` con:

```yaml
---
name: <agent-name>
description: <qué activa este agente>
---

## Onboarding
[cómo el agente aprende tu proyecto]

## Expertise
[qué cubre el agente]

## How to respond
[guías de respuesta]

## Principles
[principios específicos del dominio a implementar]
```

El campo `description` le dice a Claude Code cuándo considerar activar el agente.

## Creando Agentes Personalizados

Puedes crear agentes específicos del proyecto en tu directorio `.claude/agents/`. Sigue el mismo formato `AGENT.md`:

1. Crea `~/.claude/agents/<agent-name>/AGENT.md`
2. Usa frontmatter YAML con `name`, `description`
3. Incluye onboarding, expertise, guías de respuesta, y principios
4. Claude Code descubrirá y ofrecerá el agente automáticamente

Ejemplo: Un `database-expert` para tu data layer específica del proyecto, o un `team-conventions-agent` que implemente la guía de estilo de tu equipo.

## Notas

- Todas las definiciones de agentes están en archivos `.md` con frontmatter YAML
- Los agentes son project-aware: leen tu base de código antes de aconsejar
- Cada agente tiene triggers específicos definidos en su `description`
- Los agentes trabajan junto con el razonamiento integrado de Claude Code
- Mezcla agentes de YACS con agentes personalizados específicos del proyecto según sea necesario

---

¿Preguntas o quieres contribuir agentes? Abre un issue o PR en [GitHub](https://github.com/munchkin09/YACS).
