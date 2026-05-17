<script lang="tsx">
  import {
    defineComponent,
    ref,
    h,
    compile,
    computed,
    onMounted,
    onBeforeUnmount,
  } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter, RouteRecordRaw } from 'vue-router';
  import type { RouteMeta } from 'vue-router';
  import { useAppStore, useUserStore } from '@/store';
  import { listenerRouteChange } from '@/utils/route-listener';
  import { openWindow, regexUrl } from '@/utils';
  import useMenuTree from './use-menu-tree';

  export default defineComponent({
    emit: ['collapse'],
    setup() {
      const { t } = useI18n();
      const appStore = useAppStore();
      const userStore = useUserStore();
      const router = useRouter();
      const route = useRoute();
      const { menuTree } = useMenuTree();
      const collapsed = computed({
        get() {
          if (appStore.device === 'desktop') return appStore.menuCollapse;
          return false;
        },
        set(value: boolean) {
          appStore.updateSettings({ menuCollapse: value });
        },
      });

      const topMenu = computed(() => appStore.topMenu);
      const openKeys = ref<string[]>([]);
      const selectedKey = ref<string[]>([]);

      // 菜单分组配置
      // defaultCollapsed: 控制分组默认是否收起
      //   - boolean: 对所有角色生效
      //   - Record<string, boolean>: 按角色配置, 如 { admin: true, user: false }
      //   - 未配置时默认展开
      const menuGroups = [
        {
          title: '',
          icon: 'lucide-layout-dashboard',
          order: 10,
          routes: ['dashboard'],
        },
        {
          title: 'menu.group.core_assets',
          icon: 'lucide-box',
          order: 20,
          routes: ['model', 'model_agent', 'key', 'group'],
        },
        {
          title: 'menu.group.resource_market',
          icon: 'lucide-store',
          order: 30,
          roleOrders: {
            admin: 45,
          } as Record<string, number>,
          routes: ['model_square', 'group_square'],
          defaultCollapsed: {
            admin: true,
          },
        },
        {
          title: 'menu.group.data_operations',
          icon: 'lucide-chart-column-increasing',
          order: 40,
          routes: ['statistics', 'monitor'],
        },
        {
          title: 'menu.group.app_access',
          icon: 'lucide-layout-grid',
          order: 50,
          routes: ['app', 'app_key'],
          defaultCollapsed: {
            admin: true,
          },
        },
        {
          title: 'menu.group.invite',
          icon: 'lucide-gift',
          order: 56,
          routes: [
            'InviteRelations',
            'InviteRewards',
            'InviteApply',
            'ManageInviteRelations',
            'ManageInviteRewards',
            'ManageInviteApply',
          ],
          defaultCollapsed: {
            admin: true,
          },
        },
        {
          title: 'menu.group.finance',
          icon: 'lucide-banknote',
          order: 60,
          routes: ['BillList', 'DealRecordList'],
          defaultCollapsed: {
            admin: true,
          },
        },
        {
          title: 'menu.group.tasks_logs',
          icon: 'lucide-list-checks',
          order: 70,
          roleOrders: {
            admin: 42,
          } as Record<string, number>,
          routes: ['task', 'log'],
        },
        {
          title: 'menu.group.support',
          icon: 'lucide-headset',
          order: 75,
          routes: ['TicketCreate', 'TicketMyList', 'TicketList'],
          defaultCollapsed: {
            admin: true,
          },
        },
        {
          title: 'menu.group.system_config',
          icon: 'lucide-settings',
          order: 80,
          routes: ['user', 'notice', 'sys'],
        },
      ];

      // 解析分组的默认收起状态
      const getDefaultCollapsed = (group: (typeof menuGroups)[number]) => {
        const dc = (group as any).defaultCollapsed;
        if (dc === undefined || dc === null) return false;
        if (typeof dc === 'boolean') return dc;
        if (typeof dc === 'object') {
          const roleVal = dc[userStore.role];
          return roleVal !== undefined ? roleVal : false;
        }
        return false;
      };

      // 记录每个分组的收起状态, key 为 group.title
      const collapsedGroups = ref<Record<string, boolean>>({});

      // 初始化收起状态
      const initCollapsedState = () => {
        const state: Record<string, boolean> = {};
        menuGroups.forEach((group) => {
          if (group.title) {
            state[group.title] = getDefaultCollapsed(group);
          }
        });
        collapsedGroups.value = state;
      };
      initCollapsedState();

      const toggleGroup = (groupTitle: string) => {
        collapsedGroups.value[groupTitle] = !collapsedGroups.value[groupTitle];
      };

      // 原生事件委托处理分组标题点击和hover
      const menuRef = ref<HTMLElement | null>(null);

      const findGroupEl = (target: HTMLElement) => {
        if (
          target.closest('.arco-menu-item') ||
          target.closest('.arco-menu-inline-header') ||
          target.closest('.arco-menu-pop-header')
        ) {
          return null;
        }
        return target.closest('.menu-group--collapsible') as HTMLElement | null;
      };

      const handleMenuClick = (e: MouseEvent) => {
        const groupEl = findGroupEl(e.target as HTMLElement);
        if (!groupEl) return;
        const titleEl = groupEl.querySelector(
          '.arco-menu-group-title'
        ) as HTMLElement | null;
        if (!titleEl) return;
        const keyEl = titleEl.querySelector(
          '[data-group-key]'
        ) as HTMLElement | null;
        if (!keyEl) return;
        const groupKey = keyEl.getAttribute('data-group-key');
        if (groupKey) {
          e.stopPropagation();
          e.preventDefault();
          toggleGroup(groupKey);
        }
      };

      let lastHoverGroup: HTMLElement | null = null;
      let lastHoverTitle: HTMLElement | null = null;
      const handleMouseOver = (e: MouseEvent) => {
        const groupEl = findGroupEl(e.target as HTMLElement);
        if (groupEl === lastHoverGroup) return;
        if (lastHoverTitle) {
          lastHoverTitle.classList.remove('menu-group-title--hover');
        }
        if (lastHoverGroup) {
          lastHoverGroup.style.cursor = '';
        }
        lastHoverGroup = groupEl;
        if (groupEl) {
          const titleEl = groupEl.querySelector(
            '.arco-menu-group-title'
          ) as HTMLElement | null;
          lastHoverTitle = titleEl;
          if (titleEl) {
            titleEl.classList.add('menu-group-title--hover');
          }
          groupEl.style.cursor = 'pointer';
        } else {
          lastHoverTitle = null;
        }
      };
      const handleMouseLeave = () => {
        if (lastHoverTitle) {
          lastHoverTitle.classList.remove('menu-group-title--hover');
          lastHoverTitle = null;
        }
        if (lastHoverGroup) {
          lastHoverGroup.style.cursor = '';
          lastHoverGroup = null;
        }
      };

      onMounted(() => {
        menuRef.value?.addEventListener('click', handleMenuClick, true);
        menuRef.value?.addEventListener('mouseover', handleMouseOver);
        menuRef.value?.addEventListener('mouseleave', handleMouseLeave);
      });
      onBeforeUnmount(() => {
        menuRef.value?.removeEventListener('click', handleMenuClick, true);
        menuRef.value?.removeEventListener('mouseover', handleMouseOver);
        menuRef.value?.removeEventListener('mouseleave', handleMouseLeave);
      });

      const goto = (item: RouteRecordRaw) => {
        if (regexUrl.test(item.path)) {
          openWindow(item.path);
          selectedKey.value = [item.name as string];
          return;
        }
        const { hideInMenu, activeMenu } = item.meta as RouteMeta;
        if (route.name === item.name && !hideInMenu && !activeMenu) {
          selectedKey.value = [item.name as string];
          return;
        }
        router.push({
          name: item.name,
        });
      };

      const findMenuOpenKeys = (target: string) => {
        const result: string[] = [];
        let isFind = false;
        const backtrack = (item: RouteRecordRaw, keys: string[]) => {
          if (item.name === target) {
            isFind = true;
            result.push(...keys);
            return;
          }
          if (item.children?.length) {
            item.children.forEach((el) => {
              backtrack(el, [...keys, el.name as string]);
            });
          }
        };
        menuTree.value.forEach((el: RouteRecordRaw) => {
          if (isFind) return;
          backtrack(el, [el.name as string]);
        });
        return result;
      };

      listenerRouteChange((newRoute) => {
        const { requiresAuth, activeMenu, hideInMenu } = newRoute.meta;
        if (requiresAuth && (!hideInMenu || activeMenu)) {
          const menuOpenKeys = findMenuOpenKeys(
            (activeMenu || newRoute.name) as string
          );

          const keySet = new Set([...menuOpenKeys, ...openKeys.value]);
          openKeys.value = [...keySet];

          selectedKey.value = [
            activeMenu || menuOpenKeys[menuOpenKeys.length - 1],
          ];
        }
      }, true);

      const setCollapse = (val: boolean) => {
        if (appStore.device === 'desktop')
          appStore.updateSettings({ menuCollapse: val });
      };

      // 按分组组织菜单
      const groupedMenuTree = computed(() => {
        const grouped: any[] = [];
        const routeMap = new Map<string, RouteRecordRaw>();
        const collectRoutes = (routes: RouteRecordRaw[]) => {
          routes.forEach((menuRoute) => {
            if (menuRoute.name) {
              routeMap.set(menuRoute.name as string, menuRoute);
            }
            if (menuRoute.children?.length) {
              collectRoutes(menuRoute.children);
            }
          });
        };

        collectRoutes(menuTree.value);

        menuGroups
          .map((group, index) => ({
            ...group,
            index,
            order: group.roleOrders?.[userStore.role] ?? group.order,
          }))
          .sort((a, b) => a.order - b.order || a.index - b.index)
          .forEach((group) => {
            const groupRoutes = group.routes
              .map((name) => routeMap.get(name))
              .filter(Boolean);

            if (groupRoutes.length > 0) {
              grouped.push({
                ...group,
                routes: groupRoutes,
              });
            }
          });

        return grouped;
      });

      const renderSubMenu = () => {
        function travel(_route: RouteRecordRaw[], nodes = []) {
          if (_route) {
            _route.forEach((element) => {
              const icon = element?.meta?.icon
                ? () => h(compile(`<${element?.meta?.icon}/>`))
                : null;
              const node =
                element?.children && element?.children.length !== 0 ? (
                  <a-sub-menu
                    key={element?.name}
                    v-slots={{
                      icon,
                      title: () => h(compile(t(element?.meta?.locale || ''))),
                    }}
                  >
                    {travel(element?.children)}
                  </a-sub-menu>
                ) : (
                  <a-menu-item
                    key={element?.name}
                    v-slots={{ icon }}
                    onClick={() => goto(element)}
                  >
                    {t(element?.meta?.locale || '')}
                  </a-menu-item>
                );
              nodes.push(node as never);
            });
          }
          return nodes;
        }

        // 如果折叠状态，不显示分组标题
        if (collapsed.value) {
          return travel(menuTree.value);
        }

        // 展开状态，显示分组
        const groupNodes: any[] = [];
        groupedMenuTree.value.forEach((group, index) => {
          if (index > 0) {
            groupNodes.push(
              <div class="menu-divider" key={`divider-${index}`}></div>
            );
          }

          const isCollapsible = !!group.title;
          const isGroupCollapsed =
            isCollapsible && collapsedGroups.value[group.title];

          groupNodes.push(
            <a-menu-item-group
              key={`group-${index}`}
              class={[
                {
                  'menu-group--collapsible': isCollapsible,
                },
              ]}
              v-slots={{
                title: () =>
                  isCollapsible ? (
                    <span class="menu-group-title" data-group-key={group.title}>
                      <span class="menu-group-title__text">
                        {t(group.title)}
                      </span>
                      <span
                        class={[
                          'menu-group-title__arrow',
                          {
                            'menu-group-title__arrow--collapsed':
                              isGroupCollapsed,
                          },
                        ]}
                      ></span>
                    </span>
                  ) : (
                    ''
                  ),
              }}
            >
              {isGroupCollapsed ? null : travel(group.routes)}
            </a-menu-item-group>
          );
        });

        return groupNodes;
      };

      return () => (
        <div ref={menuRef} style="height: 100%;width:100%;">
          <a-menu
            mode={topMenu.value ? 'horizontal' : 'vertical'}
            v-model:collapsed={collapsed.value}
            v-model:open-keys={openKeys.value}
            show-collapse-button={appStore.device !== 'mobile'}
            auto-open={true}
            selected-keys={selectedKey.value}
            auto-open-selected={true}
            level-indent={20}
            style="height: 100%;width:100%;"
            onCollapse={setCollapse}
          >
            {renderSubMenu()}
          </a-menu>
        </div>
      );
    },
  });
