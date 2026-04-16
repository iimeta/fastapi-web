import type { App } from 'vue';
import IconApps from '~icons/lucide/layout-grid';
import IconKey from '~icons/lucide/key';
import IconKeyRound from '~icons/lucide/key-round';
import IconLayoutDashboard from '~icons/lucide/layout-dashboard';
import IconReceipt from '~icons/lucide/receipt';
import IconUsers from '~icons/lucide/users';
import IconFileText from '~icons/lucide/file-text';
import IconBox from '~icons/lucide/box';
import IconBot from '~icons/lucide/bot';
import IconActivity from '~icons/lucide/activity';
import IconComponent from '~icons/lucide/component';
import IconBoxes from '~icons/lucide/boxes';
import IconBell from '~icons/lucide/bell';
import IconChartBar from '~icons/lucide/chart-column-increasing';
import IconSettings from '~icons/lucide/settings';
import IconCalendarCheck from '~icons/lucide/calendar-check';
import IconUserRound from '~icons/lucide/user-round';
import IconMonitorCloud from '~icons/lucide/monitor-cloud';
import IconCommand from '~icons/lucide/command';
import IconCircleDollarSign from '~icons/lucide/circle-dollar-sign';
import IconCombine from '~icons/lucide/combine';

const menuIcons: Record<string, any> = {
  'lucide-layout-grid': IconApps,
  'lucide-key': IconKey,
  'lucide-key-round': IconKeyRound,
  'lucide-layout-dashboard': IconLayoutDashboard,
  'lucide-receipt-text': IconReceipt,
  'lucide-users': IconUsers,
  'lucide-file-text': IconFileText,
  'lucide-box': IconBox,
  'lucide-bot': IconBot,
  'lucide-activity': IconActivity,
  'lucide-component': IconComponent,
  'lucide-boxes': IconBoxes,
  'lucide-bell': IconBell,
  'lucide-chart-column-increasing': IconChartBar,
  'lucide-settings': IconSettings,
  'lucide-calendar-check': IconCalendarCheck,
  'lucide-user-round': IconUserRound,
  'lucide-monitor-cloud': IconMonitorCloud,
  'lucide-command': IconCommand,
  'lucide-circle-dollar-sign': IconCircleDollarSign,
  'lucide-combine': IconCombine,
};

export function registerMenuIcons(app: App) {
  Object.entries(menuIcons).forEach(([name, component]) => {
    app.component(name, component);
  });
}
