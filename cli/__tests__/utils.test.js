import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILLS_ROOT = path.join(__dirname, '../../skills');
const AGENTS_ROOT = path.join(__dirname, '../../agents');

describe('Skills Directory', () => {
  it('should have skills directory', () => {
    expect(fs.existsSync(SKILLS_ROOT)).toBe(true);
  });

  it('should have skill categories', () => {
    const categories = fs.readdirSync(SKILLS_ROOT).filter((f) => {
      return fs.statSync(path.join(SKILLS_ROOT, f)).isDirectory();
    });
    expect(categories.length).toBeGreaterThan(0);
  });

  it('should have expected categories', () => {
    const categories = fs.readdirSync(SKILLS_ROOT).filter((f) => {
      return fs.statSync(path.join(SKILLS_ROOT, f)).isDirectory();
    });

    const expectedCategories = [
      'quality-and-security',
      'development',
      'analisis-design-architecture',
      'idea-confrontation-and-debate',
      'data-and-interpretation',
    ];

    expectedCategories.forEach((cat) => {
      expect(categories).toContain(cat);
    });
  });

  it('should have SKILL.md files in all skills', () => {
    const categories = fs.readdirSync(SKILLS_ROOT).filter((f) => {
      return fs.statSync(path.join(SKILLS_ROOT, f)).isDirectory();
    });

    categories.forEach((category) => {
      const categoryPath = path.join(SKILLS_ROOT, category);
      const skills = fs.readdirSync(categoryPath).filter((f) => {
        return fs.statSync(path.join(categoryPath, f)).isDirectory();
      });

      skills.forEach((skill) => {
        const skillPath = path.join(categoryPath, skill);
        const filesInSkill = fs.readdirSync(skillPath);
        const hasSkillManifest = filesInSkill.some((file) => file.toLowerCase() === 'skill.md');
        expect(hasSkillManifest).toBe(true);
      });
    });
  });

  it('should have at least 15 skills', () => {
    let totalSkills = 0;
    const categories = fs.readdirSync(SKILLS_ROOT).filter((f) => {
      return fs.statSync(path.join(SKILLS_ROOT, f)).isDirectory();
    });

    categories.forEach((category) => {
      const categoryPath = path.join(SKILLS_ROOT, category);
      const skills = fs.readdirSync(categoryPath).filter((f) => {
        return fs.statSync(path.join(categoryPath, f)).isDirectory();
      });
      totalSkills += skills.length;
    });

    expect(totalSkills).toBeGreaterThanOrEqual(15);
  });
});

describe('Agents Directory', () => {
  it('should have agents directory', () => {
    expect(fs.existsSync(AGENTS_ROOT)).toBe(true);
  });

  it('should have at least 1 agent', () => {
    const agents = fs.readdirSync(AGENTS_ROOT).filter((f) => {
      return fs.statSync(path.join(AGENTS_ROOT, f)).isDirectory();
    });
    expect(agents.length).toBeGreaterThan(0);
  });

  it('should have expected agents', () => {
    const agents = fs.readdirSync(AGENTS_ROOT).filter((f) => {
      return fs.statSync(path.join(AGENTS_ROOT, f)).isDirectory();
    });

    const expectedAgents = [
      'backend-expert',
      'frontend-expert',
      'infra-expert',
      'security-expert',
      'qa-expert',
    ];

    expectedAgents.forEach((agent) => {
      expect(agents).toContain(agent);
    });
  });

  it('should have AGENT.md files in all agent directories', () => {
    const agents = fs.readdirSync(AGENTS_ROOT).filter((f) => {
      return fs.statSync(path.join(AGENTS_ROOT, f)).isDirectory();
    });

    agents.forEach((agentName) => {
      const agentPath = path.join(AGENTS_ROOT, agentName);
      const files = fs.readdirSync(agentPath);
      const hasAgentMd = files.some((f) => f.toLowerCase() === 'agent.md');
      expect(hasAgentMd).toBe(true);
    });
  });
});

describe('i18n Directory', () => {
  const I18N_ROOT = path.join(__dirname, '../i18n');

  it('should have i18n directory', () => {
    expect(fs.existsSync(I18N_ROOT)).toBe(true);
  });

  it('should have translation files for all languages', () => {
    const languages = ['es', 'en', 'ca', 'eu', 'gl', 'an', 'ja'];
    languages.forEach((lang) => {
      const filePath = path.join(I18N_ROOT, `${lang}.json`);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  it('should have valid JSON in translation files', () => {
    const languages = ['es', 'en', 'ca', 'eu', 'gl', 'an', 'ja'];
    languages.forEach((lang) => {
      const filePath = path.join(I18N_ROOT, `${lang}.json`);
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(() => JSON.parse(content)).not.toThrow();
    });
  });

  it('should have same keys in all translation files', () => {
    const languages = ['es', 'en', 'ca', 'eu', 'gl', 'an', 'ja'];
    const allKeys = {};

    languages.forEach((lang) => {
      const filePath = path.join(I18N_ROOT, `${lang}.json`);
      const content = fs.readFileSync(filePath, 'utf-8');
      const translation = JSON.parse(content);
      allKeys[lang] = Object.keys(translation).sort();
    });

    const firstLangKeys = allKeys[languages[0]];
    languages.slice(1).forEach((lang) => {
      expect(allKeys[lang]).toEqual(firstLangKeys);
    });
  });

  it('should have at least 20 translation keys', () => {
    const filePath = path.join(I18N_ROOT, 'en.json');
    const content = fs.readFileSync(filePath, 'utf-8');
    const translation = JSON.parse(content);
    expect(Object.keys(translation).length).toBeGreaterThanOrEqual(20);
  });
});
