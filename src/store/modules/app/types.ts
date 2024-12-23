import type { RouteRecordNormalized } from 'vue-router';

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