</script>

<style lang="less" scoped>
  .menu-divider {
    height: 1px;
    margin: 10px 12px;
    background: linear-gradient(
      90deg,
      transparent,
      rgb(var(--primary-2)),
      transparent
    );
    transform: scaleY(0.5);
  }
</style>

<style lang="less">
  // 可收缩分组
  .arco-menu .menu-group--collapsible.arco-menu-group {
    > .arco-menu-group-title {
      user-select: none;
      border-radius: 6px;

      &.menu-group-title--hover {
        background: rgba(var(--primary-6), 0.08);
      }
    }
  }

  .menu-group-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    &__text {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__arrow {
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 3px;
      flex-shrink: 0;

      &::before {
        content: '';
        display: block;
        width: 0;
        height: 0;
        border-left: 4.5px solid transparent;
        border-right: 4.5px solid transparent;
        border-top: 5px solid var(--color-text-3);
      }

      &--collapsed::before {
        border-left: 5px solid var(--color-text-3);
        border-right: 0;
        border-top: 4.5px solid transparent;
        border-bottom: 4.5px solid transparent;
      }
    }
  }

  .arco-menu {
    background: transparent;
    font-size: 12px;

    .arco-menu-item-group-title {
      padding: 10px 12px 6px;
      font-size: 12px;
      font-weight: 500;
      color: var(--color-text-4);
      letter-spacing: 0.3px;
      text-transform: uppercase;
      line-height: 1.2;
    }

    .arco-menu-inner {
      padding: 0 8px 8px 8px;

      .arco-menu-inline-header {
        display: flex;
        align-items: center;
        border-radius: 6px;
        margin: 1px 0;
        padding: 8px 2px;
        font-size: 14px;
        line-height: 1.5;
        min-height: auto;
        height: auto;
        transition: all 0.25s ease;

        &:hover {
          background: rgba(var(--primary-6), 0.08);
        }
      }

      .arco-menu-item {
        border-radius: 6px;
        margin: 1px 0;
        padding: 8px 2px;
        font-size: 14px;
        line-height: 1.5;
        min-height: auto;
        height: auto;
        transition: all 0.25s ease;
        position: relative;

        &:hover {
          background: rgba(var(--primary-6), 0.08);
        }
      }

      .arco-icon {
        &:not(.arco-icon-down) {
          font-size: 16px;
        }
        transition: color 0.25s ease;
      }

      .arco-menu-icon {
        margin-top: 1px;
        margin-right: 8px;
      }

      .arco-menu-icon-suffix {
        margin-right: 12px;
      }

      // 子菜单缩进
      .arco-menu-inline {
        .arco-menu-item {
          padding-left: 6px;
        }
      }

      .arco-menu-pop {
        .arco-menu-pop-header {
          border-radius: 6px;
          margin: 1px 0;
          padding: 8px 2px;
          font-size: 14px;
          line-height: 1.5;
          min-height: auto;
          height: auto;
          transition: all 0.25s ease;

          &:hover {
            background: rgba(var(--primary-6), 0.08);
          }
        }
      }
    }

    &.arco-menu-collapsed {
      .arco-menu-item,
      .arco-menu-inline-header,
      .arco-menu-pop-header {
        justify-content: center;

        .arco-icon {
          margin-right: 0;
        }
      }
    }
  }

  // 亮色主题选中态
  .arco-menu-light .arco-menu-item.arco-menu-selected {
    background: rgba(22, 93, 255, 0.08);
    color: rgb(var(--primary-6));
    font-weight: 500;

    .arco-icon {
      color: rgb(var(--primary-6));
    }
  }

  .arco-menu-light .arco-menu-inline-header.arco-menu-selected {
    color: rgb(var(--primary-6));
    font-weight: 500;
  }

  // 暗色主题
  .arco-menu-dark {
    .arco-menu-item-group-title {
      color: rgba(255, 255, 255, 0.5);

      &::before {
        background: rgba(var(--primary-6), 0.8);
      }
    }

    .arco-menu-inner .arco-menu-item {
      &:hover {
        background: rgba(255, 255, 255, 0.08);
      }
    }

    .arco-menu-inner .arco-menu-inline-header:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    .arco-menu-item.arco-menu-selected {
      background: linear-gradient(135deg, #165dff 0%, #0e42d2 100%);
      color: #fff;
      box-shadow: 0 2px 8px rgba(22, 93, 255, 0.3);

      .arco-icon {
        color: #fff;
      }
    }
  }
</style>
