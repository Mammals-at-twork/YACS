# Agentes YACS

Agentes especializados para Claude Code. Cada agente possui conhecimento profundo de seu domínio e implementa boas práticas em sua área.

## O que são agentes?

Agentes são personas experientes persistentes que:
- Aprendem a estrutura do seu projeto na primeira invocação
- Mantêm experiência em conversas dentro de uma sessão
- Podem ser invocados explicitamente ou ativados automaticamente pelo Claude Code
- Fornecem recomendações ancoradas no seu código real
- Implementam padrões e princípios específicos do domínio

Diferentemente das skills (comandos pontuais), os agentes são conscientes do contexto e com estado.

## Agentes

### 🏢 Especialista em Backend (`backend-expert/`)
Especializa-se em arquitetura do servidor: APIs, serviços, modelos de dados, autenticação e desempenho.

**Quando usar:**
- Revisar design de API ou contratos de endpoints
- Projetar esquemas de banco de dados ou padrões de acesso a dados
- Implementar autenticação, autorização ou middleware de segurança
- Otimizar queries, estratégias de cache ou padrões assincronos
- Investigar bugs em serviços ou repositórios

**Princípios-chave:**
- Sem lógica de negócio em controladores; toda lógica em serviços
- Validação no limite (validação de entrada antes de serviços)
- Sem queries raw quando há ORM disponível
- Segredos nunca hardcodeados; sempre gerenciados via variáveis de ambiente

### 🎨 Especialista em Frontend (`frontend-expert/`)
Especializa-se em UI: componentes, gerenciamento de estado, roteamento, estilo, acessibilidade e desempenho.

**Quando usar:**
- Projetar hierarquias de componentes ou APIs de props
- Implementar formulários com validação e estados de erro
- Configurar gerenciamento de estado (Context, Redux, Zustand, etc.)
- Otimizar desempenho (lazy loading, memoização, code splitting)
- Garantir padrões de acessibilidade (a11y)
- Revisar abordagens de estilo e design responsivo

**Princípios-chave:**
- Componentes renderizam UI e tratam interação; lógica de negócio em hooks/stores
- Sem prop drilling além de 2 níveis; usar context ou stores em vez disso
- Toda busca de dados requer estados de loading, error e success
- Acessibilidade é inegociável; navegação por teclado e suporte para leitores de tela obrigatório
- Padrões consistentes em toda a base de código

### 🔐 Especialista em Segurança (`security-expert/`)
Audita vulnerabilidades, configurações incorretas e antipadrões de segurança em todas as camadas.

**Quando usar:**
- Revisões de segurança pré-merge
- Antes de releases ou deployments
- Ao implementar autenticação, autorização ou criptografia
- Revisar dependências de terceiros ou cadeia de suprimentos
- Modelagem de ameaças antes de um novo recurso
- Investigação de incidentes

**Princípios-chave:**
- Segredos nunca em código, logs ou respostas de erro
- Verificações de autorização negam por padrão (deny > allow)
- Toda entrada validada em limites do sistema
- Usa apenas criptografia verificada (sem criar sua própria)
- Erros falham com segurança sem expor internals
- Defesa em profundidade: sem ponto único de falha

### ☁️ Especialista em Infraestrutura (`infra-expert/`)
Especializa-se em deployment, CI/CD, containerização, IaC, recursos em cloud e operações.

**Quando usar:**
- Projetar ou revisar pipelines de CI/CD
- Construir Dockerfiles e setups de compose
- Escrever Terraform, Pulumi ou outra IaC
- Configurar manifestos de Kubernetes
- Configurar observabilidade (logging, métricas, tracing)
- Gerenciar configuração de ambiente e segredos
- Projetar para confiabilidade, escalabilidade e recuperação de desastres

