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
        list: { type: 'boolean' },
        help: { type: 'boolean', short: 'h' },
      },
      strict: false,
      allowPositionals: true,
    });

    const unattended = !!(values.language || values.path || values.skills || values.list);

    return {
      unattended,
      help: !!values.help,
      list: !!values.list,
      language: values.language || null,
      path: values.path || null,
      skills: values.skills || null,
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
      --list              List all available skills and exit
  -h, --help              Show this help message

Skill spec syntax:
  all                     Install all available skills
  skill1,skill2           Install specific skills by name
  @category               Install all skills in a category
  category:skill          Install a specific skill from a category
  @cat1,skill2            Mix category and individual selections

Examples:
  yacs --path home --skills all
  yacs -p home -s @development,code-reviewer
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

// Read skill description from SKILL.md
function getSkillDescription(skillPath) {
  const skillMdPath = path.join(skillPath, 'SKILL.md');
  if (fs.existsSync(skillMdPath)) {
    const content = fs.readFileSync(skillMdPath, 'utf-8');
    const lines = content.split('\n');
    // Get first line after title
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

// ============================================================================
// UNATTENDED MODE FUNCTIONS
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

function resolveInstallPath(rawPath) {
  if (!rawPath) {
    throw new Error('--path is required in unattended mode');
  }

  if (rawPath === 'home') {
    const skillsPath = path.join(HOME_DIR, '.claude', 'skills');
    return { path: skillsPath, source: 'home' };
  }

  // Resolve to absolute path
  const resolvedPath = path.resolve(rawPath);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Path does not exist: ${resolvedPath}`);
  }

  const skillsPath = path.join(resolvedPath, 'skills');
  return { path: skillsPath, source: 'custom' };
}

function resolveSkills(rawSkills, allSkills) {
  if (!rawSkills) {
    throw new Error('--skills is required in unattended mode');
  }

  const tokens = rawSkills.split(',').map(t => t.trim());
  const selected = [];
  const unrecognized = [];
  const allSkillsList = [];

  // Build flat list of all skills for quick lookup
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
      // Add all skills
      selected.push(...allSkillsList);
    } else if (token.startsWith('@')) {
      // Category selection: @development
      const categoryName = token.substring(1);
      const categorySkills = allSkillsList.filter(s => s.category === categoryName);

      if (categorySkills.length === 0) {
        unrecognized.push(`@${categoryName} (category not found)`);
      } else {
        selected.push(...categorySkills);
      }
    } else if (token.includes(':')) {
      // Specific skill: development:gamify
      const [category, skillName] = token.split(':', 2);
      const skill = allSkillsList.find(s => s.category === category && s.name === skillName);

      if (!skill) {
        unrecognized.push(`${token} (not found)`);
      } else {
        selected.push(skill);
      }
    } else {
      // Bare skill name: search across all categories
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

  // Deduplicate by id
  const uniqueSkills = Array.from(new Map(selected.map(s => [s.id, s])).values());

  return uniqueSkills;
}

// Interactive skill selection with interactive menu
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

      // Format the choice
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

    // Inquirer returns the values we specified (indices)
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

// Copy skill to destination
function copySkill(skillPath, destPath) {
  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true });
  }

  const skillName = path.basename(skillPath);
  const skillDestPath = path.join(destPath, skillName);

  // Remove existing if present
  if (fs.existsSync(skillDestPath)) {
    fs.rmSync(skillDestPath, { recursive: true, force: true });
  }

  // Copy skill folder
  fs.cpSync(skillPath, skillDestPath, { recursive: true });

  return skillDestPath;
}

// Get installation path from user
async function getInstallPath() {
  header(t('selectLocation'));

  const locChoice = await inquirer.prompt({
    type: 'rawlist',
    name: 'location',
    message: t('selectLocationMessage'),
    choices: [
      {
        name: t('homeDirectory'),
        value: 'home',
      },
      {
        name: t('customRepository'),
        value: 'custom',
      },
    ],
  });

  const location = locChoice.location;

  // Handle both direct value and index-based selection
  const isHome = location === 'home' || location === 0 || location === '0';
  const isCustom = location === 'custom' || location === 1 || location === '1';

  if (isHome) {
    const skillsPath = path.join(HOME_DIR, '.claude', 'skills');
    return { path: skillsPath, source: 'home' };
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

    const skillsPath = path.join(pathChoice.customPath, 'skills');
    return { path: skillsPath, source: 'custom' };
  }

  throw new Error(`${t('invalidSelection')}: ${location}`);
}

// Review and confirm selection
async function reviewSelection(selected, installPath) {
  header(t('review'));

  log(`${colors.bright}${t('destination')}:${colors.reset} ${installPath}`);
  log(`${colors.bright}${t('totalSkills')}:${colors.reset} ${selected.length}\n`);

  // Group by category
  const byCategory = {};
  selected.forEach((skill) => {
    if (!byCategory[skill.category]) {
      byCategory[skill.category] = [];
    }
    byCategory[skill.category].push(skill.name);
  });

  for (const [category, names] of Object.entries(byCategory)) {
    log(`${colors.yellow}${category}${colors.reset}`);
    names.forEach((name) => log(`  • ${name}`));
  }

  const confirmation = await inquirer.prompt({
    type: 'confirm',
    name: 'proceed',
    message: t('proceedInstallation'),
    default: true,
  });

  return confirmation.proceed;
}

// Main installation process
async function installSkills(selected, installPath) {
  header(t('installing'));

  for (const skill of selected) {
    try {
      copySkill(skill.path, installPath);
      success(`${skill.category}/${skill.name}`);
    } catch (err) {
      error(`${skill.category}/${skill.name}: ${err.message}`);
    }
  }

  header(t('completed'));
  log(`${t('installedAt')}:`);
  log(`  ${colors.bright}${installPath}${colors.reset}\n`);
}

// ============================================================================
// UNATTENDED MODE EXECUTION
// ============================================================================

async function runUnattended(args) {
  setLanguage(args.language || detectSystemLanguage());

  header(t('title'));

  const skills = getSkills();

  // Handle --list flag
  if (args.list) {
    printSkillList(skills);
    process.exit(0);
  }

  // Validate required arguments
  if (!args.path) {
    error(t('unattendedMissingPath'));
    process.exit(1);
  }

  if (!args.skills) {
    error(t('unattendedMissingSkills'));
    process.exit(1);
  }

  // Resolve installation path and skills
  const installPath = resolveInstallPath(args.path);
  const selected = resolveSkills(args.skills, skills);

  if (selected.length === 0) {
    error(t('unattendedNoSkillsMatched'));
    process.exit(1);
  }

  // Display summary (no confirmation prompt in unattended mode)
  log(`${colors.bright}${t('destination')}:${colors.reset} ${installPath.path}`);
  log(`${colors.bright}${t('totalSkills')}:${colors.reset} ${selected.length}\n`);

  // Group by category for display
  const byCategory = {};
  selected.forEach((skill) => {
    if (!byCategory[skill.category]) {
      byCategory[skill.category] = [];
    }
    byCategory[skill.category].push(skill.name);
  });

  for (const [category, names] of Object.entries(byCategory)) {
    log(`${colors.yellow}${category}${colors.reset}`);
    names.forEach((name) => log(`  • ${name}`));
  }

  log('');

  // Install
  await installSkills(selected, installPath.path);
  process.exit(0);
}

// ============================================================================
// INTERACTIVE MODE EXECUTION (refactored from original main)
// ============================================================================

async function runInteractive() {
  // Detect system language or allow user selection
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

  const skills = getSkills();
  const totalSkills = Object.values(skills).reduce((sum, arr) => sum + arr.length, 0);

  log(`${colors.bright}${t('availableSkills')}:${colors.reset} ${totalSkills}`);
  log(`${colors.bright}${t('categories')}:${colors.reset} ${Object.keys(skills).length}\n`);

  const installPath = await getInstallPath();
  const selected = await selectSkills(skills);

  if (selected.length === 0) {
    error(t('noSkillsSelected'));
    process.exit(1);
  }

  const proceed = await reviewSelection(selected, installPath.path);

  if (!proceed) {
    log(`\n❌ ${t('installationCancelled')}`);
    process.exit(0);
  }

  await installSkills(selected, installPath.path);
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
    // Handle user cancellation gracefully
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
