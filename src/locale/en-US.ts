import localeMessageBox from '@/components/message-box/locale/en-US';
import localeLogin from '@/views/login/locale/en-US';

import localeWorkplace from '@/views/dashboard/workplace/locale/en-US';

import localeUserInfo from '@/views/user/info/locale/en-US';
import localeUserSetting from '@/views/user/setting/locale/en-US';

import localeUser from '@/views/user/locale/en-US';
import localeApp from '@/views/app/locale/en-US';
import localeModel from '@/views/model/locale/en-US';
import localeKey from '@/views/key/locale/en-US';

import localeSettings from './en-US/settings';

export default {
  'menu.dashboard': 'Dashboard',
  'menu.server.dashboard': 'Dashboard-Server',
  'menu.server.workplace': 'Workplace-Server',
  'menu.server.monitor': 'Monitor-Server',
  'menu.list': 'List',
  'menu.result': 'Result',
  'menu.exception': 'Exception',
  'menu.form': 'Form',
  'menu.profile': 'Profile',
  'menu.visualization': 'Data Visualization',
  'menu.user.center': 'User Center',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': 'FAQ',
  'navbar.docs': 'Docs',
  'navbar.action.locale': 'Switch to English',
  // size
  'searchTable.size.mini': 'mini',
  'searchTable.size.small': 'small',
  'searchTable.size.medium': 'middle',
  'searchTable.size.large': 'large',
  // actions
  'searchTable.actions.refresh': 'refresh',
  'searchTable.actions.density': 'density',
  'searchTable.actions.columnSetting': 'columnSetting',
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
