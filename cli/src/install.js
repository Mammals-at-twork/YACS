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
// ARGUMENT PARSING FOR UNATTENDED MODE
// ============================================================================

function parseArgs(argv = process.argv.slice(2)) {
  try {
    const { values } = nodeParseArgs({
      args: argv,
      options: {
        language: { type: 'string', short: 'l' },
        path: { type: 'string', short: 'p' },
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
  -s, --skills <spec>     Skills to install (see below)
  -a, --agents <spec>     Agents to install: 'all' or comma-separated names
      --list              List all available skills and agents and exit
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
  yacs --path home --agents all
  yacs --path home --skills all --agents all
  yacs -p home -s @development,code-reviewer
  yacs -p home -a backend-expert,security-expert
  yacs --path /my/project --skills development:gamify
  yacs --list
  yacs --language es --path home --skills all
  yacs --help
`;
  console.log(help);
}


// Color codes for terminal
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

// Get all skills organized by category
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

// Get all agents as a flat list
function getAgents() {
  const agents = [];

  if (!fs.existsSync(AGENTS_ROOT)) {
    return agents;
  }

  const agentDirs = fs.readdirSync(AGENTS_ROOT).filter((f) => {
    return fs.statSync(path.join(AGENTS_ROOT, f)).isDirectory();
  });

  agentDirs.forEach((agentName) => {
    const agentPath = path.join(AGENTS_ROOT, agentName);
    const description = getAgentDescription(agentPath);
    agents.push({ name: agentName, path: agentPath, description });
  });

  return agents;
}

// Read skill description from SKILL.md
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

// Read agent description from AGENT.md frontmatter
function getAgentDescription(agentPath) {
  const agentMdPath = path.join(agentPath, 'AGENT.md');
  if (fs.existsSync(agentMdPath)) {
    const content = fs.readFileSync(agentMdPath, 'utf-8');
    const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (match) {
      const frontmatter = match[1];
      const descLine = frontmatter.split('\n').find(l => l.startsWith('description:'));
      if (descLine) {
        return descLine.replace('description:', '').trim().substring(0, 60);
      }
    }
  }
  return '';
}

// ============================================================================
// UNATTENDED MODE FUNCTIONS
// ============================================================================

function printList(allSkills, allAgents) {
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

  header('Available Agents');
  for (const agent of allAgents) {
    const desc = agent.description ? ` - ${agent.description}` : '';
    log(`  • ${agent.name}${desc}`);
  }
  log('');
}

function resolveInstallPath(rawPath) {
  if (!rawPath) {
    throw new Error('--path is required in unattended mode');
  }

  if (rawPath === 'home') {
    return {
      skillsPath: path.join(HOME_DIR, '.claude', 'skills'),
      agentsPath: path.join(HOME_DIR, '.claude', 'agents'),
      source: 'home',
    };
  }

  const resolvedPath = path.resolve(rawPath);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Path does not exist: ${resolvedPath}`);
  }

  return {
    skillsPath: path.join(resolvedPath, 'skills'),
    agentsPath: path.join(resolvedPath, '.claude', 'agents'),
    source: 'custom',
  };
}

function resolveSkills(rawSkills, allSkills) {
  if (!rawSkills) {
    throw new Error('--skills is required in unattended mode');
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
    throw new Error(`Unknown skills or categories: ${unrecognized.join(', ')}`);
  }

  return Array.from(new Map(selected.map(s => [s.id, s])).values());
}

function resolveAgents(rawAgents, allAgents) {
  if (!rawAgents) {
    throw new Error('--agents is required when installing agents');
  }

  if (rawAgents === 'all') {
    return [...allAgents];
  }

  const names = rawAgents.split(',').map(n => n.trim());
  const selected = [];
  const unrecognized = [];

  for (const name of names) {
    const agent = allAgents.find(a => a.name === name);
    if (!agent) {
      unrecognized.push(name);
    } else {
      selected.push(agent);
    }
  }

  if (unrecognized.length > 0) {
    throw new Error(`${t('unattendedUnknownAgent')}: ${unrecognized.join(', ')}`);
  }

  return Array.from(new Map(selected.map(a => [a.name, a])).values());
}

// Interactive skill selection
async function selectSkills(skills) {
  const allSkills = [];
  const choices = [];

  header(t('selectSkills'));
  log(`${colors.dim}${t('selectSkillsHint')}${colors.reset}\n`);

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
      message: t('selectSkillsMessage'),
      choices: choices,
      pageSize: 15,
    });

    const selectedIndices = result.skills || [];

    if (Array.isArray(selectedIndices)) {
      return selectedIndices
        .map(idx => allSkills[idx])
        .filter(skill => skill && skill.category && skill.name);
    }

    return [];
  } catch (err) {
    if (err.isTtyError || err.message?.includes('force closed')) {
      log(`\n❌ ${t('installationCancelled')}`);
      process.exit(0);
    }
    throw err;
  }
}

