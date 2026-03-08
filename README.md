![](https://boletinstatics.blob.core.windows.net/imagenes/yacs_logo.png)
# YACS — Yet Another Claude Skills Repo

> A different collection of **Skills for Claude Code** that expand what you can do in each session: from security audits to system design, gamification processes or simply thinking differently.

---

## What is this?

**YACS** is a repository of Skills — prompt-based tools that Claude Code invokes automatically when relevant, or you invoke manually with `/skill-name`.

They are not generic commands. Each skill is designed to solve a specific type of problem with rigor and depth:

- **Security audits** that search for real vectors, not just the obvious ones
- **Quality reflections** that make you think differently
- **Data analysis** that explores two opposite interpretations of the same number
- **Gamification design** specific for corporate contexts
- **Design pattern exploration** applied to your concrete problem

---

## Structure

```
skills/
├── calidad-y-seguridad/          Security audit, analysis and improvement
├── desarrollo/                    Gamification, technical debt, planning
├── analisis-diseno-y-arquitectura/ ADRs, architectural sparks, patterns
├── debate-y-confrontacion-de-ideas/ Red team, brainstorming, idea validation
└── datos-e-interpretacion/        Data storytelling, data debate, metric traps
```

---

## Installation

### Quick Install

```bash
cd cli
npm install
npm start
```

Choose your language and select which skills to install!

---

## Installer Usage

The installer guides you through:

1. **Language Selection** - Choose your preferred language
2. **Installation Location** - Install to `~/.claude/skills` or a custom path
3. **Skill Selection** - Use ↑↓ to navigate, SPACE to select
4. **Review** - Confirm your selection before installation

**Keyboard Shortcuts:**
- ↑↓ - Navigate
- SPACE - Select/Deselect
- a - Toggle all
- i - Invert selection
- Enter - Confirm

### Running Tests

The CLI includes a complete test suite that validates:
- i18n module functionality (7 languages, translations)
- Skills directory structure
- Translation file validity

```bash
cd cli
npm test
```

Expected result: **31 tests passing** with 100% success rate.

---

## Skills by Category

### 🔒 Quality and Security

#### `/owasp-guardian`
Audits code for OWASP Top 10 vulnerabilities. Shows the exact snippet, explains the attack vector and provides the fix.

#### `/llm-safety-checks`
Audits code, prompts or agent flows for LLM-specific vulnerabilities: indirect prompt injection, instruction obfuscation, jailbreak, RAG poisoning.

#### `/task-flow-planner`
Reads a task file (MD or JSON), detects dependencies and blockers, prioritizes work by teams and generates table + Mermaid diagram.

#### `/quality-spark`
Generates a seed for reflection on software quality — something to pull the thread. No arguments, each invocation gives you a different angle.

---

### 💻 Development

#### `/gamify`
Designs a gamification strategy for an internal company process. Maps motivations, selects mechanics, designs progression and avoids anti-patterns.

#### `/tech-debt-hunter`
Identifies and prioritizes technical debt. Classifies by real impact, estimates cost of inaction, proposes minimal resolution actions.

---

### 🏗️ Analysis, Design and Architecture

#### `/adr-writer`
Generates a complete Architecture Decision Record (ADR) ready to commit. From a technical decision, produces context, decision, alternatives and consequences.

#### `/pattern-finder`
Explores applicable design patterns for a concrete problem. Breaks down the forces at play, identifies candidates, compares trade-offs and recommends the best solution.

#### `/architecture-spark`
Quick architectural analysis and design thinking. Identifies key decisions, proposes solutions, highlights risks.

---

### 🧠 Debate and Idea Confrontation

#### `/red-team`
Challenges an idea from an adversarial perspective. Identifies weaknesses, points out blind spots, tests assumptions.

#### `/brainstorm`
Structured brainstorming with prompts designed to avoid anchoring bias and groupthink. Generates novel ideas by perspective shifting.

---

### 📊 Data and Interpretation

#### `/data-storyteller`
Turns raw numbers into compelling narratives. Extracts insights, builds coherent stories around data, highlights what matters.

#### `/data-debate`
Explores two opposite interpretations of the same data. Challenges the default narrative, uncovers hidden perspectives.

#### `/deep-research`
Thorough exploration of a topic. Identifies gaps, challenges assumptions, proposes frameworks for deeper understanding.

#### `/metric-trap`
Identifies metric traps and measurement failures. Explores how metrics can mislead, what they don't measure, alternative indicators.

---

## Configuration

The installer automatically detects your system language but allows you to choose from:

- 🇬🇧 English
- 🇪🇸 Español
- 🇨🇦 Català
- 🇪🇺 Euskera
- 🇬🇦 Galego
- 🇦🇳 Andaluz

---

## Notes

- All skills maintain their original folder structure
- Skills are ready to use immediately after installation
- Each skill includes documentation in SKILL.md
- Custom scripts and tools are included with each skill

---

## Contributing

To add new skills:

1. Create a folder in `skills/<category>/<skill-name>/`
2. Include a `SKILL.md` file with the skill description
3. Add any required scripts or tools
4. The installer will automatically detect it

---

## License

MIT
