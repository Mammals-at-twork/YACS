![](https://boletinstatics.blob.core.windows.net/imagenes/yacs_logo.png)
# YACS — Yet Another Claude Skills Repo

> Una col·lecció diferent de **Skills per a Claude Code** que amplien el que pots fer en cada sessió: des d'auditories de seguretat fins a disseny de sistemes, gamificació de processos o simplement pensar diferent.

---

## Què és això?

**YACS** és un repositori de Skills — eines basades en prompts que Claude Code invoca automàticament quan és rellevant, o que tu invokes manualment amb `/skill-name`.

No són comandaments genèrics. Cada skill està dissenyat per resoldre un tipus de problema específic amb rigor i profunditat:

- **Auditories de seguretat** que busquen els vectors reals, no només les obvietats
- **Reflexions sobre qualitat** que et fan pensar diferent
- **Anàlisi de dades** que explora dues interpretacions oposades del mateix número
- **Disseny de gamificació** específic per a contextos corporatius
- **Exploració de patrons** de disseny aplicats al teu problema concret

---

## Estructura

```
skills/
├── quality-and-security/          Auditoria, anàlisi i millora de seguretat
├── development/                    Gamificació, deute tècnic, planificació
├── analisis-design-architecture/ ADRs, sparks arquitectònics, patrons
├── idea-confrontation-and-debate/ Red team, brainstorming, validació d'idees
└── data-and-interpretation/        Data storytelling, debat de dades, trampes mètriques
```

---

## Instal·lació

### Opció 1: Amb npx (Recomanat)

```bash
npx @mammals-at-work/yacs
```

Sense necessitat d'instal·lar res — s'executa directament.

### Opció 2: Instal·lar globalment

```bash
npm install -g @mammals-at-work/yacs
yacs
```

### Opció 3: Des del repositori

```bash
git clone https://github.com/munchkin09/YACS.git
cd YACS/cli
npm install
npm start
```

---

Tria el teu idioma i selecciona quins skills vols instal·lar!

---

## Ús de l'instal·lador

L'instal·lador et guia a través de:

1. **Selecció d'idioma** - Tria el teu idioma preferit
2. **Ubicació de la instal·lació** - Instal·la a `~/.claude/skills` o en una ruta personalitzada
3. **Selecció de skills** - Usa ↑↓ per navegar, ESPAI per seleccionar
4. **Revisió** - Confirma la teva selecció abans de la instal·lació

**Dreceres de teclat:**
- ↑↓ - Navegar
- ESPAI - Seleccionar/Deseleccionar
- a - Alternar tots
- i - Invertir selecció
- Retorn - Confirmar

---

## Skills per categoria

### 🔒 Qualitat i Seguretat

#### `/owasp-guardian`
Audita codi en busca de vulnerabilitats OWASP Top 10. Mostra el fragment exacte, explica el vector d'atac i proporciona la correcció.

#### `/llm-safety-checks`
Audita codi, prompts o fluxos d'agents en busca de vulnerabilitats específiques d'LLM: injecció indirecta de prompts, ofuscació d'instruccions, jailbreak, envenenament de RAG.

#### `/task-flow-planner`
Llegeix un fitxer de tasques (MD o JSON), detecta dependències i bloquigs, prioritza el treball per equips i genera taula + diagrama Mermaid.

#### `/quality-spark`
Genera una llavor de reflexió sobre la qualitat del software — una cosa per agafar fil. Sense arguments, cada invocació et dona un angle diferent.

---

### 💻 Desenvolupament

#### `/gamify`
Dissenya una estratègia de gamificació per a un procés intern de l'empresa. Mapa motivacions, selecciona mecàniques, dissenya progressió i evita antipatrons.

#### `/tech-debt-hunter`
Identifica i prioritza la deuta tècnica. Classifica per impacte real, estima el cost de no actuar, proposa accions mínimes de resolució.

---

### 🏗️ Anàlisi, Disseny i Arquitectura

#### `/adr-writer`
Genera un Architecture Decision Record (ADR) complet i llest per committejar. A partir d'una decisió tècnica, produeix context, decisió, alternatives i conseqüències.

#### `/pattern-finder`
Explora patrons de disseny aplicables a un problema concret. Descompon les forces en joc, identifica candidats, compara compromisos i recomana la millor solució.

#### `/architecture-spark`
Anàlisi arquitectònica ràpida i pensament de disseny. Identifica decisions clau, proposa solucions, destaca riscos.

---

### 🧠 Debat i Confrontació d'Idees

#### `/red-team`
Desafia una idea des d'una perspectiva adversarial. Identifica debilitats, apunta punts cecs, prova supòsits.

#### `/brainstorm`
Brainstorming estructurat amb prompts dissenyats per evitar biaix d'ancoratge i pensament de grup. Genera idees noves per canvi de perspectiva.

---

### 📊 Dades i Interpretació

#### `/data-storyteller`
Converteix números crus en narratives convincents. Extreu insights, construeix històries coherents al voltant de les dades, destaca el que importa.

#### `/data-debate`
Explora dues interpretacions oposades de les mateixes dades. Desafia la narrativa predeterminada, descobreix perspectives amagades.

#### `/deep-research`
Exploració exhaustiva d'un tema. Identifica buits, desafia supòsits, proposa marcs per a una comprensió més profunda.

#### `/metric-trap`
Identifica trampes de mètriques i fracassos de mesura. Explora com les mètriques poden enganyar, el que no mesuren, indicadors alternatius.

---

## Configuració

L'instal·lador detecta automàticament l'idioma del teu sistema però et permet triar entre:

- 🇬🇧 English
- 🇪🇸 Español
- 🇨🇦 Català
- 🇪🇺 Euskera
- 🇬🇦 Galego
- 🇦🇳 Andaluz

---

## Notes

- Tots els skills mantenen l'estructura de carpetes original
- Els skills estan llests per usar immediatament després de la instal·lació
- Cada skill inclou documentació a SKILL.md
- Els scripts personalitzats i les eines s'inclouen amb cada skill

---

## Contribució

Per afegir nous skills:

1. Crea una carpeta a `skills/<category>/<skill-name>/`
2. Inclou un fitxer `SKILL.md` amb la descripció de l'skill
3. Afegeix tots els scripts o eines necessaris
4. L'instal·lador el detectarà automàticament

---

## Llicència

MIT