// Interactive agent selection
async function selectAgents(agents) {
  header(t('selectAgents'));
  log(`${colors.dim}${t('selectAgentsHint')}${colors.reset}\n`);

  const choices = agents.map((agent, idx) => {
    const descDisplay = agent.description ? ` - ${agent.description}` : '';
    return { name: agent.name + descDisplay, value: idx };
  });

  try {
    const result = await inquirer.prompt({
      type: 'checkbox',
      name: 'agents',
      message: t('selectAgentsMessage'),
      choices,
      pageSize: 15,
    });

    const selectedIndices = result.agents || [];
    return selectedIndices.map(idx => agents[idx]).filter(Boolean);
  } catch (err) {
    if (err.isTtyError || err.message?.includes('force closed')) {
      log(`\n❌ ${t('installationCancelled')}`);
      process.exit(0);
    }
    throw err;
  }
}

// Copy skill folder to destination
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

// Copy agent AGENT.md to destination as <agentname>.md
function copyAgent(agentPath, destPath) {
  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true });
  }

  const agentName = path.basename(agentPath);
  const srcFile = path.join(agentPath, 'AGENT.md');
  const destFile = path.join(destPath, `${agentName}.md`);

  fs.copyFileSync(srcFile, destFile);
  return destFile;
}

// Get installation path from user (interactive)
async function getInstallPath() {
  header(t('selectLocation'));

  const locChoice = await inquirer.prompt({
    type: 'rawlist',
    name: 'location',
    message: t('selectLocationMessage'),
    choices: [
      { name: t('homeDirectory'), value: 'home' },
      { name: t('customRepository'), value: 'custom' },
    ],
  });

  const location = locChoice.location;
  const isHome = location === 'home' || location === 0 || location === '0';
  const isCustom = location === 'custom' || location === 1 || location === '1';

  if (isHome) {
    return {
      skillsPath: path.join(HOME_DIR, '.claude', 'skills'),
      agentsPath: path.join(HOME_DIR, '.claude', 'agents'),
      source: 'home',
    };
  } else if (isCustom) {
    const pathChoice = await inquirer.prompt({
      type: 'input',
      name: 'customPath',
      message: t('enterCustomPath'),
      validate(value) {
        if (!value.trim()) {
          return t('pathEmpty');
        }
        if (!fs.existsSync(value)) {
          return `${t('pathNotExists')}: ${value}`;
        }
        return true;
      },
    });

    return {
      skillsPath: path.join(pathChoice.customPath, 'skills'),
      agentsPath: path.join(pathChoice.customPath, '.claude', 'agents'),
      source: 'custom',
    };
  }

  throw new Error(`${t('invalidSelection')}: ${location}`);
}

// Review and confirm selection before installing
async function reviewSelection(selectedSkills, selectedAgents, installPath) {
  header(t('review'));

  log(`${colors.bright}${t('destination')}:${colors.reset}`);
  if (selectedSkills.length > 0) {
    log(`  skills → ${installPath.skillsPath}`);
  }
  if (selectedAgents.length > 0) {
    log(`  agents → ${installPath.agentsPath}`);
  }

  if (selectedSkills.length > 0) {
    log(`\n${colors.bright}${t('totalSkills')}:${colors.reset} ${selectedSkills.length}`);

    const byCategory = {};
    selectedSkills.forEach((skill) => {
      if (!byCategory[skill.category]) byCategory[skill.category] = [];
      byCategory[skill.category].push(skill.name);
    });

    for (const [category, names] of Object.entries(byCategory)) {
      log(`${colors.yellow}${category}${colors.reset}`);
      names.forEach((name) => log(`  • ${name}`));
    }
  }

  if (selectedAgents.length > 0) {
    log(`\n${colors.bright}${t('totalAgents')}:${colors.reset} ${selectedAgents.length}`);
    selectedAgents.forEach((agent) => log(`  • ${agent.name}`));
  }

  const confirmation = await inquirer.prompt({
    type: 'confirm',
    name: 'proceed',
    message: t('proceedInstallation'),
    default: true,
  });

  return confirmation.proceed;
}

// Install skills to destination
async function installSkills(selected, skillsPath) {
  header(t('installing'));

  for (const skill of selected) {
    try {
      copySkill(skill.path, skillsPath);
      success(`${skill.category}/${skill.name}`);
    } catch (err) {
      error(`${skill.category}/${skill.name}: ${err.message}`);
    }
  }

  log(`${t('installedAt')}:`);
  log(`  ${colors.bright}${skillsPath}${colors.reset}\n`);
}

// Install agents to destination
async function installAgents(selected, agentsPath) {
  header(t('installingAgents'));

  for (const agent of selected) {
    try {
      copyAgent(agent.path, agentsPath);
      success(agent.name);
    } catch (err) {
      error(`${agent.name}: ${err.message}`);
    }
  }

  log(`${t('agentsInstalledAt')}:`);
  log(`  ${colors.bright}${agentsPath}${colors.reset}\n`);
}

// ============================================================================
// UNATTENDED MODE EXECUTION
// ============================================================================

