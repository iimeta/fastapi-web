import type { RouteRecordNormalized } from 'vue-router';
import { Carousel, Announcement, Document } from '@/api/site_config';

export interface Config {
  title?: string;
  logo?: string;
  favicon?: string;
  avatar?: string;
  bg_img?: string;
  copyright?: string;
  jump_url?: string;
  keywords?: string;
  description?: string;
  icp_beian?: string;
  ga_beian?: string;
  register_tips?: string;
  carousel1_title?: string;
  carousels1?: Carousel[];
  carousel2_title?: string;
  carousels2?: Carousel[];
  announcement_title?: string;
  announcement_more_url?: string;
  announcements?: Announcement[];
  document_title?: string;
  document_more_url?: string;
  documents?: Document[];
}

export interface AppState {
  theme: string;
  colorWeak: boolean;
  navbar: boolean;
  menu: boolean;
  topMenu: boolean;
  hideMenu: boolean;
  menuCollapse: boolean;
  autoOpen: boolean;
  footer: boolean;
  themeColor: string;
  menuWidth: number;
  globalSettings: boolean;
  device: string;
  tabBar: boolean;
  menuFromServer: boolean;
  serverMenu: RouteRecordNormalized[];
  [key: string]: unknown;
  config: Config;
}
