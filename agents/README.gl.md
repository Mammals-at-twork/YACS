# Axentes YACS

Axentes especializados para Claude Code. Cada axente ten coñecemento profundo do seu dominio e implementa boas prácticas na súa área.

## Que son os axentes?

Os axentes son personas expertas persistentes que:
- Aprenden a estrutura do voso proxecto na primeira invocación
- Manteñen experiencia en conversas durante unha sesión
- Poden ser invocados explícitamente ou activados automaticamente por Claude Code
- Proporcionan recomendacións ancoradas no voso código real
- Implementan principios e patróns específicos do dominio

A diferenza das skills (comandos puntuais), os axentes son conscientes do contexto e con estado.

## Axentes

### 🏢 Experto en Backend (`backend-expert/`)
Especialízase en arquitectura do servidor: APIs, servizos, modelos de datos, autenticación e rendemento.

**Cando usalo:**
- Revisar deseño de API ou contratos de endpoints
- Deseñar esquemas de base de datos ou patróns de acceso a datos
- Implementar autenticación, autorización ou middleware de seguridade
- Optimizar queries, estratexias de caché ou patróns asincronos
- Investigar bugs en servizos ou repositorios

**Principios clave:**
- Sen lóxica de negocio en controladores; toda a lóxica en servizos
- Validación no límite (validación de entrada antes de servizos)
- Sen queries raw cando hai ORM dispoñible
- Segredos nunca hardcodeados; sempre xestionados vía variables de entorno

### 🎨 Experto en Frontend (`frontend-expert/`)
Especialízase en UI: componentes, xestión de estado, enrutamento, estilos, accesibilidade e rendemento.

**Cando usalo:**
- Deseñar xerarquías de componentes ou APIs de props
- Implementar formularios con validación e estados de erro
- Configurar xestión de estado (Context, Redux, Zustand, etc.)
- Optimizar o rendemento (lazy loading, memoización, code splitting)
- Asegurar estándares de accesibilidade (a11y)
- Revisar enfoques de estilos e deseño responsivo

**Principios clave:**
- Os componentes renderizan UI e manexan a interacción; lóxica de negocio en hooks/stores
- Sen prop drilling máis alá de 2 niveis; usar context ou stores en su lugar
- Toda busca de datos require estados de loading, error e success
- A accesibilidade é innegociable; navegación por teclado e soporte para lectores de pantalla requirido
- Patróns consistentes en toda a base de código

### 🔐 Experto en Seguridade (`security-expert/`)
Audita vulnerabilidades, configuracións incorrectas e antipatróns de seguridade en tódalas capas.

**Cando usalo:**
- Revisións de seguridade pre-merge
- Antes de releases ou deployments
- Cando implementar autenticación, autorización ou criptografía
- Revisar dependencias de terceros ou cadea de subministración
- Modelaxe de ameazas antes dunha nova característica
- Investigación de incidentes

**Principios clave:**
- Segredos nunca en código, logs ou respostas de erro
- Os chequeos de autorización denegan por defecto (deny > allow)
- Toda entrada validada nos límites do sistema
- Usa só criptografía verificada (sen crear a vostra propia)
- Os erros fallan de forma segura sen expor internals
- Defensa en profundidade: sen punto único de fallo

### ☁️ Experto en Infraestrutura (`infra-expert/`)
Especialízase en despliegue, CI/CD, containerización, IaC, recursos cloud e operacións.

**Cando usalo:**
- Deseñar ou revisar pipelines de CI/CD
- Construir Dockerfiles e setups de compose
- Escribir Terraform, Pulumi ou outra IaC
- Configurar manifests de Kubernetes
- Configurar observabilidade (logging, métricas, tracing)
- Xestionar configuración de entorno e segredos
- Deseñar para confiabilidade, escalabilidade e recuperación de desastres

