<template>
  <a-grid :cols="24" :row-gap="8" class="panel">
    <a-grid-item
      class="panel-col"
      :span="{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6 }"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img alt="avatar" src="@/assets/images/call.png" />
        </a-avatar>
        <a-statistic
          :title="$t('workplace.call')"
          :value="baseData.call"
          show-group-separator
        >
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6 }"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img alt="avatar" src="@/assets/images/app.png" />
        </a-avatar>
        <a-statistic
          :title="$t('workplace.app')"
          :value="baseData.app"
          show-group-separator
        >
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      v-permission="['reseller', 'admin']"
      class="panel-col"
      :span="{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6 }"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img alt="avatar" src="@/assets/images/today-app.png" />
        </a-avatar>
        <a-statistic
          :title="$t('workplace.todayApp')"
          :value="baseData.today_app"
          show-group-separator
        >
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6 }"
      style="border-right: none"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img alt="avatar" src="@/assets/images/app-key.png" />
        </a-avatar>
        <a-statistic
          :title="$t('workplace.appKey')"
          :value="baseData.app_key"
          show-group-separator
        >
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item v-permission="['reseller', 'admin']" :span="24">
      <a-divider class="panel-border" />
    </a-grid-item>
    <a-grid-item
      v-permission="['reseller', 'admin']"
      class="panel-col"
      :span="{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6 }"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img alt="avatar" src="@/assets/images/user.png" />
        </a-avatar>
        <a-statistic
          :title="$t('workplace.user')"
          :value="baseData.user"
          show-group-separator
        >
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      v-permission="['reseller', 'admin']"
      class="panel-col"
      :span="{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6 }"
      style="border-right: none"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img alt="avatar" src="@/assets/images/today-user.png" />
        </a-avatar>
        <a-statistic
          :title="$t('workplace.todayUser')"
          :value="baseData.today_user"
          show-group-separator
        >
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6 }"
      style="border-right: none; border-left: 1px solid rgb(var(--gray-2))"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img alt="avatar" src="@/assets/images/model.png" />
        </a-avatar>
        <a-statistic
          :title="$t('workplace.model')"
          :value="baseData.model"
          show-group-separator
        >
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      v-permission="['admin']"
      class="panel-col"
      :span="{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6 }"
      style="border-right: none; border-left: 1px solid rgb(var(--gray-2))"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img alt="avatar" src="@/assets/images/model-key.png" />
        </a-avatar>
        <a-statistic
          :title="$t('workplace.modelKey')"
          :value="baseData.model_key"
          show-group-separator
        >
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      v-permission="['reseller']"
      class="panel-col"
      :span="{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6 }"
      style="border-right: none; border-left: 1px solid rgb(var(--gray-2))"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img alt="avatar" src="@/assets/images/group.png" />
        </a-avatar>
        <a-statistic
          :title="$t('workplace.group')"
          :value="baseData.group"
          show-group-separator
        >
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item :span="24">
      <a-divider class="panel-border" />
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6 }"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img alt="avatar" src="@/assets/images/rps.png" />
        </a-avatar>
        <a-statistic title="RPS" :value="rps" show-group-separator>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6 }"
      style="border-right: none"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img alt="avatar" src="@/assets/images/tps.png" />
        </a-avatar>
        <a-statistic title="TPS" :value="tps" show-group-separator>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6 }"
      style="border-right: none; border-left: 1px solid rgb(var(--gray-2))"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img alt="avatar" src="@/assets/images/rpm.png" />
        </a-avatar>
        <a-statistic title="RPM" :value="rpm" show-group-separator>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6 }"
      style="border-right: none; border-left: 1px solid rgb(var(--gray-2))"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img alt="avatar" src="@/assets/images/tpm.png" />
        </a-avatar>
        <a-statistic title="TPM" :value="tpm" show-group-separator>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item :span="24">
      <a-divider class="panel-border" />
    </a-grid-item>
  </a-grid>
</template>

