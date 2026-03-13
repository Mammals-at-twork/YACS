# YACS Agenteak

Claude Code-rentzako espezializatutako agenteak. Agente bakoitzak bere dominioan sakoneko ezagutza du eta dominioan aritzeko praktika egokiak inplementatzen ditu.

## Zer dira agenteak?

Agenteak pertsona aditu iraunkorrak dira, hauek dituztenak:
- Lehen invokakzioan zure proiektuaren egitura ikasten dute
- Sesio batean zehar aditutza mantentzen dute
- Esplizituki invoka daitezke edo Claude Code-k modu proaktiboan aktibatu daitezke
- Zure benetako kodean oinarritutako gomendioak ematen dituzte
- Dominioarekiko espezifikoak diren printzipiak eta patronak inplementatzen dituzte

Skillak (puntu-komandoak) ez bezala, agenteak kontestua jabeak dira eta egoerarekin bizi.

## Agenteak

### 🏢 Backend Aditua (`backend-expert/`)
Zerbitzariaren arkitekturetan espezializatzen da: APIak, zerbitzuak, datu-ereduak, autentifikazioa eta performantzia.

**Noiz erabili:**
- API diseinua edo endpoint kontratua berrikustea
- Datu-basearen eskemat edo datu-access patternetan diseinatzea
- Autentifikazioa, autorizazioa edo seguritate middleware inplementatzea
- Queries, cache estrategiak edo asinkrono patternetan optimizatzea
- Zerbitzuetan edo repositorietan erroreak ikertzea

**Printzipioetakoak:**
- Kontroladoreetan ez dago negozioaren logika; logika osoa zerbitzuetan
- Balioztatzea mugan (zerbitzuetan aurreko sarrera balioztatzea)
- Ez raw queries ORM dagoela
- Sekretuak inoiz hardkodeatuta ez; beti ingurumen aldagaien bidez kudeatuak

### 🎨 Frontend Aditua (`frontend-expert/`)
UIan espezializatzen da: osagaietan, egoera kudeaketan, enrutamenduan, estiloan, irisgarritasunean eta performantzia.

**Noiz erabili:**
- Osagaien hierarkiak edo props APIak diseinatzea
- Balioztazio eta errore egoerekin formularioak inplementatzea
- Egoera kudeaketa konfiguratzea (Context, Redux, Zustand, etab.)
- Performantzia optimizatzea (lazy loading, memoizazioa, code splitting)
- Irisgarritasun (a11y) estandarrak ziurtatzea
- Estilo enfokeetan eta responsive diseinuan berrikustea

**Printzipioetakoak:**
- Osagaiek UI renderizan eta elkarrekintza kudeitzen dute; negozioaren logika hooks/storeetan
- Ez prop drilling 2 maila baino gehiago; context edo stores erabili
- Datu-bilaketa guztiek loading, error eta success egoerak behar dituzte
- Irisgarritasuna negozio-ez-dira; teklatu-nabigazioa eta pantaila-irakurleen laguntza beharrezko
- Pattern koherenteak kode-basearen osoan

### 🔐 Seguritate Aditua (`security-expert/`)
Kaltegarritasunak, konfigurazio-okerraketak eta seguritate anti-patterneak auditatzeak geruza guztian.

**Noiz erabili:**
- Seguritate berrikustaoak merge aurrean
- Releaseak edo deploymenteak aurrean
- Autentifikazioa, autorizazioa edo kriptografia inplementatzean
- Hirugarren parteen mendekotasunak edo horniketa katean berrikustea
- Mehatxu modelaketa negoziaren aurrean
- Incidenten ikertzea

**Printzipioetakoak:**
- Sekretuak inoiz kodean, logetan edo errore erantzunetan ez
- Autorizazio txekeak deutsik defektuan (deny > allow)
- Sarrera guztia sistemaren mugan balioztatzea
- Soilik egiaztatu kriptografiaz erabili (berea sortzea ez)
- Erroreak modu seguruan huts egin, internals ez eksposatuak
- Sakonean defensa: ez puntu bakarrean hutsegitea

### ☁️ Infraestrutura Aditua (`infra-expert/`)
Deploymentean, CI/CDan, containerizazioan, IaCan, cloud baliabideetan eta operazioetan espezializatzen da.

**Noiz erabili:**
- CI/CD pipelineak diseinatu edo berrikustea
- Dockerfileak eta compose setupak eraikitzea
- Terraform, Pulumi edo beste IaC idaztea
- Kubernetes manifestuak konfiguratzea
- Behangarritasuna konfiguratzea (logging, metrikak, tracing)
- Ingurumen konfigurazioa eta sekretuak kudeatzea
- Fidagarritasunarentzat, eskalagarritasunarentzat eta desastre-berreskurapen diseinatzea

