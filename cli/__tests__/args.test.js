import { parseArgs, resolveCli, resolveSkills, resolveAgents } from '../src/resolvers.js';
import { getSkills, getAgents } from '../src/discovery.js';

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

  it('should parse --cli flag', () => {
    const result = parseArgs(['--cli', 'gemini']);
    expect(result.cli).toBe('gemini');
    expect(result.unattended).toBe(true);
  });

  it('should parse -c short form', () => {
    const result = parseArgs(['-c', 'codex']);
    expect(result.cli).toBe('codex');
    expect(result.unattended).toBe(true);
  });

  it('should return cli: null when not provided', () => {
    const result = parseArgs([]);
    expect(result.cli).toBeNull();
  });

  it('should parse --cli alongside other flags', () => {
    const result = parseArgs(['--cli', 'copilot', '--path', 'home', '--skills', 'all']);
    expect(result.cli).toBe('copilot');
    expect(result.path).toBe('home');
    expect(result.skills).toBe('all');
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

describe('Agent Parser', () => {
  it('should return agents: null when not provided', () => {
    const result = parseArgs([]);
    expect(result.agents).toBeNull();
  });

  it('should parse --agents with all', () => {
    const result = parseArgs(['--agents', 'all']);
    expect(result.agents).toBe('all');
    expect(result.unattended).toBe(true);
  });

  it('should parse -a short form', () => {
    const result = parseArgs(['-a', 'backend-expert']);
    expect(result.agents).toBe('backend-expert');
    expect(result.unattended).toBe(true);
  });

  it('should parse --agents alongside --skills', () => {
    const result = parseArgs(['--path', 'home', '--skills', 'all', '--agents', 'all']);
    expect(result.skills).toBe('all');
    expect(result.agents).toBe('all');
    expect(result.unattended).toBe(true);
  });
});

describe('CLI Resolution', () => {
  it('should default to claude when no CLI specified', () => {
    const result = resolveCli(null);
    expect(result.name).toBe('Claude Code');
    expect(result.homeDir).toBe('.claude');
  });

  it('should resolve claude target', () => {
    const result = resolveCli('claude');
    expect(result.name).toBe('Claude Code');
    expect(result.homeDir).toBe('.claude');
  });

  it('should resolve gemini target', () => {
    const result = resolveCli('gemini');
    expect(result.name).toBe('Gemini CLI');
    expect(result.homeDir).toBe('.gemini');
  });

  it('should resolve codex target', () => {
    const result = resolveCli('codex');
    expect(result.name).toBe('Codex CLI');
    expect(result.homeDir).toBe('.codex');
  });

  it('should resolve copilot target', () => {
    const result = resolveCli('copilot');
    expect(result.name).toBe('GitHub Copilot');
    expect(result.homeDir).toBe('.copilot');
  });

  it('should be case-insensitive', () => {
    const result = resolveCli('GEMINI');
    expect(result.name).toBe('Gemini CLI');
  });

  it('should throw for unknown CLI target', () => {
    expect(() => resolveCli('unknown')).toThrow('Unknown CLI target');
  });
});

describe('Agent Resolution', () => {
  const allAgents = getAgents();

  it('should resolve "all" to all agents', () => {
    const result = resolveAgents('all', allAgents);
    expect(result.length).toBe(allAgents.length);
  });

  it('should resolve a single agent by name', () => {
    if (allAgents.length > 0) {
      const result = resolveAgents(allAgents[0].name, allAgents);
      expect(result.length).toBe(1);
      expect(result[0].name).toBe(allAgents[0].name);
    }
  });

  it('should resolve comma-separated agent names', () => {
    if (allAgents.length >= 2) {
      const result = resolveAgents(`${allAgents[0].name},${allAgents[1].name}`, allAgents);
      expect(result.length).toBe(2);
    }
  });

  it('should throw for unknown agent', () => {
    expect(() => resolveAgents('nonexistent-agent-xyz', allAgents)).toThrow();
  });

  it('should deduplicate agents', () => {
    if (allAgents.length > 0) {
      const result = resolveAgents(`${allAgents[0].name},${allAgents[0].name}`, allAgents);
      expect(result.length).toBe(1);
    }
  });

  it('should throw if rawAgents is null', () => {
    expect(() => resolveAgents(null, allAgents)).toThrow();
  });
});
