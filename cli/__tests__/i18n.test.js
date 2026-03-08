import { t, setLanguage, getCurrentLanguage, getSupportedLanguages, SUPPORTED_LANGS } from '../i18n.js';

describe('i18n Module', () => {
  describe('Supported Languages', () => {
    it('should have 7 languages', () => {
      const langs = getSupportedLanguages();
      expect(Object.keys(langs)).toHaveLength(7);
    });

    it('should have Spanish', () => {
      const langs = getSupportedLanguages();
      expect(langs).toHaveProperty('es');
    });

    it('should have English', () => {
      const langs = getSupportedLanguages();
      expect(langs).toHaveProperty('en');
    });

    it('should have Catalan', () => {
      const langs = getSupportedLanguages();
      expect(langs).toHaveProperty('ca');
    });

    it('should have Basque', () => {
      const langs = getSupportedLanguages();
      expect(langs).toHaveProperty('eu');
    });

    it('should have Galician', () => {
      const langs = getSupportedLanguages();
      expect(langs).toHaveProperty('gl');
    });

    it('should have Andalusian', () => {
      const langs = getSupportedLanguages();
      expect(langs).toHaveProperty('an');
    });

    it('should have Japanese', () => {
      const langs = getSupportedLanguages();
      expect(langs).toHaveProperty('ja');
    });
  });

  describe('Language Objects', () => {
    it('all languages should have name and flag', () => {
      const langs = getSupportedLanguages();
      Object.entries(langs).forEach(([code, lang]) => {
        expect(lang).toHaveProperty('name');
        expect(lang).toHaveProperty('flag');
      });
    });
  });

  describe('Set Language', () => {
    it('should set Spanish', () => {
      const result = setLanguage('es');
      expect(result).toBe(true);
    });

    it('should return Spanish as current', () => {
      setLanguage('es');
      expect(getCurrentLanguage()).toBe('es');
    });

    it('should reject invalid language', () => {
      const result = setLanguage('invalid');
      expect(result).toBe(false);
    });
  });

  describe('Translation Function', () => {
    it('English title should contain YACS', () => {
      setLanguage('en');
      const title = t('title');
      expect(title).toContain('YACS');
    });

    it('should return default value for nonexistent key', () => {
      const result = t('nonexistent', 'default');
      expect(result).toBe('default');
    });
  });

  describe('All Languages', () => {
    const requiredKeys = [
      'title',
      'availableSkills',
      'categories',
      'selectLocation',
      'selectLocationMessage',
      'homeDirectory',
      'customRepository',
      'selectSkills',
      'selectSkillsHint',
      'selectSkillsMessage',
      'enterCustomPath',
      'pathEmpty',
      'pathNotExists',
      'review',
      'destination',
      'totalSkills',
      'proceedInstallation',
      'installing',
      'completed',
      'installedAt',
      'noSkillsSelected',
      'installationCancelled',
      'operationCancelled',
      'invalidSelection',
      'error',
    ];

    Object.keys(SUPPORTED_LANGS).forEach((lang) => {
      it(`Language ${lang} should have all required keys`, () => {
        setLanguage(lang);
        let allKeysFound = true;
        requiredKeys.forEach((key) => {
          if (t(key) === key) {
            allKeysFound = false;
          }
        });
        expect(allKeysFound).toBe(true);
      });
    });
  });
});
