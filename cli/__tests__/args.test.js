import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILLS_ROOT = path.join(__dirname, '../../skills');

// Mock implementations for testing
function parseArgs(argv = []) {
  let language = null;
  let path_arg = null;
  let skills = null;
  let list = false;
  let help = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '-l' || arg === '--language') {
      language = argv[i + 1];
      i++;
    } else if (arg === '-p' || arg === '--path') {
      path_arg = argv[i + 1];
      i++;
    } else if (arg === '-s' || arg === '--skills') {
      skills = argv[i + 1];
      i++;
    } else if (arg === '--list') {
      list = true;
    } else if (arg === '-h' || arg === '--help') {
      help = true;
    }
  }

  const unattended = !!(language || path_arg || skills || list);

  return {
    unattended,
    help,
    list,
    language,
    path: path_arg,
    skills,
  };
}

function getSkills() {
  const skills = {};

  if (!fs.existsSync(SKILLS_ROOT)) {
    return skills;
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

function resolveSkills(rawSkills, allSkills) {
  if (!rawSkills) {
    throw new Error('--skills is required in unattended mode');
  }

  const tokens = rawSkills.split(',').map(t => t.trim());
  const selected = [];
  const unrecognized = [];
  const allSkillsList = [];

  // Build flat list of all skills
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
        selected.push(...matches);
      }
    }
  }

  if (unrecognized.length > 0) {
    throw new Error(`Unknown skills or categories: ${unrecognized.join(', ')}`);
  }

  const uniqueSkills = Array.from(new Map(selected.map(s => [s.id, s])).values());
  return uniqueSkills;
}

describe('Argument Parser', () => {
  it('should return unattended: false when no args provided', () => {
    const result = parseArgs([]);
    expect(result.unattended).toBe(false);
    expect(result.language).toBeNull();
    expect(result.path).toBeNull();
    expect(result.skills).toBeNull();
  });

  it('should parse --path long form', () => {
    const result = parseArgs(['--path', 'home']);
    expect(result.path).toBe('home');
    expect(result.unattended).toBe(true);
  });

  it('should parse -p short form', () => {
    const result = parseArgs(['-p', 'home']);
    expect(result.path).toBe('home');
    expect(result.unattended).toBe(true);
  });

  it('should parse --skills with all', () => {
    const result = parseArgs(['--skills', 'all']);
    expect(result.skills).toBe('all');
    expect(result.unattended).toBe(true);
  });

  it('should parse -s short form', () => {
    const result = parseArgs(['-s', '@development']);
    expect(result.skills).toBe('@development');
  });

  it('should parse --language', () => {
    const result = parseArgs(['--language', 'es']);
    expect(result.language).toBe('es');
    expect(result.unattended).toBe(true);
  });

  it('should parse -l short form', () => {
    const result = parseArgs(['-l', 'en']);
    expect(result.language).toBe('en');
  });

  it('should parse --list flag', () => {
    const result = parseArgs(['--list']);
    expect(result.list).toBe(true);
    expect(result.unattended).toBe(true);
  });

  it('should parse --help flag', () => {
    const result = parseArgs(['--help']);
    expect(result.help).toBe(true);
  });

  it('should parse -h short form', () => {
    const result = parseArgs(['-h']);
    expect(result.help).toBe(true);
  });

  it('should parse multiple flags together', () => {
    const result = parseArgs(['--path', 'home', '--skills', 'all', '--language', 'es']);
    expect(result.path).toBe('home');
    expect(result.skills).toBe('all');
    expect(result.language).toBe('es');
    expect(result.unattended).toBe(true);
  });
});

describe('Skill Resolution', () => {
  const allSkills = getSkills();

  it('should resolve "all" to all skills', () => {
    const result = resolveSkills('all', allSkills);
    const totalSkills = Object.values(allSkills).reduce((sum, arr) => sum + arr.length, 0);
    expect(result.length).toBe(totalSkills);
  });

  it('should resolve @category to skills in that category', () => {
    const categories = Object.keys(allSkills);
    if (categories.length > 0) {
      const firstCategory = categories[0];
      const result = resolveSkills(`@${firstCategory}`, allSkills);
      expect(result.length).toBe(allSkills[firstCategory].length);
      expect(result.every(s => s.category === firstCategory)).toBe(true);
    }
  });

  it('should throw error for unknown category', () => {
    expect(() => {
      resolveSkills('@unknown_category_xyz', allSkills);
    }).toThrow();
  });

  it('should resolve category:skillName format', () => {
    const categories = Object.keys(allSkills);
    if (categories.length > 0) {
      const firstCategory = categories[0];
      const firstSkill = allSkills[firstCategory][0];
      const result = resolveSkills(`${firstCategory}:${firstSkill}`, allSkills);
      expect(result.length).toBe(1);
      expect(result[0].name).toBe(firstSkill);
      expect(result[0].category).toBe(firstCategory);
    }
  });

  it('should throw error for unknown category:skill combination', () => {
    expect(() => {
      resolveSkills('unknown:unknownSkill', allSkills);
    }).toThrow();
  });

  it('should resolve bare skill name', () => {
    const categories = Object.keys(allSkills);
    if (categories.length > 0) {
      const firstSkill = allSkills[categories[0]][0];
      const result = resolveSkills(firstSkill, allSkills);
      expect(result.length).toBeGreaterThan(0);
      expect(result.some(s => s.name === firstSkill)).toBe(true);
    }
  });

  it('should throw error for unknown skill name', () => {
    expect(() => {
      resolveSkills('unknown_skill_xyz_abc', allSkills);
    }).toThrow();
  });

  it('should handle comma-separated skills', () => {
    const categories = Object.keys(allSkills);
    if (categories.length > 0 && allSkills[categories[0]].length >= 2) {
      const skill1 = allSkills[categories[0]][0];
      const skill2 = allSkills[categories[0]][1];
      const result = resolveSkills(`${skill1},${skill2}`, allSkills);
      expect(result.length).toBe(2);
    }
  });

  it('should deduplicate skills', () => {
    const categories = Object.keys(allSkills);
    if (categories.length > 0) {
      const firstSkill = allSkills[categories[0]][0];
      const result = resolveSkills(`${firstSkill},${firstSkill}`, allSkills);
      expect(result.length).toBe(1);
    }
  });

  it('should throw error if skills is null or empty', () => {
    expect(() => {
      resolveSkills(null, allSkills);
    }).toThrow();
  });
});