**Princípios-chave:**
- Segredos gerenciados via secret managers; nunca em imagens ou código
- Infraestrutura imutável: substituir em vez de mutar
- Ambientes devem ser reproduzíveis a partir de código
- Health checks (liveness e readiness) são obrigatórios
- Princípio do menor privilégio em IAM, contas de serviço e políticas de rede
- Pipelines falham rápido: lint e testes unitários antes de etapas caras

### 🧪 Especialista em QA (`qa-expert/`)
Especializa-se em estratégia de testes, análise de cobertura, qualidade de testes e investigação de bugs.

**Quando usar:**
- Projetar estratégias de testes (o que testar em cada nível)
- Analisar lacunas de cobertura
- Investigar falhas de teste ou flakiness
- Revisar código de teste por qualidade e manutenibilidade
- Projetar testes para um novo recurso
- Analisar causas raiz de bugs reportados

**Princípios-chave:**
- Testes verificam comportamento, não detalhes de implementação
- Cada teste tem uma razão para falhar
- Pirâmide de testes: unit >> integration >> E2E
- Mocks para sistemas externos, não seu próprio código
- Todo bug corrigido obtém um teste de regressão
- Cobertura é um piso, não uma meta (100% testes ruins < 80% testes bons)

## Instalação

### Opção 1: Copiar para seu projeto

Copie agentes individuais ou todos para `.claude/agents/`:

```bash
# Copiar um agente
cp -r YACS/agents/backend-expert ~/.claude/agents/

# Copiar todos os agentes
cp -r YACS/agents/* ~/.claude/agents/
```

### Opção 2: Referenciar do repositório YACS

Se você tem YACS clonado localmente, pode referenciar caminhos de agentes diretamente no Claude Code sem copiar.

## Usando Agentes

### Invocação explícita

Peça ao Claude Code para usar um agente específico:

```
@backend-expert revise o serviço de usuário por queries N+1
Use infra-expert para analisar este Dockerfile
security-expert, audite este fluxo de autenticação
qa-expert, que testes estão faltando para este recurso?
```

### Ativação proativa

Claude Code pode ativar automaticamente agentes relevantes com base no contexto. Por exemplo:
- Perguntar sobre design de API pode disparar `backend-expert`
- Discutir arquitetura de componentes pode disparar `frontend-expert`
- Revisar um arquivo Kubernetes pode disparar `infra-expert`
- Uma preocupação de segurança pode disparar `security-expert`
- Discutir testes pode disparar `qa-expert`

## Estrutura do Agente

Cada agente é um único arquivo `AGENT.md` com:

```yaml
---
name: <agent-name>
description: <o que ativa este agente>
---

## Onboarding
[como o agente aprende seu projeto]

## Expertise
[o que o agente cobre]

## How to respond
[diretrizes de resposta]

## Principles
[princípios específicos do domínio a implementar]
```

O campo `description` diz ao Claude Code quando considerar ativar o agente.

## Criando Agentes Customizados

Você pode criar agentes específicos do projeto em seu diretório `.claude/agents/`. Siga o mesmo formato `AGENT.md`:

1. Crie `~/.claude/agents/<agent-name>/AGENT.md`
2. Use frontmatter YAML com `name`, `description`
3. Inclua onboarding, expertise, diretrizes de resposta e princípios
4. Claude Code descobrirá e oferecerá o agente automaticamente

Exemplo: Um `database-expert` para sua camada de dados específica do projeto, ou um `team-conventions-agent` que implemente o guia de estilo do seu time.

## Notas

- Todas as definições de agentes estão em arquivos `.md` com frontmatter YAML
- Agentes são cientes do projeto: leem sua base de código antes de aconselhar
- Cada agente possui triggers específicos definidos em sua `description`
- Agentes trabalham ao lado do raciocínio integrado do Claude Code
- Misture agentes do YACS com agentes customizados específicos do projeto conforme necessário

---

Perguntas ou quer contribuir agentes? Abra uma issue ou PR no [GitHub](https://github.com/munchkin09/YACS).
