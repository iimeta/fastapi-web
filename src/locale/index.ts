import { createI18n } from 'vue-i18n';
import cn from './zh-CN';
import tw from './zh-TW';
import en from './en-US';

export const LOCALE_OPTIONS = [
  { label: '简体中文', value: 'zh-CN' },
  { label: '繁體中文', value: 'zh-TW' },
  { label: 'English', value: 'en-US' },
];
const defaultLocale = localStorage.getItem('arco-locale') || 'zh-CN';

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
