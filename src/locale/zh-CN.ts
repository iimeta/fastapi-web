import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';

import localeWorkplace from '@/views/dashboard/workplace/locale/zh-CN';

import localeUserInfo from '@/views/user/info/locale/zh-CN';
import localeUserSetting from '@/views/user/setting/locale/zh-CN';

import localeUser from '@/views/user/locale/zh-CN';
import localeApp from '@/views/app/locale/zh-CN';
import localeModel from '@/views/model/locale/zh-CN';
import localeKey from '@/views/key/locale/zh-CN';

import localeSettings from './zh-CN/settings';

export default {
  'menu.dashboard': '仪表盘',
  'menu.server.dashboard': '仪表盘-服务端',
  'menu.server.workplace': '工作台-服务端',
  'menu.server.monitor': '实时监控-服务端',
  'menu.list': '列表页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.user.center': '个人中心',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': '常见问题',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  // size
  'searchTable.size.mini': '迷你',
  'searchTable.size.small': '偏小',
  'searchTable.size.medium': '中等',
  'searchTable.size.large': '偏大',
  // actions
  'searchTable.actions.refresh': '刷新',
  'searchTable.actions.density': '密度',
  'searchTable.actions.columnSetting': '列设置',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,
  ...localeUserInfo,
  ...localeUserSetting,
  ...localeUser,
  ...localeApp,
  ...localeModel,
  ...localeKey,
};
