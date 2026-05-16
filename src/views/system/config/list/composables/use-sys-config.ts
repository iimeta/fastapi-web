import { ref, provide, inject, type InjectionKey, type Ref } from 'vue';
import { querySysConfigDetail, type SysConfigDetail } from '@/api/sys_config';

interface SysConfigContext {
  data: Ref<SysConfigDetail | null>;
  refresh: () => Promise<void>;
}

const sysConfigKey: InjectionKey<SysConfigContext> = Symbol('sysConfig');

export function provideSysConfig() {
  const data = ref<SysConfigDetail | null>(null);

  const refresh = async () => {
    const res = await querySysConfigDetail();
    data.value = res.data;
  };

  refresh();

  provide(sysConfigKey, { data, refresh });

  return { data, refresh };
}

export function useSysConfig(): SysConfigContext {
  const ctx = inject(sysConfigKey);
  if (!ctx) {
    throw new Error('useSysConfig() must be used inside provideSysConfig()');
  }
  return ctx;
}
