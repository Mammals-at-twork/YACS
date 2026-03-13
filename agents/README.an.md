# Agentes YACS

Agentes especializaos pa Claude Code. Caá agente tié conosimientu profundu de su dominio e implementa buenya prátigas e su área.

## ¿Qué son los agentes?

Los agentes son personas expertas persistentes que:
- Aprendie la estructura de tu proiecto e la primera invocasión
- Mantiene experiencia e conversaciones dientro de una sesión
- Pueen ser invocaos explícitamente o activaos automáticamente por Claude Code
- Proporcionan recomendaciones anchadas en tu código real
- Implementan principios y patrones específicos del dominio

A diferensia de las skills (comanuos puntuales), los agentes son conscientes del contexto y con estau.

## Agentes

### 🏢 Experto en Backend (`backend-expert/`)
Se espeshializa en arquitektura del serviador: APIs, servishios, modelos de datos, autentifikashión y rendemiento.

**Cuandu usalo:**
- Revisar diseño de API o contratos de endpoints
- Diseñar esquemas de base de datos o patrones de acceso a datos
- Implementar autentifikashión, autorizashión o middleware de seguriau
- Optimizar queries, estratejias de caché o patrones asincronos
- Investigar bugs en servishios o repositorios

**Prinsipios clave:**
- Sin lógica de negosio en kontroladores; toa la lógica en servishios
- Valibashión en el límite (valibashión de entrá antes de servishios)
- Sin queries raw cuando hay ORM disponible
- Secretos nunca hardkodeaos; siempre xestionaos vía variables de entorno

### 🎨 Experto en Frontend (`frontend-expert/`)
Se espeshializa en UI: komponentes, xestión de estau, enrutamiento, estilos, aksesibiliau y rendemiento.

**Cuandu usalo:**
- Diseñar jerarquías de komponentes o APIs de props
- Implementar formularios con valibashión y estados de erro
- Konfigurar xestión de estau (Context, Redux, Zustand, etá.)
- Optimizar el rendemiento (lazy loading, memoizashión, code splitting)
- Asegurar estándares de aksesibiliau (a11y)
- Revisar enfoque de estilos y diseño responsivo

**Prinsipios clave:**
- Los komponentes renderizan UI y manexan la interaksión; lógica de negosio en hooks/stores
- Sin prop drilling máis allá de 2 niveles; usar context o stores en su lugá
- Toa búsquea de datos requiere estados de loading, error y success
- La aksesibiliau es innegoshiable; navegashión por teclau y soporte pa lectoris de pantalla requirío
- Patrones konstantes en toa la base de código

### 🔐 Experto en Seguriau (`security-expert/`)
Audita vulnerabilidades, konfigurashiones inkorrecktas y antipatrones de seguriau en toas las capas.

**Cuandu usalo:**
- Revisiones de seguriau pre-merge
- Antes de releases o deployments
- Cuandu implementar autentifikashión, autorizashión o kriptografía
- Revisar dependenshias de terseros o kadena de subministración
- Modelaje de amenazas antes de una nueya karakterística
- Investigashión de inshidentes

**Prinsipios clave:**
- Secretos nunka en código, logs o respuestas de erro
- Los chequeos de autorizashión niegan por defektu (deny > allow)
- Toa entrá valiá en los límites del sistema
- Usa solo kriptografía verifiká (sin krear la tuya propria)
- Los errores fallen de forma segura sin exponer internals
- Defensa en profundíu: sin punto único de fallo

### ☁️ Experto en Infraestructura (`infra-expert/`)
Se espeshializa en despliegue, CI/CD, kontainerización, IaC, recursos cloud y operashiones.

**Cuandu usalo:**
- Diseñar o revisar pipelines de CI/CD
- Konstruir Dockerfiles y setups de compose
- Escribir Terraform, Pulumi u otra IaC
- Konfigurar manifests de Kubernetes
- Konfigurar observabiliau (logging, métricas, tracing)
- Xestionar konfiguración de entorno y secretos
- Diseñar pa konfiabiliau, eskalabiliau y reuperashión de desastres