**Printzipioetakoak:**
- Sekretuak secret managerren bidez kudeatuak; inoiz iruditan edo kodean ez
- Infraestrutura aldagaitza: aldatzea hartu arte
- Ingurumeak kodean sortzutik berrekugarriak izan behar dira
- Health chekeak (liveness eta readiness) derrigorrezkoak dira
- Herentzui eta sarean gutxiengo-pribilegioaren printzipioa
- Pipelineak azkar huts egin: lint eta unitate-proben aurrean gastu handia duten pausoen

### 🧪 QA Aditua (`qa-expert/`)
Testeo estrategian, behargatze analisian, testeo kalitatea eta error ikertzean espezializatzen da.

**Noiz erabili:**
- Testeo estrategiak diseinatzea (zer testetzea maila bakoitzean)
- Behargatze hutsuneak analizatzea
- Testeo husteek edo flakinesak ikertzea
- Testeo kodea kalitate eta mantengarritasunean berrikustea
- Negozio berriarentzat testeak diseinatzea
- Igorritako erroreen sukar-arrazoia analizatzea

**Printzipioetakoak:**
- Probek portaera egiaztatzuak, inplementazio-xehetasunak ez
- Testeo bakotxak huts egiteko arrazoi bat du
- Testeo piramidea: unit >> integration >> E2E
- Kanpoko sistemen Mockak, zure propio kodea ez
- Zuzendu errore guztiek regresio-proba bat lortzen dute
- Behargatze horma da, ez helburua (100% testeo txarrak < 80% testeo onak)

## Instalazioa

### Aukera 1: Zure proiektuari kopiatuz

Agente bakozkotak edo denentzako `.claude/agents/` kopiatu:

```bash
# Agente bat kopiatuz
cp -r YACS/agents/backend-expert ~/.claude/agents/

# Denentzako kopiatuz
cp -r YACS/agents/* ~/.claude/agents/
```

### Aukera 2: YACS biltegia dendarik erreferentziatzea

YACS lokalean klonatzuta baduzu, agenteen bideak zuzenean Claude Codean erreferentziatu ditzakezu kopiatuz.

## Agenteak Erabiliz

### Esplizitu agintzea

Claude Code-ri agente zehaztua erabiltzeko eskatu:

```
@backend-expert erabiltzaile zerbitzua N+1 kontsultetan berrikus
infra-expert erabili Dockerfile hau analizatzen
security-expert, autentifikazio fluxua auditatu
qa-expert, zer proba falta dira negozio honetarako?
```

### Proaktibo aktibazioa

Claude Codek automatikoki errelebantea den agenteak aktibatu ditzake kontestuan oinarrituz. Adibidez:
- APIa diseinuaz galdetzeak `backend-expert` trigerra dezake
- Osagai arkitekturan eztabaida `frontend-expert` trigerra dezake
- Kubernetes fitxategi bat berrikusteak `infra-expert` trigerra dezake
- Seguritate kezka `security-expert` trigerra dezake
- Proben eztabaidak `qa-expert` trigerra dezake

## Agente Egitura

Agente bakotxa `AGENT.md` fitxategi bakarrean duen honakobarekin:

```yaml
---
name: <agent-name>
description: <agente hau trigerra dezakena>
---

## Onboarding
[agenteak zure proiektua nola ikasten duen]

## Expertise
[agenteak zer estaltzen duen]

## How to respond
[erantzun gidalerroak]

## Principles
[inplementatzeko dominioarekiko espezifikoak printzipiak]
```

`description` eremuak Claude Code-ri agentea aktibatzea kontuan hartzea esaten dio.

## Norbere Agenteak Sortuz

Zure `.claude/agents/` direktorioan proiektu-spezifikoak agenteak sortaraz ditzakezu. Berdina `AGENT.md` formatua jarraitu:

1. `~/.claude/agents/<agent-name>/AGENT.md` sortu
2. `name`, `description` YAML frontmatterri erabili
3. Onboarding, expertise, erantzun gidelarruak eta printzipiak sartu
4. Claude Codek agentea automatikoki aurkitu eta ofertatuko du

Adibidez: `database-expert` zure proiektu-spezifikoa datu-geruza, edo `team-conventions-agent` zure taldeak estilo gidalerroa inplementatzen duena.

## Oharrak

- Agente definizioak `.md` fitxategi YAML fronmatterrekin daude
- Agenteak proiektu-jabeak dira: zure kodea aurretik irakurtzea aholkua ematean
- Agente bakoitzak `description` bere trigerra espezifiko dituzte
- Agenteak Claude Code-ren integratutako arrazoikatzarekin lan egiten dute
- YACS-eko agenteak proiektu-spezifikoak agente norberekin nahasmegin ezazu beharrezkoa da

---

Galdeteiak edo agenteak laguntzen nahi? Ireki issue edo PR [GitHub](https://github.com/munchkin09/YACS).
