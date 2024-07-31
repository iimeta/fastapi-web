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
      v-permission="['admin']"
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
    <a-grid-item v-permission="['admin']" :span="24">
      <a-divider class="panel-border" />
    </a-grid-item>
    <a-grid-item
      v-permission="['admin']"
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
      v-permission="['admin']"
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
  import { ref, reactive } from 'vue';
  import {
    queryBaseData,
    BaseDataRecord,
    queryPerSecond,
    queryPerMinute,
  } from '@/api/dashboard';

  const baseData = reactive({}) as BaseDataRecord;

  const getBaseData = async () => {
    try {
      const { data } = await queryBaseData();
      baseData.app = data.app;
      baseData.today_app = data.today_app;
      baseData.model = data.model;
      baseData.app_key = data.app_key;
      baseData.model_key = data.model_key;
      baseData.user = data.user;
      baseData.today_user = data.today_user;
      baseData.call = data.call;
    } catch (err) {
      // you can report use errorHandler or other
    }
  };
  getBaseData();

  const rps = ref(0);
  const tps = ref(0);
  const getPerSecond = async () => {
    const { data } = await queryPerSecond();
    rps.value = data.rps;
    tps.value = data.tps;
  };
  getPerSecond();
  setInterval(getPerSecond, 1000);

  const rpm = ref(0);
  const tpm = ref(0);
  const getPerMinute = async () => {
    const { data } = await queryPerMinute();
    rpm.value = data.rpm;
    tpm.value = data.tpm;
  };
  getPerMinute();
  setInterval(getPerMinute, 3000);
</script>

<style lang="less" scoped>
  .arco-grid.panel {
    margin-bottom: 0;
    padding: 8px 20px 0 20px;
  }
  .panel-col {
    padding-left: 43px;
    height: 50px;
    border-right: 1px solid rgb(var(--gray-2));
  }
  .col-avatar {
    margin-right: 12px;
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