<script lang="ts" setup>
  import { ref, reactive, onBeforeMount, onBeforeUnmount } from 'vue';
  import {
    queryBaseData,
    BaseDataRecord,
    queryPerSecond,
    queryPerMinute,
  } from '@/api/dashboard';

  const baseData = reactive({}) as BaseDataRecord;

  const rps = ref(0);
  const tps = ref(0);
  const rpm = ref(0);
  const tpm = ref(0);

  let getBaseDataIntervalId: ReturnType<typeof setInterval> | undefined;
  let getPerSecondIntervalId: ReturnType<typeof setInterval> | undefined;
  let getPerMinuteIntervalId: ReturnType<typeof setInterval> | undefined;

  const getBaseData = async () => {
    const { data } = await queryBaseData();
    Object.assign(baseData, data);
  };

  const getPerSecond = async () => {
    const { data } = await queryPerSecond();
    rps.value = data.rps;
    tps.value = data.tps;
  };

  const getPerMinute = async () => {
    const { data } = await queryPerMinute();
    rpm.value = data.rpm;
    tpm.value = data.tpm;
  };

  const clearTimers = () => {
    clearInterval(getBaseDataIntervalId);
    clearInterval(getPerSecondIntervalId);
    clearInterval(getPerMinuteIntervalId);
  };

  /**
   * 设置定时器
   *
   * 此函数负责初始化多个定时器，用于定期执行特定的操作
   * 它包括获取基础数据、每秒执行一次的操作、每分钟执行一次的操作
   * 并且为每个操作设置了一个定时器，以确保它们能够按预期的频率自动执行
   */
  const setTimers = () => {
    // 获取基础数据
    getBaseData();
    // 每秒执行一次的操作
    getPerSecond();
    // 每分钟执行一次的操作
    getPerMinute();
    // 设置定时器，每180分钟获取一次基础数据
    getBaseDataIntervalId = setInterval(getBaseData, 180 * 1000);
    // 设置定时器，每1秒执行一次getPerSecond函数
    getPerSecondIntervalId = setInterval(getPerSecond, 1000);
    // 设置定时器，每5分钟执行一次getPerMinute函数
    getPerMinuteIntervalId = setInterval(getPerMinute, 3000);
  };

  /**
   * 处理页面可见性变化的函数
   * 当页面的可见性状态发生改变时，此函数会被调用
   * 主要作用是根据页面是否可见来启动或停止定时器
   */
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      clearTimers();
    } else {
      setTimers();
    }
  };

  /**
   * 在组件挂载前设置定时器并监听页面可见性变化
   *
   * 此生命周期钩子会在组件即将被挂载到 DOM 前执行以下操作：
   * - 调用 `setTimers` 函数来启动定时器
   * - 添加一个事件监听器，用于监听页面的可见性变化
   */
  onBeforeMount(() => {
    setTimers();
    document.addEventListener('visibilitychange', handleVisibilityChange);
  });

  /**
   * 在组件卸载前清除定时器并移除页面可见性变化监听
   *
   * 此生命周期钩子会在组件即将从 DOM 中卸载前执行以下操作：
   * - 调用 `clearTimers` 函数来停止所有定时器
   * - 移除页面可见性变化的事件监听器
   */
  onBeforeUnmount(() => {
    clearTimers();
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  });
</script>

<script lang="ts">
  export default {
    name: 'DataPanel', // If you want the include property of keep-alive to take effect, you must name the component
  };
</script>

<style lang="less" scoped>
  .arco-grid.panel {
    margin-bottom: 0;
    padding: 8px 20px 0 20px;
  }
  .panel-col {
    padding-left: 12px;
    height: 50px;
    border-right: 1px solid rgb(var(--gray-2));
  }
  .col-avatar {
    margin-right: 5px;
    background-color: var(--color-fill-2);
  }
  .up-icon {
    color: rgb(var(--red-6));
  }
  .unit {
    margin-left: 8px;
    color: rgb(var(--gray-8));
    font-size: 12px;
  }
  :deep(.panel-border) {
    margin: 4px 0 0 0;
  }
  .arco-statistic {
    display: inline-block;
    color: var(--color-text-2);
    line-height: 1;
  }
</style>
