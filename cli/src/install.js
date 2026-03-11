#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseArgs as nodeParseArgs } from 'util';
import inquirer from 'inquirer';
import { t, setLanguage, getSupportedLanguages, detectSystemLanguage } from './i18n.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SKILLS_ROOT = path.join(__dirname, '../skills');
const AGENTS_ROOT = path.join(__dirname, '../agents');
const HOME_DIR = process.env.HOME || process.env.USERPROFILE;

// ============================================================================
// CONSTANTS
// ============================================================================

const PLATFORMS = {
  claude: { name: 'Claude Code', emoji: '🔵' },
  codex: { name: 'OpenAI Codex', emoji: '⚫' },
  copilot: { name: 'GitHub Copilot', emoji: '🤖' },
  gemini: { name: 'Google Gemini', emoji: '✨' },
};

const ITEM_TYPES = {
  skills: { name: 'Skills', emoji: '⚡' },
  agents: { name: 'Agents', emoji: '🤖' },
  both: { name: 'Both Skills and Agents', emoji: '🚀' },
};

// ============================================================================
// COLOR UTILITIES
// ============================================================================

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

function log(text, color = 'reset') {
  console.log(`${colors[color]}${text}${colors.reset}`);
}

function header(text) {
  log('\n' + '═'.repeat(60), 'cyan');
  log(`  ${text}`, 'bright');
  log('═'.repeat(60) + '\n', 'cyan');
}

function success(text) {
  log(`✓ ${text}`, 'green');
}

function error(text) {
  log(`✗ ${text}`, 'red');
}

function info(text) {
  log(`ℹ ${text}`, 'blue');
}

// ============================================================================
// FILE SYSTEM UTILITIES
// ============================================================================

function getSkills() {
  const skills = {};

  if (!fs.existsSync(SKILLS_ROOT)) {
    error(`Skills directory not found: ${SKILLS_ROOT}`);
    process.exit(1);
  }

  const categories = fs.readdirSync(SKILLS_ROOT).filter((f) => {
    return fs.statSync(path.join(SKILLS_ROOT, f)).isDirectory();
  });

  categories.forEach((category) => {
    const categoryPath = path.join(SKILLS_ROOT, category);
    const skillDirs = fs.readdirSync(categoryPath).filter((f) => {
      return fs.statSync(path.join(categoryPath, f)).isDirectory();
    });
    skills[category] = skillDirs;
  });

  return skills;
}

function getAgents() {
  const agents = [];

  if (!fs.existsSync(AGENTS_ROOT)) {
    return agents;
  }

  const agentDirs = fs.readdirSync(AGENTS_ROOT).filter((f) => {
    return fs.statSync(path.join(AGENTS_ROOT, f)).isDirectory();
  });

  return agentDirs;
}

function getSkillDescription(skillPath) {
  const skillMdPath = path.join(skillPath, 'SKILL.md');
  if (fs.existsSync(skillMdPath)) {
    const content = fs.readFileSync(skillMdPath, 'utf-8');
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('# ')) {
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].trim() && !lines[j].startsWith('#')) {
            return lines[j].trim().substring(0, 60);
          }
        }
      }
    }
  }
  return '';
}

function getAgentDescription(agentPath) {
  const agentMdPath = path.join(agentPath, 'agent.md');
  if (fs.existsSync(agentMdPath)) {
    const content = fs.readFileSync(agentMdPath, 'utf-8');
    // Extract description from YAML frontmatter
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (fmMatch) {
      const descMatch = fmMatch[1].match(/^description:\s*(.+)$/m);
      if (descMatch) {
        return descMatch[1].trim().substring(0, 60);
      }
    }
  }
  return '';
}

// ============================================================================
// ARGUMENT PARSING
// ============================================================================

function parseArgs(argv = process.argv.slice(2)) {
  try {
    const { values } = nodeParseArgs({
      args: argv,
      options: {
        language: { type: 'string', short: 'l' },
        path: { type: 'string', short: 'p' },
        platform: { type: 'string' },
        skills: { type: 'string', short: 's' },
        agents: { type: 'string', short: 'a' },
        list: { type: 'boolean' },
        help: { type: 'boolean', short: 'h' },
      },
      strict: false,
      allowPositionals: true,
    });

    const unattended = !!(values.language || values.path || values.skills || values.agents || values.list);

    return {
      unattended,
      help: !!values.help,
      list: !!values.list,
      language: values.language || null,
      path: values.path || null,
      platform: values.platform || 'claude',
      skills: values.skills || null,
      agents: values.agents || null,
    };
  } catch (err) {
    error(`${t('error')}: ${err.message}`);
    process.exit(1);
  }
}