**Principios clave:**
- Segredos xestionados vía secret managers; nunca en imaxes ou código
- Infraestrutura inmutable: substituír en lugar de mutar
- Os entornos deben ser reproducibles dende código
- Health checks (liveness e readiness) son obrigatorios
- Principio de menor privilexio en IAM, contas de servizo e políticas de rede
- Os pipelines fallan rápido: lint e tests unitarios antes de pasos custosos

### 🧪 Experto en QA (`qa-expert/`)
Especialízase en estratexia de testing, análise de cobertura, calidade de tests e investigación de bugs.

**Cando usalo:**
- Deseñar estratexias de testing (que testar en cada nivel)
- Analizar buracos de cobertura
- Investigar fallos de test ou flakiness
- Revisar código de test por calidade e mantenibilidade
- Deseñar tests para unha nova característica
- Analizar causas raíz de bugs reportados

**Principios clave:**
- Os tests verifican comportamento, non detalles de implementación
- Cada test ten unha razón para fallar
- Pirámide de testing: unit >> integration >> E2E
- Mocks para sistemas externos, non o voso propio código
- Todo bug arranxado obtén un test de regresión
- A cobertura é un piso, non unha meta (100% tests malos < 80% tests bos)

## Instalación

### Opción 1: Copiar ao voso proxecto

Copie axentes individuais ou todos a `.claude/agents/`:

```bash
# Copiar un axente
cp -r YACS/agents/backend-expert ~/.claude/agents/

# Copiar todos os axentes
cp -r YACS/agents/* ~/.claude/agents/
```

### Opción 2: Referenciar dende o repositorio YACS

Se ten YACS clonado localmente, pode referenciar caminos de axentes directamente en Claude Code sen copiar.

## Usando Axentes

### Invocación explícita

Pídale a Claude Code que use un axente específico:

```
@backend-expert revisa o servizo de usuario por queries N+1
Usa infra-expert para analizar este Dockerfile
security-expert, audita este fluxo de autenticación
qa-expert, que tests faltan para esta característica?
```

### Activación proactiva

Claude Code pode activar automaticamente axentes relevantes baseados no contexto. Por exemplo:
- Preguntar sobre deseño de API pode activar `backend-expert`
- Discutir arquitectura de componentes pode activar `frontend-expert`
- Revisar un ficheiro Kubernetes pode activar `infra-expert`
- Unha preocupación de seguridade pode activar `security-expert`
- Discutir tests pode activar `qa-expert`

## Estrutura do Axente

Cada axente é un único ficheiro `AGENT.md` con:

```yaml
---
name: <agent-name>
description: <que activa este axente>
---

## Onboarding
[como o axente aprende o voso proxecto]

## Expertise
[que cobre o axente]

## How to respond
[directrices de resposta]

## Principles
[principios específicos do dominio a implementar]
```

O campo `description` dille a Claude Code cando considerar activar o axente.

## Creando Axentes Personalizados

Pode crear axentes específicos do proxecto no seu directorio `.claude/agents/`. Siga o mesmo formato `AGENT.md`:

1. Cree `~/.claude/agents/<agent-name>/AGENT.md`
2. Use frontmatter YAML con `name`, `description`
3. Inclúa onboarding, expertise, directrices de resposta e principios
4. Claude Code descobrirá e ofrecerá o axente automaticamente

Exemplo: Un `database-expert` para a súa capa de datos específica do proxecto, ou un `team-conventions-agent` que implemente a guía de estilo do seu equipo.

## Notas

- Todas as definicións de axentes están en ficheiros `.md` con frontmatter YAML
- Os axentes son conscientes do proxecto: len a súa base de código antes de aconsellar
- Cada axente ten triggers específicos definidos na súa `description`
- Os axentes traballan ao lado do razoamento integrado de Claude Code
- Mesture axentes de YACS con axentes personalizados específicos do proxecto segundo sexa necesario

---

Preguntas ou quere contribuír axentes? Abra unha issue ou PR en [GitHub](https://github.com/munchkin09/YACS).
