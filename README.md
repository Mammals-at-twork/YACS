![](https://boletinstatics.blob.core.windows.net/imagenes/yacs_logo.png)
# YACS — Yet Another Claude Skills Repo

> A different collection of **Skills for Claude Code** that expand what you can do in each session: from security audits to system design, gamification processes or simply thinking differently.

---

## What is this?

**YACS** is a repository of **Skills** and **Agents** for Claude Code that expand what you can do in each session.

### Skills
Prompt-based tools that Claude Code invokes automatically when relevant, or you invoke manually with `/skill-name`. Each skill is designed to solve a specific type of problem with rigor and depth:

- **Security audits** that search for real vectors, not just the obvious ones
- **Quality reflections** that make you think differently
- **Data analysis** that explores two opposite interpretations of the same number
- **Gamification design** specific for corporate contexts
- **Design pattern exploration** applied to your concrete problem

### Agents
Specialized expert personas with deep project knowledge that understand your codebase and enforce best practices across a domain. Unlike skills, agents:

- Learn your project structure on first invocation (onboarding phase)
- Persist expertise across conversations
- Can be invoked explicitly or activated proactively by Claude Code
- Enforce domain-specific principles and patterns
- Provide grounded, code-aware recommendations

Current agents cover: **Backend**, **Frontend**, **Infrastructure**, **Security**, and **QA**.

---

## Structure

```
skills/
├── quality-and-security/          Security audit, analysis and improvement
├── development/                    Gamification, technical debt, planning
├── analisis-design-architecture/ ADRs, architectural sparks, patterns
├── idea-confrontation-and-debate/ Red team, brainstorming, idea validation
└── data-and-interpretation/        Data storytelling, data debate, metric traps

agents/
├── backend-expert/                APIs, services, data layer, authentication
├── frontend-expert/               Components, state management, accessibility
├── infra-expert/                  CI/CD, Docker, Kubernetes, IaC, cloud
├── security-expert/               OWASP audits, threat modeling, vulnerability assessment
└── qa-expert/                     Testing strategy, coverage analysis, quality gates
```

---

## Agents by Specialty

### 🏢 Backend Expert
Deep understanding of APIs, business logic, data models, and authentication.
- Understands service architecture, repositories, and query optimization
- Reviews code against backend best practices
- Enforces clean architecture: no business logic in controllers, validation at boundaries
- **Covers:** REST/GraphQL APIs, ORM usage, authentication/authorization, database design, performance

### 🎨 Frontend Expert
Expert in UI components, state management, routing, and user experience.
- Understands component architecture, styling approaches, and performance optimization
- Reviews accessibility (a11y) as equally critical as functional bugs
- Enforces separation of concerns: business logic in hooks/stores, not components
- **Covers:** Component patterns, state management, routing, forms, testing, accessibility, performance

### 🔐 Security Expert
Audits for vulnerabilities across all layers: frontend, backend, infrastructure, and dependencies.
- Thinks like an attacker; provides concrete exploit paths for every finding
- Classifies risk as CRITICAL/HIGH/MEDIUM/LOW with severity definitions
- Never downgrades security findings; enforces secrets management and defense-in-depth
- **Covers:** OWASP Top 10, authentication, cryptography, supply chain risks, threat modeling

### ☁️ Infrastructure Expert
Manages CI/CD, containerization, IaC, cloud resources, and operational reliability.
- Understands deployment pipelines, environment configuration, and observability
- Reviews Docker, Kubernetes, Terraform, and other infrastructure code
- Enforces immutable infrastructure, least privilege, and health checks
- **Covers:** CI/CD, Docker, Kubernetes, IaC, cloud services, secrets management, monitoring

### 🧪 QA Expert
Designs testing strategies, analyzes coverage gaps, and investigates bugs.
- Distinguishes between *missing coverage* (untested behavior) and *poor test quality*
- Follows testing pyramid: unit, integration, contract, E2E at appropriate levels
- Enforces: no implementation-coupled tests, one failure reason per test, regression tests for every bug
- **Covers:** Test strategy, coverage analysis, flakiness detection, bug investigation, test data management

---

## Using Agents

### In your Claude Code IDE

Copy agents to `.claude/agents/` in your project:

```bash
# Option 1: Copy individual agents
cp -r YACS/agents/backend-expert ~/.claude/agents/

# Option 2: Copy all agents
cp -r YACS/agents/* ~/.claude/agents/
```

Then invoke them:

```
Use backend-expert to review this service
Ask infra-expert about the Kubernetes setup
security-expert, audit this code for vulnerabilities
qa-expert, what coverage gaps exist here?
```

Or let Claude Code activate them automatically when relevant.

---

## Installation

### Option 1: With npx (Recommended)

```bash
npx @mammals-at-work/yacs
```

No installation needed — runs directly.

### Option 2: Install globally

```bash
npm install -g @mammals-at-work/yacs
yacs
```

### Option 3: From repository

```bash
git clone https://github.com/munchkin09/YACS.git
cd YACS/cli
npm install
npm start
```

---

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
