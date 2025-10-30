import { createI18n } from 'vue-i18n';
import cn from './zh-CN';
import tw from './zh-TW';
import en from './en-US';

export const LOCALE_OPTIONS = [
  { label: '简体中文', value: 'zh-CN' },
  { label: '繁體中文', value: 'zh-TW' },
  { label: 'English', value: 'en-US' },
];

// 获取系统语言并映射到支持的语言
export const getSystemLocale = () => {
  const systemLang = navigator.language || 'zh-CN';

  // 精确匹配优先
  const exactMatch: Record<string, string> = {
    'zh-CN': 'zh-CN',
    'zh-TW': 'zh-TW',
    'zh-HK': 'zh-TW',
    'zh-MO': 'zh-TW',
    'zh-SG': 'zh-CN',
    'en-US': 'en-US',
    'en-GB': 'en-US',
    'en-CA': 'en-US',
    'en-AU': 'en-US',
  };

  // 语言代码匹配（去掉地区后缀）
  const langCode = systemLang.split('-')[0];
  const languageMatch: Record<string, string> = {
    zh: 'zh-CN',
    en: 'en-US',
  };

  return exactMatch[systemLang] || languageMatch[langCode] || 'zh-CN';
};

const defaultLocale = localStorage.getItem('arco-locale') || getSystemLocale();

const i18n = createI18n({
  locale: defaultLocale,
  fallbackLocale: 'zh-CN',
  legacy: false,
  allowComposition: true,
  messages: {
    'zh-CN': cn,
    'zh-TW': tw,
    'en-US': en,
  },
});

export default i18n;
