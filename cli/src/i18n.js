import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const I18N_DIR = path.join(__dirname, '..', 'i18n');

// Supported languages
const SUPPORTED_LANGS = {
  es: { name: 'Español', flag: '🇪🇸' },
  en: { name: 'English', flag: '🇬🇧' },
  ca: { name: 'Català', flag: '🇨🇦' },
  eu: { name: 'Euskera', flag: '🇪🇺' },
  gl: { name: 'Galego', flag: '🇬🇦' },
  an: { name: 'Andaluz', flag: '🇦🇳' },
  ja: { name: '日本語', flag: '🇯🇵' },
};

// Load all translations
const translations = {};
Object.keys(SUPPORTED_LANGS).forEach((lang) => {
  const filePath = path.join(I18N_DIR, `${lang}.json`);
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    translations[lang] = JSON.parse(content);
  } catch (err) {
    console.error(`Error loading language file: ${lang}`, err.message);
  }
});

// Detect system language
function detectSystemLanguage() {
  const locale = (process.env.LANG || process.env.LANGUAGE || 'en_US').split('.')[0].toLowerCase();

  // Map locale to our supported languages
  if (locale.startsWith('es')) return 'es';
  if (locale.startsWith('en')) return 'en';
  if (locale.startsWith('ca')) return 'ca';
  if (locale.startsWith('eu')) return 'eu';
  if (locale.startsWith('gl')) return 'gl';
  if (locale.startsWith('an')) return 'an';

  // Default to English
  return 'en';
}

// Current language
let currentLanguage = detectSystemLanguage();

// Get the i18n object for the current language
function getI18n() {
  return translations[currentLanguage] || translations['en'];
}

// Set language
function setLanguage(lang) {
  if (SUPPORTED_LANGS[lang]) {
    currentLanguage = lang;
    return true;
  }
  return false;
}

// Get a translation string
function t(key, defaultValue = key) {
  const i18n = getI18n();
  return i18n[key] || translations['en']?.[key] || defaultValue;
}

// Get current language
function getCurrentLanguage() {
  return currentLanguage;
}

// Get supported languages
function getSupportedLanguages() {
  return SUPPORTED_LANGS;
}

export {
  t,
  setLanguage,
  getCurrentLanguage,
  getSupportedLanguages,
  detectSystemLanguage,
  SUPPORTED_LANGS,
};
