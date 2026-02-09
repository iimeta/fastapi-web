import { defineStore } from 'pinia';
import { Notification } from '@arco-design/web-vue';
import type { NotificationReturn } from '@arco-design/web-vue/es/notification/interface';
import type { RouteRecordNormalized } from 'vue-router';
import defaultSettings from '@/config/settings.json';
import { getMenuList } from '@/api/auth';
import {
  querySiteConfig,
  Carousel,
  Announcement,
  Document,
} from '@/api/site_config';
import { AppState } from './types';

const useAppStore = defineStore('app', {
  state: (): AppState => ({ ...defaultSettings, config: {} }),

  getters: {
    appCurrentSetting(state: AppState): AppState {
      return { ...state };
    },
    appDevice(state: AppState) {
      return state.device;
    },
    appAsyncMenus(state: AppState): RouteRecordNormalized[] {
      return state.serverMenu as unknown as RouteRecordNormalized[];
    },
    getDomain(state: AppState): string | undefined {
      return state.config.domain;
    },
    getTitle(state: AppState): string {
      return state.config.title || '';
    },
    getLogo(state: AppState): string {
      return state.config.logo || '';
    },
    getFavicon(state: AppState): string {
      return state.config.favicon || '';
    },
    getAvatar(state: AppState): string {
      return state.config.avatar || '';
    },
    getBgImg(state: AppState): string {
      return state.config.bg_img || '';
    },
    getCopyright(state: AppState): string | undefined {
      return (
        state.config.copyright ||
        'Copyright © 2023-2026 IIM. All Rights Reserved.'
      );
    },
    getJumpUrl(state: AppState): string | undefined {
      return (
        state.config.jump_url ||
        (state.config.domain ? undefined : 'https://www.fastapi.ai')
      );
    },
    getIcpBeian(state: AppState): string | undefined {
      return state.config.icp_beian;
    },
    getGaBeian(state: AppState): string | undefined {
      return state.config.ga_beian;
    },
    getRegisterTips(state: AppState): string {
      return state.config.register_tips || '';
    },
    getDefaultLanguage(state: AppState): string | undefined {
      return state.config.default_language;
    },
    getCurrencySymbol(state: AppState): string | undefined {
      return state.config.currency_symbol;
    },
    getCarousel1Title(state: AppState): string | undefined {
      return state.config.carousel1_title;
    },
    getCarousels1(state: AppState): Carousel[] | undefined {
      return (
        state.config.carousels1 || [
          {
            image_url: 'https://fastapi.ai/public/images/zyyun.png',
            jump_url: 'https://www.zyyun.com/cart?fid=3&gid=53',
          },
          {
            image_url: 'https://fastapi.ai/public/images/zyyun.png',
            jump_url: 'https://www.zyyun.com/cart?fid=3&gid=54',
          },
          {
            image_url: 'https://fastapi.ai/public/images/zyyun.png',
            jump_url: 'https://www.zyyun.com/cart?fid=6&gid=15',
          },
        ]
      );
    },
    getCarousel2Title(state: AppState): string | undefined {
      return state.config.carousel2_title;
    },
    getCarousels2(state: AppState): Carousel[] | undefined {
      return (
        state.config.carousels2 || [
          {
            image_url: 'https://fastapi.ai/Author.png',
            jump_url: 'https://github.com/iimeta/fastapi',
          },
          {
            image_url: 'https://fastapi.ai/AuthorQQ.png',
            jump_url: 'https://github.com/iimeta/fastapi',
          },
        ]
      );
    },
    getAnnouncementTitle(state: AppState): string | undefined {
      return state.config.announcement_title;
    },
    getAnnouncementMoreUrl(state: AppState): string | undefined {
      return (
        state.config.announcement_more_url ||
        (state.config.announcement_title && state.config.domain
          ? undefined
          : 'https://github.com/iimeta/fastapi/releases')
      );
    },
    getAnnouncements(state: AppState): Announcement[] | undefined {
      return (
        state.config.announcements || [
          {
            content: 'v2.1.0 版本发布啦! 啦!! 啦!!!',
            jump_url: 'https://github.com/iimeta/fastapi/releases/tag/v2.1.0',
          },
          {
            content: 'v2.0.0 版本发布啦! 啦!! 啦!!!',
            jump_url: 'https://github.com/iimeta/fastapi/releases/tag/v2.0.0',
          },
          {
            content: 'v1.7.0 版本发布啦! 啦!! 啦!!!',
            jump_url: 'https://github.com/iimeta/fastapi/releases/tag/v1.7.0',
          },
        ]
      );
    },
    getDocumentTitle(state: AppState): string | undefined {
      return state.config.document_title;
    },
    getDocumentMoreUrl(state: AppState): string | undefined {
      return (
        state.config.document_more_url ||
        (state.config.document_title && state.config.domain
          ? undefined
          : 'https://www.fastapi.ai')
      );
    },
    getDocuments(state: AppState): Document[] | undefined {
      return (
        state.config.documents || [
          {
            title: '产品概要',
            jump_url: 'https://www.fastapi.ai/guide/why.html',
          },
          {
            title: '常见问题',
            jump_url: 'https://www.fastapi.ai/guide/faq.html',
          },
          {
            title: '接入流程',
            jump_url: 'https://www.fastapi.ai/guide/',
          },
          {
            title: '接口文档',
            jump_url: 'https://www.fastapi.ai/api/',
          },
        ]
      );
    },
    getRechargeTips(state: AppState): string {
      return state.config.recharge_tips || '';
    },
  },

  actions: {
    // Update app settings
    updateSettings(partial: Partial<AppState>) {
      // @ts-ignore-next-line
      this.$patch(partial);
    },

    // Change theme color
    toggleTheme(dark: boolean) {
      if (dark) {
        this.theme = 'dark';
        document.body.setAttribute('arco-theme', 'dark');
      } else {
        this.theme = 'light';
        document.body.removeAttribute('arco-theme');
      }
    },
    toggleDevice(device: string) {
      this.device = device;
    },
    toggleMenu(value: boolean) {
      this.hideMenu = value;
    },
    async fetchServerMenuConfig() {
      let notifyInstance: NotificationReturn | null = null;
      try {
        notifyInstance = Notification.info({
          id: 'menuNotice', // Keep the instance id the same
          content: 'loading',
          closable: true,
        });
        const { data } = await getMenuList();
        this.serverMenu = data;
        notifyInstance = Notification.success({
          id: 'menuNotice',
          content: 'success',
          closable: true,
        });
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        notifyInstance = Notification.error({
          id: 'menuNotice',
          content: 'error',
          closable: true,
        });
      }
    },
    clearServerMenu() {
      this.serverMenu = [];
    },
    /**
     * 初始化系统配置信息
     */
    init() {
      querySiteConfig({
        domain: window.location.hostname,
      }).then((res) => {
        this.config = {
          domain: res.data.domain,
          title: res.data.title || '智元 Fast API',
          logo: res.data.logo || '/logo.png',
          favicon: res.data.favicon || '/favicon.ico',
          avatar: res.data.avatar || '/avatar.png',
          bg_img: res.data.bg_img || '/bgimg.jpg',
          copyright: res.data.copyright,
          jump_url: res.data.jump_url,
          keywords: res.data.keywords,
          description: res.data.description,
          icp_beian: res.data.icp_beian,
          ga_beian: res.data.ga_beian,
          register_tips: res.data.register_tips,
          default_language: res.data.default_language,
          currency_symbol: res.data.currency_symbol || '$',
          carousel1_title:
            res.data.carousel1_title ||
            (res.data.domain ? undefined : '赞助商'),
          carousels1: res.data.carousels1,
          carousel2_title:
            res.data.carousel2_title || (res.data.domain ? undefined : '作者'),
          carousels2: res.data.carousels2,
          announcement_title:
            res.data.announcement_title ||
            (res.data.domain ? undefined : '公告'),
          announcement_more_url: res.data.announcement_more_url,
          announcements: res.data.announcements,
          document_title:
            res.data.document_title ||
            (res.data.domain ? undefined : '使用指南'),
          document_more_url: res.data.document_more_url,
          documents: res.data.documents,
          recharge_tips: res.data.recharge_tips,
        };
        document.title = res.data.title || '智元 Fast API';
        document
          .querySelector('link[rel="shortcut icon"]')
          ?.setAttribute('href', res.data.favicon || '/favicon.ico');
        document
          .querySelector('meta[name="keywords"]')
          ?.setAttribute(
            'content',
            res.data.keywords ||
              '智元,IIMETA,IIM,DEEPSEEK,AI,FAST,API,CHAT,GPT,AGI,LLM,AIGC,OPENAI,AZURE,GEMINI,人工智能,元宇宙,大模型,文心一言,讯飞星火,通义千问,智谱GLM,豆包,火山引擎'
          );
        document
          .querySelector('meta[name="description"]')
          ?.setAttribute(
            'content',
            res.data.description ||
              '智元 Fast API 是企业级 LLM API 快速集成系统，支持DeepSeek、OpenAI、Azure、文心一言、讯飞星火、通义千问、智谱GLM、Gemini、豆包以及OpenAI格式的模型等，简洁的页面风格，轻量高效且稳定，支持Docker一键部署。业务系统只需要按照统一API标准，对接一次的开发工作量，即可无缝对接N个大模型，无需考虑N个大模型背后的各种复杂逻辑等等，可大大降低开发和维护成本...'
          );
      });
    },
  },
});

export default useAppStore;