async function runUnattended(args) {
  setLanguage(args.language || detectSystemLanguage());

  header(t('title'));

  const skills = getSkills();
  const agents = getAgents();

  if (args.list) {
    printList(skills, agents);
    process.exit(0);
  }

  if (!args.path) {
    error(t('unattendedMissingPath'));
    process.exit(1);
  }

  if (!args.skills && !args.agents) {
    error(t('unattendedMissingSkills'));
    process.exit(1);
  }

  const installPath = resolveInstallPath(args.path);

  let selectedSkills = [];
  if (args.skills) {
    selectedSkills = resolveSkills(args.skills, skills);
    if (selectedSkills.length === 0) {
      error(t('unattendedNoSkillsMatched'));
      process.exit(1);
    }
  }

  let selectedAgents = [];
  if (args.agents) {
    selectedAgents = resolveAgents(args.agents, agents);
    if (selectedAgents.length === 0) {
      error(t('unattendedNoAgentsMatched'));
      process.exit(1);
    }
  }

  // Display summary
  if (selectedSkills.length > 0) {
    log(`${colors.bright}${t('destination')}:${colors.reset} ${installPath.skillsPath}`);
    log(`${colors.bright}${t('totalSkills')}:${colors.reset} ${selectedSkills.length}\n`);

    const byCategory = {};
    selectedSkills.forEach((skill) => {
      if (!byCategory[skill.category]) byCategory[skill.category] = [];
      byCategory[skill.category].push(skill.name);
    });
    for (const [category, names] of Object.entries(byCategory)) {
      log(`${colors.yellow}${category}${colors.reset}`);
      names.forEach((name) => log(`  • ${name}`));
    }
    log('');
  }

  if (selectedAgents.length > 0) {
    log(`${colors.bright}${t('destination')}:${colors.reset} ${installPath.agentsPath}`);
    log(`${colors.bright}${t('totalAgents')}:${colors.reset} ${selectedAgents.length}\n`);
    selectedAgents.forEach((agent) => log(`  • ${agent.name}`));
    log('');
  }

  if (selectedSkills.length > 0) {
    await installSkills(selectedSkills, installPath.skillsPath);
  }
  if (selectedAgents.length > 0) {
    await installAgents(selectedAgents, installPath.agentsPath);
  }

  header(t('completed'));
  process.exit(0);
}

// ============================================================================
// INTERACTIVE MODE EXECUTION
// ============================================================================

async function runInteractive() {
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

  setLanguage(langChoice.language);

  header(t('title'));

  // Step 1: What to install?
  const modeChoice = await inquirer.prompt({
    type: 'rawlist',
    name: 'mode',
    message: t('installMode'),
    choices: [
      { name: t('installSkills'), value: 'skills' },
      { name: t('installAgents'), value: 'agents' },
      { name: t('installBoth'), value: 'both' },
    ],
  });

  const doSkills = modeChoice.mode === 'skills' || modeChoice.mode === 'both';
  const doAgents = modeChoice.mode === 'agents' || modeChoice.mode === 'both';

  // Step 2: Show available counts
  const skills = getSkills();
  const agents = getAgents();

  if (doSkills) {
    const totalSkills = Object.values(skills).reduce((sum, arr) => sum + arr.length, 0);
    log(`${colors.bright}${t('availableSkills')}:${colors.reset} ${totalSkills}`);
    log(`${colors.bright}${t('categories')}:${colors.reset} ${Object.keys(skills).length}`);
  }
  if (doAgents) {
    log(`${colors.bright}${t('availableAgents')}:${colors.reset} ${agents.length}`);
  }
  log('');

  // Step 3: Install path
  const installPath = await getInstallPath();

  // Step 4: Select skills if needed
  let selectedSkills = [];
  if (doSkills) {
    selectedSkills = await selectSkills(skills);
    if (selectedSkills.length === 0 && !doAgents) {
      error(t('noSkillsSelected'));
      process.exit(1);
    }
  }

  // Step 5: Select agents if needed
  let selectedAgents = [];
  if (doAgents) {
    selectedAgents = await selectAgents(agents);
    if (selectedAgents.length === 0 && !doSkills) {
      error(t('noAgentsSelected'));
      process.exit(1);
    }
  }

  if (selectedSkills.length === 0 && selectedAgents.length === 0) {
    error(t('noSkillsSelected'));
    process.exit(1);
  }

  // Step 6: Review and confirm
  const proceed = await reviewSelection(selectedSkills, selectedAgents, installPath);

  if (!proceed) {
    log(`\n❌ ${t('installationCancelled')}`);
    process.exit(0);
  }

  // Step 7: Install
  if (selectedSkills.length > 0) {
    await installSkills(selectedSkills, installPath.skillsPath);
  }
  if (selectedAgents.length > 0) {
    await installAgents(selectedAgents, installPath.agentsPath);
  }

  header(t('completed'));
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
      log(`\n❌ ${t('operationCancelled')}`);
      process.exit(0);
    }
    error(`${t('error')}: ${err.message}`);
    process.exit(1);
  }
}

main().catch((err) => {
  error(`${t('error')}: ${err.message}`);
  process.exit(1);
});
