# YACS Agents

Specialized expert agents for Claude Code. Each agent has deep domain knowledge and enforces best practices within its area.

## What are agents?

Agents are persistent expert personas that:
- Learn your project structure on first invocation
- Maintain expertise across conversations within a session
- Can be invoked explicitly or activated automatically by Claude Code
- Provide recommendations grounded in your actual codebase
- Enforce domain-specific principles and patterns

Unlike skills (one-off commands), agents are contextual and stateful.

## Agents

### 🏢 Backend Expert (`backend-expert/`)
Specializes in server-side architecture: APIs, services, data models, authentication, and performance.

**When to use:**
- Reviewing API design or endpoint contracts
- Designing database schemas or data access patterns
- Implementing authentication, authorization, or security middleware
- Optimizing queries, caching strategies, or async patterns
- Investigating bugs in services or repositories

**Key principles:**
- No business logic in controllers; all logic in services
- Validation happens at the boundary (input validation before services)
- No raw queries when an ORM is available
- Secrets never hardcoded; always managed via environment

### 🎨 Frontend Expert (`frontend-expert/`)
Specializes in UI: components, state management, routing, styling, accessibility, and performance.

**When to use:**
- Designing component hierarchies or props APIs
- Implementing forms with validation and error states
- Setting up state management (Context, Redux, Zustand, etc.)
- Optimizing performance (lazy loading, memoization, code splitting)
- Ensuring accessibility (a11y) standards are met
- Reviewing styling approaches and responsive design

**Key principles:**
- Components render UI and handle interaction; business logic lives in hooks/stores
- No prop drilling beyond 2 levels; use context or stores instead
- Every data fetch requires loading, error, and success states
- Accessibility is non-negotiable; keyboard navigation and screen reader support required
- Consistent patterns across the codebase

### 🔐 Security Expert (`security-expert/`)
Audits for vulnerabilities, misconfigurations, and security anti-patterns across all layers.

**When to use:**
- Pre-merge security reviews
- Before releases or deployments
- When implementing authentication, authorization, or cryptography
- Reviewing third-party dependencies or supply chain
- Threat modeling before a new feature
- Incident investigation

**Key principles:**
- Secrets never in code, logs, or error responses
- Authorization checks deny by default (deny > allow)
- All input validated at system boundaries
- Uses only vetted cryptography (no rolling your own)
- Errors fail securely without exposing internals
- Defense in depth: no single point of failure

### ☁️ Infrastructure Expert (`infra-expert/`)
Specializes in deployment, CI/CD, containerization, IaC, cloud resources, and operations.

**When to use:**
- Designing or reviewing CI/CD pipelines
- Building Dockerfiles and compose setups
- Writing Terraform, Pulumi, or other IaC
- Configuring Kubernetes manifests
- Setting up observability (logging, metrics, tracing)
- Managing environment configuration and secrets
- Designing for reliability, scaling, and disaster recovery

**Key principles:**
- Secrets managed via secret managers; never in images or code
- Immutable infrastructure: replace rather than mutate
- Environments must be reproducible from code
- Health checks (liveness and readiness) are mandatory
- Least privilege in IAM, service accounts, and network policies
- Pipelines fail fast: lint and unit tests before expensive steps

### 🧪 QA Expert (`qa-expert/`)
Specializes in testing strategy, coverage analysis, test quality, and bug investigation.

**When to use:**
- Designing test strategies (what to test at each level)
- Analyzing coverage gaps
- Investigating test failures or flakiness
- Reviewing test code for quality and maintainability
- Designing tests for a new feature
- Analyzing root causes of reported bugs

**Key principles:**
- Tests verify behavior, not implementation details
- Each test has one reason to fail
- Testing pyramid: unit >> integration >> E2E
- Mocks for external systems, not your own code
- Every fixed bug gets a regression test
- Coverage is a floor, not a goal (100% bad tests < 80% good tests)

## Installation

### Option 1: Copy to your project

Copy individual agents or all of them to `.claude/agents/`:

```bash
# Copy one agent
cp -r YACS/agents/backend-expert ~/.claude/agents/

# Copy all agents
cp -r YACS/agents/* ~/.claude/agents/
```

### Option 2: Reference from YACS repository

If you have YACS cloned locally, you can reference agent paths directly in Claude Code without copying.

## Using Agents

### Explicit invocation

Ask Claude Code to use a specific agent:

```
@backend-expert review the user service for N+1 queries
Use infra-expert to analyze this Dockerfile
security-expert, audit this authentication flow
qa-expert, what tests are missing for this feature?
```

### Proactive activation

Claude Code may automatically activate relevant agents based on context. For example:
- Asking about API design may trigger `backend-expert`
- Discussing component architecture may trigger `frontend-expert`
- Reviewing a Kubernetes file may trigger `infra-expert`
- A security concern may trigger `security-expert`
- Discussing tests may trigger `qa-expert`

## Agent Structure

Each agent is a single `AGENT.md` file with:

```yaml
---
name: <agent-name>
description: <what triggers this agent>
---

## Onboarding
[how the agent learns your project]

## Expertise
[what the agent covers]

## How to respond
[response guidelines]

## Principles
[domain-specific principles to enforce]
```

The `description` field tells Claude Code when to consider activating the agent.

## Creating Custom Agents

You can create project-specific agents in your `.claude/agents/` directory. Follow the same `AGENT.md` format:

1. Create `~/.claude/agents/<agent-name>/AGENT.md`
2. Use YAML frontmatter with `name`, `description`
3. Include onboarding, expertise, response guidelines, and principles
4. Claude Code will automatically discover and offer the agent

Example: A `database-expert` for your project-specific data layer, or a `team-conventions-agent` that enforces your team's style guide.

## Notes

- All agent definitions are in `.md` files with YAML frontmatter
- Agents are project-aware: they read your codebase before advising
- Each agent has specific triggers defined in its `description`
- Agents work alongside Claude Code's built-in reasoning
- Mix agents from YACS with custom project-specific agents as needed

---

Questions or want to contribute agents? Open an issue or PR on [GitHub](https://github.com/munchkin09/YACS).
