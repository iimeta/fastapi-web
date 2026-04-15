<script lang="tsx">
  import { defineComponent, ref, h, compile, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter, RouteRecordRaw } from 'vue-router';
  import type { RouteMeta } from 'vue-router';
  import { useAppStore } from '@/store';
  import { listenerRouteChange } from '@/utils/route-listener';
  import { openWindow, regexUrl } from '@/utils';
  import useMenuTree from './use-menu-tree';

  export default defineComponent({
    emit: ['collapse'],
    setup() {
      const { t } = useI18n();
      const appStore = useAppStore();
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
      const menuGroups = [
        {
          title: '数据概览',
          icon: 'icon-dashboard',
          routes: ['dashboard', 'statistics', 'monitor'],
        },
        {
          title: '模型管理',
          icon: 'icon-common',
          routes: ['model', 'model_square', 'my_model', 'model_agent'],
        },
        {
          title: '团队协作',
          icon: 'icon-user-group',
          routes: ['group', 'group_square', 'my_group'],
        },
        {
          title: '应用与密钥',
          icon: 'icon-apps',
          routes: ['app', 'app_key', 'key'],
        },
        {
          title: '用户管理',
          icon: 'icon-user',
          routes: ['user'],
        },
        {
          title: '财务与日志',
          icon: 'icon-wechatpay',
          routes: ['finance', 'task', 'log'],
        },
        {
          title: '系统设置',
          icon: 'icon-settings',
          routes: ['notice', 'sys'],
        },
      ];

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
        const routeMap = new Map();

        menuTree.value.forEach((menuRoute: RouteRecordRaw) => {
          routeMap.set(menuRoute.name, menuRoute);
        });

        menuGroups.forEach((group) => {
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
          groupNodes.push(
            <a-menu-item-group key={`group-${index}`} title={group.title}>
              {travel(group.routes)}
            </a-menu-item-group>
          );
        });

        return groupNodes;
      };

      return () => (
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

      .arco-menu-icon-suffix {
        margin-right: 12px;
      }

      // 子菜单缩进
      .arco-menu-inline {
        .arco-menu-item {
          padding-left: 14px;
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
