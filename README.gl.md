![](https://boletinstatics.blob.core.windows.net/imagenes/yacs_logo.png)
# YACS — Yet Another Claude Skills Repo

> Unha colección diferente de **Skills para Claude Code** que expanden o que podes facer en cada sesión: dende auditories de seguridade ata deseño de sistemas, gamificación de procesos ou simplemente pensar de xeito diferente.

---

## ¿Que é isto?

**YACS** é un repositorio de Skills — ferramentas baseadas en prompts que Claude Code invoca automaticamente cando é relevante, ou que ti invocas manualmente con `/skill-name`.

Non son comandos xenéricos. Cada skill está deseñado para resolver un tipo de problema específico con rigor e profundidade:

- **Auditories de seguridade** que buscan os vectores reais, non só as obviedades
- **Reflexións sobre calidade** que te fan pensar de xeito diferente
- **Análisis de datos** que explora dúas interpretacións opostas do mesmo número
- **Deseño de gamificación** específico para contextos corporativos
- **Exploración de patróns** de deseño aplicados ao teu problema concreto

---

## Estrutura

```
skills/
├── calidad-y-seguridad/          Auditoría, análisis e mellora de seguridade
├── desarrollo/                    Gamificación, débeda técnica, planificación
├── analisis-diseno-y-arquitectura/ ADRs, sparks arquitectónicos, patróns
├── debate-y-confrontacion-de-ideas/ Red team, brainstorming, validación de ideas
└── datos-e-interpretacion/        Data storytelling, debate de datos, trampas métricas
```

---

## Instalación

### Instalación Rápida

```bash
cd cli
npm install
npm start
```

¡Escolle o teu idioma e selecciona que skills desexa instalar!

---

## Uso do Instalador

O instalador guíate a través de:

1. **Selección de Idioma** - Escolle o teu idioma preferido
2. **Ubicación da Instalación** - Instala en `~/.claude/skills` ou nunha ruta personalizada
3. **Selección de Skills** - Usa ↑↓ para navegar, ESPACIO para seleccionar
4. **Revisión** - Confirma a túa selección antes da instalación

**Atallos de Teclado:**
- ↑↓ - Navegar
- ESPACIO - Seleccionar/Deseleccionar
- a - Alternar todos
- i - Inverter selección
- Intro - Confirmar

---

## Skills por Categoría

### 🔒 Calidade e Seguridade

#### `/owasp-guardian`
Audita código en busca de vulnerabilidades OWASP Top 10. Mostra o fragmento exacto, explica o vector de ataque e proporciona a corrección.

#### `/llm-safety-checks`
Audita código, prompts ou fluxos de axentes en busca de vulnerabilidades específicas de LLM: inyección indirecta de prompts, ofuscación de instrucións, jailbreak, envenenamento de RAG.

#### `/task-flow-planner`
Le un ficheiro de tarefas (MD ou JSON), detecta dependencias e bloqueos, prioriza o traballo por equipos e xera táboa + diagrama Mermaid.

#### `/quality-spark`
Xera unha semela de reflexión sobre a calidade do software — algo para tirar do fío. Sen argumentos, cada invocación che da un ángulo diferente.

---

### 💻 Desenvolvemento

#### `/gamify`
Deseña unha estratexia de gamificación para un proceso interno da empresa. Mapea motivacións, selecciona mecánicas, deseña progresión e evita anti-patróns.

#### `/tech-debt-hunter`
Identifica e prioriza a débeda técnica. Clasifica por impacto real, estima o custo de non actuar, propón accións mínimas de resolución.

---

### 🏗️ Análisis, Deseño e Arquitectura

#### `/adr-writer`
Xera un Architecture Decision Record (ADR) completo e listo para commitear. A partir dunha decisión técnica, produce contexto, decisión, alternativas e consecuencias.

#### `/pattern-finder`
Explora patróns de deseño aplicables a un problema concreto. Descompon as forzas en xogo, identifica candidatos, compara compromisos e recomenda a mellor solución.

#### `/architecture-spark`
Análisis arquitectónica rápida e pensamento de deseño. Identifica decisións clave, propón solucións, destaca riscos.

---

### 🧠 Debate e Confrontación de Ideas

#### `/red-team`
Desafia unha idea dende unha perspectiva adversarial. Identifica debilidades, apunta puntos cegos, proba supostos.

#### `/brainstorm`
Brainstorming estruturado con prompts deseñados para evitar sesgo de anclaxe e pensamento de grupo. Xera ideas novas por cambio de perspectiva.

---

### 📊 Datos e Interpretación

#### `/data-storyteller`
Converte números crus en narrativas convincentes. Extrae insights, constrúe historias coherentes arredor dos datos, destaca o que importa.

#### `/data-debate`
Explora dúas interpretacións opostas dos mesmos datos. Desafia a narrativa predeterminada, descubre perspectivas agochadas.

#### `/deep-research`
Exploración exhaustiva dun tema. Identifica baleiros, desafia supostos, propón marcos para unha comprensión máis profunda.

#### `/metric-trap`
Identifica trampas de métricas e fracasos de medida. Explora como as métricas pueden engañar, o que non miden, indicadores alternativos.

---

## Configuración

O instalador detecta automaticamente o idioma do teu sistema pero chete permite escoller entre:

- 🇬🇧 English
- 🇪🇸 Español
- 🇨🇦 Català
- 🇪🇺 Euskera
- 🇬🇦 Galego
- 🇦🇳 Andaluz

---

## Notas

- Todos os skills manteñen a estrutura de carpetas orixinal
- Os skills están listos para usar inmediatamente despois da instalación
- Cada skill inclúe documentación en SKILL.md
- Os scripts personalizados e ferramentas inclúense con cada skill

---

## Contribuír

Para engadir novos skills:

1. Crea unha carpeta en `skills/<categoría>/<skill-nome>/`
2. Inclúe un ficheiro `SKILL.md` coa descrición do skill
3. Engade todos os scripts ou ferramentas necesarios
4. O instalador detectarao automaticamente

---

## Licencia

MIT