function printHelp() {
  const help = `
Usage:
  yacs                                    Interactive mode (default)
  yacs [options]                          Unattended mode

Options:
  -l, --language <code>   Language code (en, es, ca, eu, gl, an, ja)
  -p, --path <path>       Install path: 'home' or an existing directory
      --platform <name>   Platform: claude, codex, copilot, gemini
  -s, --skills <spec>     Skills to install (see below)
  -a, --agents <spec>     Agents to install (see below)
      --list              List all available skills/agents and exit
  -h, --help              Show this help message

Skill spec syntax:
  all                     Install all available skills
  skill1,skill2           Install specific skills by name
  @category               Install all skills in a category
  category:skill          Install a specific skill from a category
  @cat1,skill2            Mix category and individual selections

Agent spec syntax:
  all                     Install all available agents
  agent1,agent2           Install specific agents by name

Examples:
  yacs --path home --skills all
  yacs -p home -s @development,code-reviewer -a all
  yacs --platform claude --path home --skills development:gamify
  yacs --list
  yacs --language es --path home --skills all --agents codebase-quality-analyzer
  yacs --help
`;
  console.log(help);
}

// ============================================================================
// LISTING (UNATTENDED MODE)
// ============================================================================

function printSkillList(allSkills) {
  header('Available Skills');
  const byCategory = {};

  for (const [category, skillNames] of Object.entries(allSkills)) {
    byCategory[category] = [];
    for (const skillName of skillNames) {
      const skillPath = path.join(SKILLS_ROOT, category, skillName);
      const description = getSkillDescription(skillPath);
      byCategory[category].push({ name: skillName, description });
    }
  }

  for (const [category, skills] of Object.entries(byCategory)) {
    log(`\n${colors.yellow}${category}${colors.reset}`);
    for (const skill of skills) {
      const desc = skill.description ? ` - ${skill.description}` : '';
      log(`  • ${skill.name}${desc}`);
    }
  }
  log('');
}

function printAgentList(agents) {
  if (agents.length === 0) return;

  header('Available Agents');
  log(`${colors.cyan}agents${colors.reset}`);
  for (const agentName of agents) {
    const agentPath = path.join(AGENTS_ROOT, agentName);
    const description = getAgentDescription(agentPath);
    const desc = description ? ` - ${description}` : '';
    log(`  • ${agentName}${desc}`);
  }
  log('');
}

// ============================================================================
// UNATTENDED MODE: PATH & ITEMS RESOLUTION
// ============================================================================

