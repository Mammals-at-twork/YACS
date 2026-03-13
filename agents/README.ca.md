# Agents YACS

Agents especialitzats per a Claude Code. Cada agent té un coneixement profund del seu domini i implementa bones pràctiques dins de la seva àrea.

## Què són els agents?

Els agents són personas expertes persistents que:
- Aprenen l'estructura del vostre projecte en la primera invocació
- Mantenen la seva expertesa durant conversations dins d'una sessió
- Poden ser invocats explícitament o activats automàticament per Claude Code
- Proporcionen recomanacions ancorades al vostre codi real
- Implementen principis i patrons específics del domini

A diferència de les skills (comandos puntuals), els agents són conscients del context i amb estat.

## Agents

### 🏢 Expert en Backend (`backend-expert/`)
S'especialitza en arquitectura del servidor: APIs, serveis, models de dades, autenticació i rendiment.

**Quan usar-lo:**
- Revisar el disseny d'API o els contractes d'endpoints
- Dissenyar esquemes de base de dades o patrons d'accés a dades
- Implementar autenticació, autorització o middleware de seguretat
- Optimitzar queries, estratègies de caché o patrons asincronats
- Investigar bugs en serveis o repositoris

**Principis clau:**
- Cap lògica de negoci en controladors; tota la lògica en serveis
- Validació en el límit (validació d'entrada abans de serveis)
- Cap query raw quan hi ha ORM disponible
- Secrets mai hardcodeados; sempre gestionats per variables d'entorn

### 🎨 Expert en Frontend (`frontend-expert/`)
S'especialitza en UI: components, gestió d'estat, enrutament, estils, accessibilitat i rendiment.

**Quan usar-lo:**
- Dissenyar jerarquies de components o APIs de props
- Implementar formularis amb validació i estats d'error
- Configurar gestió d'estat (Context, Redux, Zustand, etc.)
- Optimitzar el rendiment (lazy loading, memoització, code splitting)
- Assegurar estàndards d'accessibilitat (a11y)
- Revisar enfocaments d'estils i disseny responsiu

**Principis clau:**
- Els components renderizan UI i gestionen la interacció; la lògica de negoci està en hooks/stores
- Cap prop drilling més allà de 2 nivells; usar context o stores en lloc d'això
- Tota cerca de dades requereix estats de loading, error i success
- L'accessibilitat és innegociable; navegació per teclat i suport per lectors de pantalla requerits
- Patrons consistents en tota la base de codi

### 🔐 Expert en Seguretat (`security-expert/`)
Audita vulnerabilitats, configuracions incorrectes i antipatrons de seguretat a totes les capes.

**Quan usar-lo:**
- Revisions de seguretat pre-merge
- Abans de releases o deployments
- Quan implementar autenticació, autorització o criptografia
- Revisar dependències de tercers o cadena de subministrament
- Modelat de amenaces abans d'una nova característica
- Investigació d'incidents

**Principis clau:**
- Secrets mai en codi, logs o respostes d'error
- Les verificacions d'autorització denyen per defecte (deny > allow)
- Tota entrada validada als límits del sistema
- Usa només criptografia verificada (sense crear la vostra pròpia)
- Els errors fallen de forma segura sense exposar internals
- Defensa en profunditat: cap punt únic de fallada

### ☁️ Expert en Infraestructura (`infra-expert/`)
S'especialitza en desplegament, CI/CD, containerització, IaC, recursos cloud i operacions.

**Quan usar-lo:**
- Dissenyar o revisar pipelines de CI/CD
- Construir Dockerfiles i setups de compose
- Escriure Terraform, Pulumi o altre IaC
- Configurar manifests de Kubernetes
- Configurar observabilitat (logging, mètriques, tracing)
- Gestionar configuració d'entorn i secrets
- Dissenyar per a confiabilitat, escalabilitat i recuperació de desastres

**Principis clau:**
- Secrets gestionats via secret managers; mai en imatges o codi
- Infraestructura immutable: reemplaçar en lloc de mutar
- Els entorns han de ser reproducibles a partir de codi
- Health checks (liveness i readiness) són obligatoris
- Principi de menor privilegi en IAM, comptes de servei i polítiques de xarxa
- Els pipelines fallen ràpidament: lint i tests unitaris abans de pasos costosos

### 🧪 Expert en QA (`qa-expert/`)
S'especialitza en estratègia de testing, anàlisi de cobertura, qualitat de tests i investigació de bugs.

**Quan usar-lo:**
- Dissenyar estratègies de testing (què testejar en cada nivell)
- Analitzar buits de cobertura
- Investigar falles de test o flakiness
- Revisar codi de test per qualitat i mantenibilitat
- Dissenyar tests per a una nova característica
- Analitzar causes arrel de bugs reportats

**Principis clau:**
- Els tests verifiquen comportament, no detalls d'implementació
- Cada test té una raó per fallar
- Piràmide de testing: unit >> integration >> E2E
- Mocks per a sistemes externs, no el vostre propi codi
- Tot bug arreglat obté un test de regressió
- La cobertura és un pis, no una meta (100% tests dolents < 80% tests bons)

## Instal·lació

### Opció 1: Copiar al vostre projecte

Copieu agents individuals o tots a `.claude/agents/`:

```bash
# Copiar un agent
cp -r YACS/agents/backend-expert ~/.claude/agents/

# Copiar tots els agents
cp -r YACS/agents/* ~/.claude/agents/
```

### Opció 2: Referenciar des del repositori YACS

Si teniu YACS clonat localment, podeu referenciar camins d'agents directament a Claude Code sense copiar.

## Usant Agents

### Invocació explícita

Demaneu a Claude Code que usi un agent específic:

```
@backend-expert revisa el servei d'usuari per queries N+1
Usa infra-expert per analitzar aquest Dockerfile
security-expert, audita aquest flux d'autenticació
qa-expert, quins tests falten per a aquesta característica?
```

### Activació proactiva

Claude Code pot activar automàticament agents rellevants basats en el context. Per exemple:
- Preguntar sobre disseny d'API pot activar `backend-expert`
- Discutir arquitectura de components pot activar `frontend-expert`
- Revisar un fitxer Kubernetes pot activar `infra-expert`
- Una preocupació de seguretat pot activar `security-expert`
- Discutir tests pot activar `qa-expert`

## Estructura del Agent

Cada agent és un únic fitxer `AGENT.md` amb:

```yaml
---
name: <agent-name>
description: <què activa aquest agent>
---

## Onboarding
[com l'agent aprèn el vostre projecte]

## Expertise
[què cobreix l'agent]

## How to respond
[directrius de resposta]

## Principles
[principis específics del domini a implementar]
```

El camp `description` diu a Claude Code quan considerar activar l'agent.

## Creant Agents Personalitzats

Podeu crear agents específics del projecte al vostre directori `.claude/agents/`. Seguiu el mateix format `AGENT.md`:

1. Creeu `~/.claude/agents/<agent-name>/AGENT.md`
2. Useu frontmatter YAML amb `name`, `description`
3. Incloeu onboarding, expertise, directrius de resposta i principis
4. Claude Code descobrirà i oferirà l'agent automàticament

Exemple: Un `database-expert` per a la vostra capa de dades específica del projecte, o un `team-conventions-agent` que implementi la guia d'estil del vostre equip.

## Notes

- Totes les definicions d'agents estan en fitxers `.md` amb frontmatter YAML
- Els agents són conscients del projecte: llegeixen la vostra base de codi abans de aconsellar
- Cada agent té triggers específics definits en la seva `description`
- Els agents treballen juntament amb el raonament integrat de Claude Code
- Barrejeu agents de YACS amb agents personalitzats específics del projecte segons sigui necessari

---

Preguntes o voleu contribuir agents? Obriu una issue o PR a [GitHub](https://github.com/munchkin09/YACS).
