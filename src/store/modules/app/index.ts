import { defineStore } from 'pinia';
import { Notification } from '@arco-design/web-vue';
import type { NotificationReturn } from '@arco-design/web-vue/es/notification/interface';
import type { RouteRecordNormalized } from 'vue-router';
import defaultSettings from '@/config/settings.json';
import { getMenuList } from '@/api/user';
import { querySite, Carousel, Announcement } from '@/api/site_config';
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
    getTitle(state: AppState): string | undefined {
      return state.config?.title || '智元 Fast API';
    },
    getLogo(state: AppState): string | undefined {
      return state.config?.logo || '/logo.png';
    },
    getFavicon(state: AppState): string | undefined {
      return state.config?.favicon || '/favicon.ico';
    },
    getAvatar(state: AppState): string | undefined {
      return state.config?.avatar || '/avatar.png';
    },
    getBgImg(state: AppState): string | undefined {
      return state.config?.bg_img || '/bgimg.jpg';
    },
    getCopyright(state: AppState): string | undefined {
      return (
        state.config?.copyright ||
        'Copyright © 2023-2025 IIM. All Rights Reserved.'
      );
    },
    getJumpUrl(state: AppState): string | undefined {
      return state.config?.jump_url;
    },
    getIcpBeian(state: AppState): string | undefined {
      return state.config?.icp_beian;
    },
    getGaBeian(state: AppState): string | undefined {
      return state.config?.ga_beian;
    },
    getRegisterTips(state: AppState): string {
      return state.config?.register_tips || '';
    },
    getCarousel1Title(state: AppState): string | undefined {
      return state.config?.carousel1_title || '赞助商';
    },
    getCarousels1(state: AppState): Carousel[] | undefined {
      return state.config?.carousels1;
    },
    getCarousel2Title(state: AppState): string | undefined {
      return state.config?.carousel2_title || '作者';
    },
    getCarousels2(state: AppState): Carousel[] | undefined {
      return state.config?.carousels2;
    },
    getAnnouncementTitle(state: AppState): string | undefined {
      return state.config?.announcement_title || '公告';
    },
    getAnnouncementMoreUrl(state: AppState): string | undefined {
      return state.config?.announcement_more_url;
    },
    getAnnouncements(state: AppState): Announcement[] | undefined {
      return state.config?.announcements;
    },
    getDocumentTitle(state: AppState): string | undefined {
      return state.config?.document_title || '使用指南';
    },
    getDocumentMoreUrl(state: AppState): string | undefined {
      return state.config?.document_more_url;
    },
    getDocuments(state: AppState): Document[] | undefined {
      return state.config?.documents;
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
      querySite({
        domain: window.location.hostname,
      }).then((res) => {
        this.config = {
          title: res.data.title,
          logo: res.data.logo,
          favicon: res.data.favicon,
          avatar: res.data.avatar,
          bg_img: res.data.bg_img,
          copyright: res.data.copyright,
          jump_url: res.data.jump_url,
          keywords: res.data.keywords,
          description: res.data.description,
          icp_beian: res.data.icp_beian,
          ga_beian: res.data.ga_beian,
          register_tips: res.data.register_tips,
        };
        document.title = res.data.title || '智元 Fast API';
        document
          .querySelector('link[rel="shortcut icon"]')
          ?.setAttribute('href', res.data.favicon || '/favicon.ico');
        document
          .querySelector('meta[name="keywords"]')
          ?.setAttribute('content', res.data.keywords);
        document
          .querySelector('meta[name="description"]')
          ?.setAttribute('content', res.data.description);
      });
    },
  },
});

export default useAppStore;
