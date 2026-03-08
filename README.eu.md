![](https://boletinstatics.blob.core.windows.net/imagenes/yacs_logo.png)
# YACS — Yet Another Claude Skills Repo

> **Claude Code-rako Skills-en** kolekzio bat, gailua saio batean egin dezakeena zabaltzen duena: segurtasun-auditatzetatik sistemaren diseinua, prozesuak gamifikazioa edo besterik gabe besteen bistaratik pentsatzea.

---

## Zer da hau?

**YACS** Skills-en artxibategi bat da — prompta-oinarrituriko tresnak Claude Code automatikoki deitzen ditu edo zuk manualki `/skill-name-rekin` deitzen dituzu.

Ez dira komando generioak. Skill bakoitza arazo-mota zehatz bati konpondu behar du zorroztasun eta sakontasunarekin:

- **Segurtasun-auditatzeak** benetako bektoreetan bilatzen dutenak
- **Kalitate-hausnarketak** zuri besteren bistaratik pentsarazten dizutenak
- **Datuen analisia** zenbaki berenaren aurreko bi interpretazioak aztertzen dituena
- **Gamifikazio-diseinua** enpresen testuinguruetarako zehatzak
- **Diseinuan patroieei buruako** zure arazo zehatzari aplikaturiko azterketak

---

## Egitura

```
skills/
├── calidad-y-seguridad/          Segurtasun-auditatzea, analisia eta hobekuntza
├── desarrollo/                    Gamifikazioa, deuda teknikoa, plangintza
├── analisis-diseno-y-arquitectura/ ADRak, arkitektura-spark-ak, patroiak
├── debate-y-confrontacion-de-ideas/ Red team-a, ideien hausnarketa, ideien balioztapena
└── datos-e-interpretacion/        Datuen istorioak, datuen eztabaida, metrika-trampa
```

---

## Instalazioa

### Bizkorreko Instalazioa

```bash
cd cli
npm install
npm start
```

Aukeratu zure hizkuntza eta hautatu nahi dituzun skillak!

---

## Instalatzailearen Erabilera

Instalatzaileak onartzen dizute:

1. **Hizkuntzaren Hautaketa** - Aukeratu zure lehenetsitako hizkuntza
2. **Instalazioaren Kokalekua** - `~/.claude/skills`-ra edo nahi duzun bidean instalatu
3. **Skillak Hautatzea** - ↑↓ erabili nabigatzeko, SPACEBAR sakatuz hautatzeko
4. **Ikusketa** - Konfirmatu zure hautaketa instalazioa baino lehen

**Teklatuko Lasterbideak:**
- ↑↓ - Nabigatu
- SPACEBAR - Hautatu/Hautaketa Kendu
- a - Denak Aldatu
- i - Hautaketa Alderantzikatu
- Sartu - Baieztatu

---

## Skillak Kategorienaren Arabera

### 🔒 Kalitatea eta Seguritatea

#### `/owasp-guardian`
OWASP Top 10-eko kalteberritzak bilatzeko kodea auditatzea. Zatiaren zehatz zehaztua erakusten du, erasoaren bektore azaltzen du eta zuzenketa ematen du.

#### `/llm-safety-checks`
LLM-ri espezifikoak diren berritzeak bilatzeko kodea, prompta edo agenteen fluxuak auditatzea: zeharkako prompta-injekzioa, argibideen ofuskatzea, jailbreak-a, RAG-poisoning-a.

#### `/task-flow-planner`
Zeregin-agiri bat irakurtzen du (MD edo JSON), menpekotasunak eta blokeoen detektatzea, lanaren lehentasunak taldeen arabera eta taula + Mermaid diagramaren sorrera.

#### `/quality-spark`
Softwarearen kalitatean hausnartzeko enborra sortu. Argibiderik gabe, ohiturik orotariko angelua ematen du.

---

### 💻 Garaptua

#### `/gamify`
Enpresaren barneko prozesuaren gamifikazio estrategia diseinatu. Motibazioetan mapa, mekanika aukeratu, aurrerapena diseinatu, anti-patroiak saihestea.

#### `/tech-debt-hunter`
Deuda teknikoa identifikatzea eta lehentasunak hartzea. Erreal inpaktuaz sailkatzea, jarduteak estaltzearen kostu estantzea, neurrien arazoen argibideak.

---

### 🏗️ Analisia, Diseinua eta Arkitektura

#### `/adr-writer`
Architecture Decision Record (ADR) osoa eta konprometitua sortua. Keinu teknikoari hasita, testuingurua, argibidea, alternatibak eta ondorioak sortua.

#### `/pattern-finder`
Arazo zehatzerako aplikagarriak diren diseinu patroiak aztertzen dituena. Jokoean dauden indarrak apaltzen dituena, kandidatua identifikatzen dituena, aldaketa aztertzen dituen eta soluzio onena gomendatzen duena.

#### `/architecture-spark`
Arkitektura analisia bizkorra eta diseinu-uskeltasun. Keinu garrantzia, soluzio proposaturak, arrisku agerian.

---

### 🧠 Eztabaida eta Ideien Aurka Jartzea

#### `/red-team`
Aidez-auroko bistaratik idea auzitan jartzea. Ahulak identifikatzea, begian ez dagoena adieraztzea, hipotesiak probatzea.

#### `/brainstorm`
Egituratuturiko ideien hasnarketa, ankoia eta taldearen pentsaera saihesteko prompta-diseinu. Ikuspegi-aldaketaren bidez berri ideiak sortua.

---

### 📊 Datuak eta Interpretazioa

#### `/data-storyteller`
Zenbaki hutsa hitzaldi konbentzitzaileak bihurtzea. Argimena ateratzea, datuak inguruan historias koherenteak eraiki, garrantzia dagoena nabaramena.

#### `/data-debate`
Datu-berdinaren aurreko bi interpretazioak aztertzen dituena. Aurretik zehatza ausarkitik, ezkutuko perspektibak aurkitzea.

#### `/deep-research`
Gaiaren sakontasun gaiaren azterketaren azterketaren azterketaren azterketaren: hutsuneak identifikatzea, hipotesiak auzitan jartzea, sakoneko ulermenerako esparruak proposatzen dituena.

#### `/metric-trap`
Metrika-trapak eta neurketaren arazoak identifikatzea. Nola metrika engandatzailearen, ez-neurtzea, alternatiboen adierazpenetan agerpenean azterketa.

---

## Konfigurazioa

Instalatzaileak zure sistemaren hizkuntza automatikoki detektatzea baina honako hauetariko aukeratzea ahalmen:

- 🇬🇧 English
- 🇪🇸 Español
- 🇨🇦 Català
- 🇪🇺 Euskera
- 🇬🇦 Galego
- 🇦🇳 Andaluz

---

## Oharrak

- Skill guztiek jatorri aldebide-egitura mantentsea
- Skillak berehalako instalazioa ondoren erabiltzeko prest
- Skill bakoitzak SKILL.md-en dokumentazioa barne
- Nahi duzun argibide eta tresnak skill bakoitzekin txertaturik daude

---

## Ekarpenak

Skill berriak gehitzea:

1. `skills/<kategoria>/<skill-izena>/` karpeta sortzea
2. Skill deskribapena `SKILL.md` artxiboan sartzea
3. Behar diren argibideak edo tresnak gehitzea
4. Instalatzaileak automatikoki detektatzea

---

## Lizentziat

MIT