function resolveInstallPath(rawPath) {
  if (!rawPath) {
    throw new Error('--path is required in unattended mode');
  }

  if (rawPath === 'home') {
    const skillsPath = path.join(HOME_DIR, '.claude', 'skills');
    return { path: skillsPath, type: 'skills', source: 'home' };
  }

  const resolvedPath = path.resolve(rawPath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Path does not exist: ${resolvedPath}`);
  }

  const skillsPath = path.join(resolvedPath, 'skills');
  return { path: skillsPath, type: 'skills', source: 'custom' };
}

function resolveSkills(rawSkills, allSkills) {
  if (!rawSkills) {
    return [];
  }

  const tokens = rawSkills.split(',').map(t => t.trim());
  const selected = [];
  const unrecognized = [];
  const allSkillsList = [];

  for (const [category, skillNames] of Object.entries(allSkills)) {
    for (const skillName of skillNames) {
      const skillPath = path.join(SKILLS_ROOT, category, skillName);
      const description = getSkillDescription(skillPath);
      allSkillsList.push({
        id: `${category}/${skillName}`,
        category,
        name: skillName,
        path: skillPath,
        description,
      });
    }
  }

  for (const token of tokens) {
    if (token === 'all') {
      selected.push(...allSkillsList);
    } else if (token.startsWith('@')) {
      const categoryName = token.substring(1);
      const categorySkills = allSkillsList.filter(s => s.category === categoryName);
      if (categorySkills.length === 0) {
        unrecognized.push(`@${categoryName} (category not found)`);
      } else {
        selected.push(...categorySkills);
      }
    } else if (token.includes(':')) {
      const [category, skillName] = token.split(':', 2);
      const skill = allSkillsList.find(s => s.category === category && s.name === skillName);
      if (!skill) {
        unrecognized.push(`${token} (not found)`);
      } else {
        selected.push(skill);
      }
    } else {
      const matches = allSkillsList.filter(s => s.name === token);
      if (matches.length === 0) {
        unrecognized.push(token);
      } else {
        if (matches.length > 1) {
          info(`Skill "${token}" found in ${matches.length} categories: ${matches.map(m => m.category).join(', ')}`);
        }
        selected.push(...matches);
      }
    }
  }

  if (unrecognized.length > 0) {
    throw new Error(`Unknown skills: ${unrecognized.join(', ')}`);
  }

  const uniqueSkills = Array.from(new Map(selected.map(s => [s.id, s])).values());
  return uniqueSkills;
}

function resolveAgents(rawAgents, agentsList) {
  if (!rawAgents || agentsList.length === 0) {
    return [];
  }

  const tokens = rawAgents.split(',').map(t => t.trim());
  const selected = [];
  const unrecognized = [];

  for (const token of tokens) {
    if (token === 'all') {
      selected.push(...agentsList);
    } else {
      const agent = agentsList.find(a => a === token);
      if (!agent) {
        unrecognized.push(token);
      } else {
        selected.push(agent);
      }
    }
  }

  if (unrecognized.length > 0) {
    throw new Error(`Unknown agents: ${unrecognized.join(', ')}`);
  }

  return Array.from(new Set(selected)); // Deduplicate
}

// ============================================================================
// INTERACTIVE MODE: SELECTORS
// ============================================================================

async function selectPlatform() {
  const choices = Object.entries(PLATFORMS).map(([key, data]) => ({
    name: `${data.emoji}  ${data.name}`,
    value: key,
  }));

  const result = await inquirer.prompt({
    type: 'rawlist',
    name: 'platform',
    message: t('selectPlatformMessage') || 'Which platform are you using Claude Code with?',
    choices: choices,
    default: 0,
  });

  return result.platform;
}

async function selectLanguage() {
  const detectedLang = detectSystemLanguage();
  const langChoices = Object.entries(getSupportedLanguages()).map(([code, langData]) => ({
    name: `${langData.flag}  ${langData.name}`,
    value: code,
  }));

  const langChoice = await inquirer.prompt({
    type: 'rawlist',
    name: 'language',
    message: '\nSelect language / Selecciona idioma / Aukeratu hizkuntza:',
    choices: langChoices,
    default: langChoices.findIndex(c => c.value === detectedLang),
  });

  return langChoice.language;
}

async function selectItemType(agents) {
  const choices = [
    { name: `${ITEM_TYPES.skills.emoji}  ${t('installSkills') || 'Install Skills'}`, value: 'skills' },
  ];

  if (agents.length > 0) {
    choices.push(
      { name: `${ITEM_TYPES.agents.emoji}  ${t('installAgents') || 'Install Agents'}`, value: 'agents' },
      { name: `${ITEM_TYPES.both.emoji}  ${t('installBoth') || 'Install Both Skills and Agents'}`, value: 'both' }
    );
  }

  const result = await inquirer.prompt({
    type: 'rawlist',
    name: 'itemType',
    message: t('selectItemTypeMessage') || 'What do you want to install?',
    choices: choices,
  });

  return result.itemType;
}

async function selectSkills(skills) {
  const allSkills = [];
  const choices = [];

  header(t('selectSkills') || 'Select Skills');
  log(`${colors.dim}${t('selectSkillsHint') || 'Use ↑↓ to navigate, SPACE to select/deselect'}${colors.reset}\n`);

  let skillIndex = 0;
  for (const [category, skillNames] of Object.entries(skills)) {
    for (const skillName of skillNames) {
      const skillPath = path.join(SKILLS_ROOT, category, skillName);
      const description = getSkillDescription(skillPath);

      const skill = {
        id: `${category}/${skillName}`,
        category,
        name: skillName,
        path: skillPath,
        description,
      };

      allSkills.push(skill);
      const displayName = `${skillName} (${category})`;
      const descDisplay = description ? ` - ${description}` : '';

      choices.push({
        name: displayName + descDisplay,
        value: skillIndex,
      });

      skillIndex++;
    }
  }

  try {
    const result = await inquirer.prompt({
      type: 'checkbox',
      name: 'skills',
      message: t('selectSkillsMessage') || 'Select skills to install:',
      choices: choices,
      pageSize: 15,
    });

    const selectedIndices = result.skills || [];
    return selectedIndices
      .map(idx => allSkills[idx])
      .filter(skill => skill && skill.category && skill.name);
  } catch (err) {
    if (err.isTtyError || err.message?.includes('force closed')) {
      log(`\n❌ ${t('installationCancelled') || 'Installation cancelled'}`);
      process.exit(0);
    }
    throw err;
  }
}

async function selectAgents(agents) {
  const choices = agents.map((agentName, idx) => {
    const agentPath = path.join(AGENTS_ROOT, agentName);
    const description = getAgentDescription(agentPath);
    const descDisplay = description ? ` - ${description}` : '';
    return {
      name: agentName + descDisplay,
      value: idx,
    };
  });

  header(t('selectAgents') || 'Select Agents');
  log(`${colors.dim}${t('selectAgentsHint') || 'Use ↑↓ to navigate, SPACE to select/deselect'}${colors.reset}\n`);

  try {
    const result = await inquirer.prompt({
      type: 'checkbox',
      name: 'agents',
      message: t('selectAgentsMessage') || 'Select agents to install:',
      choices: choices,
      pageSize: 15,
    });

    const selectedIndices = result.agents || [];
    return selectedIndices.map(idx => agents[idx]).filter(Boolean);
  } catch (err) {
    if (err.isTtyError || err.message?.includes('force closed')) {
      log(`\n❌ ${t('installationCancelled') || 'Installation cancelled'}`);
      process.exit(0);
    }
    throw err;
  }
}

async function getInstallPath() {
  header(t('selectLocation') || 'Select Location');

  const locChoice = await inquirer.prompt({
    type: 'rawlist',
    name: 'location',
    message: t('selectLocationMessage') || 'Where should the skills be installed?',
    choices: [
      { name: t('homeDirectory') || 'Home Directory (~/.claude)', value: 'home' },
      { name: t('customRepository') || 'Custom Repository', value: 'custom' },
    ],
  });

  const isHome = locChoice.location === 'home' || locChoice.location === 0;
  const isCustom = locChoice.location === 'custom' || locChoice.location === 1;

  if (isHome) {
    const skillsPath = path.join(HOME_DIR, '.claude', 'skills');
    return { path: skillsPath, source: 'home' };
  } else if (isCustom) {
    const pathChoice = await inquirer.prompt({
      type: 'input',
      name: 'customPath',
      message: t('enterCustomPath') || 'Enter custom path:',
      validate(value) {
        if (!value.trim()) {
          return t('pathEmpty') || 'Path cannot be empty';
        }
        if (!fs.existsSync(value)) {
          return `${t('pathNotExists') || 'Path does not exist'}: ${value}`;
        }
        return true;
      },
    });

    const skillsPath = path.join(pathChoice.customPath, 'skills');
    return { path: skillsPath, source: 'custom' };
  }

  throw new Error(`${t('invalidSelection') || 'Invalid selection'}: ${locChoice.location}`);
}

async function reviewSelection(selected, installPath) {
  header(t('review') || 'Review Selection');

  log(`${colors.bright}${t('destination') || 'Destination'}:${colors.reset} ${installPath}`);
  log(`${colors.bright}${t('totalItems') || 'Total items'}:${colors.reset} ${selected.length}\n`);

  // Separate skills and agents
  const skills = selected.filter(item => item.category);
  const agents = selected.filter(item => !item.category);

  if (skills.length > 0) {
    log(`${colors.yellow}Skills${colors.reset}`);
    const byCategory = {};
    skills.forEach((skill) => {
      if (!byCategory[skill.category]) {
        byCategory[skill.category] = [];
      }
      byCategory[skill.category].push(skill.name);
    });
    for (const [category, names] of Object.entries(byCategory)) {
      log(`  ${colors.dim}${category}${colors.reset}`);
      names.forEach((name) => log(`    • ${name}`));
    }
  }

  if (agents.length > 0) {
    if (skills.length > 0) log('');
    log(`${colors.yellow}Agents${colors.reset}`);
    agents.forEach((agent) => log(`  • ${agent.name}`));
  }

  const confirmation = await inquirer.prompt({
    type: 'confirm',
    name: 'proceed',
    message: t('proceedInstallation') || 'Proceed with installation?',
    default: true,
  });

  return confirmation.proceed;
}

// ============================================================================
// INSTALLATION FUNCTIONS
// ============================================================================

function copySkill(skillPath, destPath) {
  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true });
  }

  const skillName = path.basename(skillPath);
  const skillDestPath = path.join(destPath, skillName);

  if (fs.existsSync(skillDestPath)) {
    fs.rmSync(skillDestPath, { recursive: true, force: true });
  }

  fs.cpSync(skillPath, skillDestPath, { recursive: true });
  return skillDestPath;
}

function copyAgent(agentName, destPath) {
  const agentPath = path.join(AGENTS_ROOT, agentName);

  if (!fs.existsSync(agentPath)) {
    throw new Error(`Agent not found: ${agentName}`);
  }

  const agentsDestPath = path.join(destPath, '..', 'agents');

  if (!fs.existsSync(agentsDestPath)) {
    fs.mkdirSync(agentsDestPath, { recursive: true });
  }

  const agentDestPath = path.join(agentsDestPath, agentName);

  if (fs.existsSync(agentDestPath)) {
    fs.rmSync(agentDestPath, { recursive: true, force: true });
  }

  fs.cpSync(agentPath, agentDestPath, { recursive: true });
  return agentDestPath;
}

async function installSkills(selected, installPath) {
  header(t('installingSkills') || '⚙️  INSTALLING SKILLS');

  for (const skill of selected) {
    try {
      copySkill(skill.path, installPath);
      success(`${skill.category}/${skill.name}`);
    } catch (err) {
      error(`${skill.category}/${skill.name}: ${err.message}`);
    }
  }
}

async function installAgents(selected, installPath) {
  header(t('installingAgents') || '⚙️  INSTALLING AGENTS');

  for (const agentName of selected) {
    try {
      copyAgent(agentName, installPath);
      success(agentName);
    } catch (err) {
      error(`${agentName}: ${err.message}`);
    }
  }
}

// ============================================================================
// MAIN EXECUTION MODES
// ============================================================================

async function runUnattended(args) {
  setLanguage(args.language || detectSystemLanguage());

  const platform = args.platform || 'claude';
  const platformName = PLATFORMS[platform]?.name || 'Claude Code';

  header(`${t('title') || 'YACS'} - ${platformName}`);

  const skills = getSkills();
  const agents = getAgents();

  if (args.list) {
    printSkillList(skills);
    printAgentList(agents);
    process.exit(0);
  }

  if (!args.path) {
    error(t('unattendedMissingPath') || '--path is required in unattended mode');
    process.exit(1);
  }

  if (!args.skills && !args.agents) {
    error(t('unattendedMissingItems') || '--skills or --agents is required in unattended mode');
    process.exit(1);
  }

  const installPath = resolveInstallPath(args.path);
  const selectedSkills = resolveSkills(args.skills, skills);
  const selectedAgents = resolveAgents(args.agents, agents);

  if (selectedSkills.length === 0 && selectedAgents.length === 0) {
    error(t('unattendedNoItemsMatched') || 'No skills or agents matched your specification');
    process.exit(1);
  }

  log(`${colors.bright}${t('platform') || 'Platform'}:${colors.reset} ${platformName}`);
  log(`${colors.bright}${t('destination') || 'Destination'}:${colors.reset} ${installPath.path}`);
  log(`${colors.bright}${t('totalSkills') || 'Skills'}:${colors.reset} ${selectedSkills.length}`);
  if (selectedAgents.length > 0) {
    log(`${colors.bright}${t('totalAgents') || 'Agents'}:${colors.reset} ${selectedAgents.length}`);
  }
  log('');

  if (selectedSkills.length > 0) {
    const byCategory = {};
    selectedSkills.forEach((skill) => {
      if (!byCategory[skill.category]) {
        byCategory[skill.category] = [];
      }
      byCategory[skill.category].push(skill.name);
    });

    log(`${colors.yellow}Skills${colors.reset}`);
    for (const [category, names] of Object.entries(byCategory)) {
      log(`  ${colors.dim}${category}${colors.reset}`);
      names.forEach((name) => log(`    • ${name}`));
    }
  }

  if (selectedAgents.length > 0) {
    if (selectedSkills.length > 0) log('');
    log(`${colors.yellow}Agents${colors.reset}`);
    selectedAgents.forEach((name) => log(`  • ${name}`));
  }

  log('');

  if (selectedSkills.length > 0) {
    await installSkills(selectedSkills, installPath.path);
  }
  if (selectedAgents.length > 0) {
    await installAgents(selectedAgents, installPath.path);
  }

  header(t('completed') || 'Installation Completed');
  log(`${t('installedAt') || 'Installed at'}:`);
  log(`  ${colors.bright}${installPath.path}${colors.reset}\n`);

  process.exit(0);
}

async function runInteractive() {
  // 1. Select Platform
  const selectedPlatform = await selectPlatform();
  const platformName = PLATFORMS[selectedPlatform].name;

  // 2. Select Language
  const selectedLanguage = await selectLanguage();
  setLanguage(selectedLanguage);

  header(`${t('title') || 'YACS'} - ${platformName}`);

  const skills = getSkills();
  const agents = getAgents();
  const totalSkills = Object.values(skills).reduce((sum, arr) => sum + arr.length, 0);

  log(`${colors.bright}${t('availableSkills') || 'Available skills'}:${colors.reset} ${totalSkills}`);
  log(`${colors.bright}${t('categories') || 'Categories'}:${colors.reset} ${Object.keys(skills).length}`);
  if (agents.length > 0) {
    log(`${colors.bright}${t('availableAgents') || 'Available agents'}:${colors.reset} ${agents.length}`);
  }
  log('');

  // 3. Select Install Path
  const installPath = await getInstallPath();

  // 4. Select Item Type (Skills, Agents, or Both)
  const itemType = await selectItemType(agents);

  // 5. Select Skills and/or Agents
  let selectedSkills = [];
  let selectedAgents = [];

  if (itemType === 'skills' || itemType === 'both') {
    selectedSkills = await selectSkills(skills);
  }

  if (itemType === 'agents' || itemType === 'both') {
    selectedAgents = await selectAgents(agents);
  }

  if (selectedSkills.length === 0 && selectedAgents.length === 0) {
    error(t('noItemsSelected') || 'No items were selected');
    process.exit(1);
  }

  // 6. Review Selection
  const combined = [
    ...selectedSkills,
    ...selectedAgents.map(name => ({ name, category: null }))
  ];

  const proceed = await reviewSelection(combined, installPath.path);

  if (!proceed) {
    log(`\n❌ ${t('installationCancelled') || 'Installation cancelled'}`);
    process.exit(0);
  }

  // 7. Install
  if (selectedSkills.length > 0) {
    await installSkills(selectedSkills, installPath.path);
  }
  if (selectedAgents.length > 0) {
    await installAgents(selectedAgents, installPath.path);
  }

  header(t('completed') || 'Installation Completed');
  log(`${t('installedAt') || 'Installed at'}:`);
  log(`  ${colors.bright}${installPath.path}${colors.reset}\n`);

  process.exit(0);
}

// ============================================================================
// MAIN ENTRY POINT
// ============================================================================

async function main() {
  const args = parseArgs();

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  try {
    if (args.unattended) {
      await runUnattended(args);
    } else {
      await runInteractive();
    }
  } catch (err) {
    if (err.isTtyError || err.message?.includes('force closed') || err.message?.includes('User cancelled')) {
      log(`\n❌ ${t('operationCancelled') || 'Operation cancelled'}`);
      process.exit(0);
    }
    error(`${t('error') || 'Error'}: ${err.message}`);
    process.exit(1);
  }
}

main().catch((err) => {
  error(`${t('error') || 'Error'}: ${err.message}`);
  process.exit(1);
});