**Prinsipios clave:**
- Secretos xestionaos vía secret managers; nunka en imaxenes o código
- Infraestrutura inmutable: sustituir en lugá de mutar
- Los entornos deben ser reprodusibles dende código
- Health checks (liveness y readiness) son obligatorios
- Prinsipiu de menó privilexiu en IAM, kontas de servishiu y políticas de reu
- Los pipelines fallen rápido: lint y tests unitarios antes de pasos kostosos

### 🧪 Experto en QA (`qa-expert/`)
Se espeshializa en estratejia de testing, análisis de kobertura, kaliau de tests e investigashión de bugs.

**Cuandu usalo:**
- Diseñar estratejias de testing (qué testeá en caá nivel)
- Analizar buecos de kobertura
- Investigar fallos de test o flakiness
- Revisar código de test por kaliau y mantenibiliau
- Diseñar tests pa una nueya karakterística
- Analizar causas raíz de bugs reportaos

**Prinsipios clave:**
- Los tests verifikan komportamiento, no detalles de implementashión
- Caá test tié una razón pa fallar
- Pirámide de testing: unit >> integration >> E2E
- Mocks pa sistemas externos, no tu propio código
- Too bug arrangao obtié un test de regreshión
- La kobertura es un piso, no una meta (100% tests malos < 80% tests buenos)

## Instalasiń

### Opshión 1: Kopiar a tu proiecto

Kopie agentes individuales o toos a `.claude/agents/`:

```bash
# Kopiar un agente
cp -r YACS/agents/backend-expert ~/.claude/agents/

# Kopiar toos los agentes
cp -r YACS/agents/* ~/.claude/agents/
```

### Opshión 2: Referenciar dende el repositorio YACS

Si tié YACS klonao lokalmente, puea referenciar caminos de agentes direktamente en Claude Code sin kopiar.

## Usandu Agentes

### Invokashión explíshita

Pídale a Claude Code que use un agente específiko:

```
@backend-expert revisa el servishiu de usuario por queries N+1
Usa infra-expert pa analizar este Dockerfile
security-expert, audita este flujo de autentifikashión
qa-expert, ¿qué tests faltan pa esta karakterística?
```

### Aktivashión proaktiva

Claude Code puea aktivar automáticamente agentes relevantes basaos en el kontexto. Por ejemplo:
- Preguntá sobre diseño de API puea aktivar `backend-expert`
- Diskutir arquitektura de komponentes puea aktivar `frontend-expert`
- Revisar un fichero Kubernetes puea aktivar `infra-expert`
- Una preokupashión de seguriau puea aktivar `security-expert`
- Diskutir tests puea aktivar `qa-expert`

## Estrutura del Agente

Caá agente es un único fichero `AGENT.md` con:

```yaml
---
name: <agent-name>
description: <qué aktivá este agente>
---

## Onboarding
[kómo el agente aprendia tu proiecto]

## Expertise
[qué kubreá el agente]

## How to respond
[direktrises de respuesta]

## Principles
[prinsipios específicos del dominio a implementá]
```

El kampu `description` dile a Claude Code kuandu konsidar aktivá el agente.

## Kreandu Agentes Personalizaos

Puea kreá agentes específicos del proiecto en su direktorio `.claude/agents/`. Siga el mesmo formato `AGENT.md`:

1. Kree `~/.claude/agents/<agent-name>/AGENT.md`
2. Use frontmatter YAML con `name`, `description`
3. Inluya onboarding, expertise, direktrises de respuesta y prinsipios
4. Claude Code destkubrirá y oferecerá el agente automáticamente

Ejemplo: Un `database-expert` pa tu kapa de datos específika del proiecto, o un `team-conventions-agent` que implemente la guía de estilo de tu equipo.

## Notas

- Toas las definishiones de agentes están en ficheros `.md` con frontmatter YAML
- Los agentes son konshientes del proiecto: leen tu base de código antes de akonsehar
- Caá agente tié triggers específikos definios en su `description`
- Los agentes trabajan al lau del razonamiento integrao de Claude Code
- Mesture agentes de YACS con agentes personalizaos específicos del proiecto según seya neséario

---

¿Preguntas o quía kontribuir agentes? Abra una issue o PR en [GitHub](https://github.com/munchkin09/YACS).
