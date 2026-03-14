![](https://boletinstatics.blob.core.windows.net/imagenes/yacs_logo.png)
# YACS — Yet Another Claude Skills Repo

> Una colesión distinta de **Skills pa Claude Code** que amplían lo que pueh har en ca' sesión: desde auditories de segurihá até disenyo de sistemas, gamificación de proseos o simplemente pensá e otra mane'a.

---

## ¿Ké es esto?

**YACS** es un repositorio de Skills — ferramientas basaítas en prompts que Claude Code invoca automáticamente cuando es relevante, o tú invokas manualmente con `/skill-name`.

No son komantos xenéricos. Kah skill está diseñao pa resolverá un tipo de problema espesfiko con rigor i profundihá:

- **Auditories de segurihá** que buskan los bektores reales, no solo las obbiehases
- **Reflexiones sobre kalihá** que te hahen pensá e otra mane'a
- **Analisis de datos** que explora dos interpretasiones opuestas del mesmo número
- **Disenyo de gamifikasión** espesfiko pa kontekstos korporatibos
- **Explorasión de patrones** de disenyo aplikaos a tu problema konkreto

---

## Struktura

```
skills/
├── quality-and-security/          Auditoria, analisis i mejora de segurihá
├── development/                    Gamifikasión, deua teknika, planifikasión
├── analisis-design-architecture/ ADRs, sparks arquitektoniks, patrones
├── idea-confrontation-and-debate/ Red team, brainstorming, balihásion de ideas
└── data-and-interpretation/        Data storytelling, debah de datos, trampas metriks
```

---

## Instalisión

### Opsiòn 1: Con npx (Recomendau)

```bash
npx @mammals-at-work/yacs
```

Sin nesesidat de instalar nada — se exekuta direkhtamente.

### Opsiòn 2: Instalar globalmente

```bash
npm install -g @mammals-at-work/yacs
yacs
```

### Opsiòn 3: Desde el repositorio

```bash
git clone https://github.com/munchkin09/YACS.git
cd YACS/cli
npm install
npm start
```

---

¡Elige tu idioma i selesiona ke skills quieres instalar!

---

## Uso del Instalador

El instalador te guía a través de:

1. **Selesión de Idioma** - Elige tu idioma preferío
2. **Ubicasión de la Instalisión** - Instala en `~/.claude/skills` o en una ruta personalisá
3. **Selesión de Skills** - Usa ↑↓ pa navegá, ESPASIO pa seleksioná
4. **Rebisión** - Kofirma tu selesión antes de la instalisión

**Atajos de Teklao:**
- ↑↓ - Navegá
- ESPASIO - Selekkioná/Deselesioná
- a - Alterna toos
- i - Inbierte selesión
- Intrao - Kofirmá

---

## Skills por Kategoría

### 🔒 Kalihá i Segurihá

#### `/owasp-guardian`
Audita kóigo en busca de bulnerabiliahes OWASP Top 10. Muestra el fragmento eksahto, explika el bektó e atake i proporkiona la korecsión.

#### `/llm-safety-checks`
Audita kóigo, prompts o flujos de axentes en busca de bulnerabiliahes espesfikes de LLM: inyeksión indireckta de prompts, obfuskasión de instrucsiones, jailbreak, enbenenamiento de RAG.

#### `/task-flow-planner`
Lee un fichero de tareas (MD o JSON), detekta dependensias i blokeos, priorita el trabao po equipos i xenera tabla + diagrama Mermaid.

#### `/quality-spark`
Xenera una simiya de refleksión sobre la kalihá del softwé — algo pa tiá del hilo. Sin argumentos, kah inbokasión te da un ángulo distinto.

---

### 💻 development

#### `/gamify`
Disena una estratexia de gamifikasión pa un proseso interno de la empresa. Mapea motibásiones, selekkiona mekanicas, disena progresión i ebita anti-patrones.

#### `/tech-debt-hunter`
Identifika i priorita la deua teknika. Klasifika po impakto real, estima el koste de no aktuá, propone aksiones minimas de resolusión.

---

### 🏗️ Analisis, Disenyo i Arquitektura

#### `/adr-writer`
Xenera un Architecture Decision Record (ADR) kompleto i listo pa komieteaá. A partir de una desisión teknika, produse konteksto, desisión, alternativas i konsekuensias.

#### `/pattern-finder`
Explora patrones de disenyo aplikables a un problema konkreto. Dekompon las fuersas en xuego, identifika kandidatos, kompara kompromiso i rekomenda la mejó solución.

#### `/architecture-spark`
Analisis arquitektonika rápía i pensamiento de disenyo. Identifika desisiones klabe, propone soluksiones, destaka riesgos.

---

### 🧠 Debah i Konfrontasión de Ideas

#### `/red-team`
Desafia una idea dese una perspektiba aiderbersarial. Identifika debiliahes, apunta puntos kieg, prueba supuestos.

#### `/brainstorm`
Brainstorming struktuao kon prompts diseñaos pa ebitá sesgo e anklahe i pensamiento de grupo. Xenera ideas novas po kambio e perspektiba.

---

### 📊 Datos i Interpretasión

#### `/data-storyteller`
Konbiete números krudos en narratibas konbinsentes. Extrae insights, konstruye historias koherentessarredor e los datos, destaka lo ke importa.

#### `/data-debate`
Explora dos interpretasiones opuestas e los mismos datos. Desafia la narratiba predeterminá, deeskubre perspektibas akultás.

#### `/deep-research`
Explorasión ekshastiba e un tema. Identifika basios, desafia supuestos, propone markos pa una komprehensión mas profunda.

#### `/metric-trap`
Identifika trampas de metriks i frakásos de meihura. Explora komo las metriks pueden enganya, lo ke no miden, indikadores alternábos.

---

## Konfiggurásión

El instalador detekta automátikamente tu idioma del sistema pero te permite selekkioná entre:

- 🇬🇧 English
- 🇪🇸 Español
- 🇨🇦 Català
- 🇪🇺 Euskera
- 🇬🇦 Galego
- 🇦🇳 Andaluz

---

## Notas

- Toos los skills mantienen la struktura de karpetas orixinal
- Los skills estan listos pa usá inmediatamente depois de la instalisión
- Kah skill inkluye dokumentasión en SKILL.md
- Los scripts personalisaos i ferramientas se inkluen kon kah skill

---

## Kontribuí

Pa agaña nuevos skills:

1. Krea una karpeta en `skills/<kategoría>/<skill-nombre>/`
2. Inklarí un fichero `SKILL.md` kon la deskripsión del skill
3. Anega toos los scripts o ferramientas nesarios
4. El instalador lo detektará automátikamente

---

## Lisensya

MIT
