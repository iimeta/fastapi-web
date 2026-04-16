import type { App } from 'vue';
import IconApps from '~icons/lucide/layout-grid';
import IconKey from '~icons/lucide/key';
import IconKeyRound from '~icons/lucide/key-round';
import IconGauge from '~icons/lucide/gauge';
import IconReceipt from '~icons/lucide/receipt-text';
import IconBanknote from '~icons/lucide/banknote';
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
import IconListChecks from '~icons/lucide/list-checks';
import IconUser from '~icons/lucide/user';
import IconMonitor from '~icons/lucide/monitor';
import IconCommand from '~icons/lucide/command';
import IconCircleDollarSign from '~icons/lucide/circle-dollar-sign';

const menuIcons: Record<string, any> = {
  'lucide-layout-grid': IconApps,
  'lucide-key': IconKey,
  'lucide-key-round': IconKeyRound,
  'lucide-gauge': IconGauge,
  'lucide-receipt-text': IconReceipt,
  'lucide-banknote': IconBanknote,
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
  'lucide-list-checks': IconListChecks,
  'lucide-user': IconUser,
  'lucide-monitor': IconMonitor,
  'lucide-command': IconCommand,
  'lucide-circle-dollar-sign': IconCircleDollarSign,
};

export function registerMenuIcons(app: App) {
  Object.entries(menuIcons).forEach(([name, component]) => {
    app.component(name, component);
  });
}
