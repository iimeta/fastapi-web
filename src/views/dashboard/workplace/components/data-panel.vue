<template>
  <a-grid :cols="24" :row-gap="16" class="panel">
    <a-grid-item
      class="panel-col"
      :span="{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6, xxl: 6 }"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <img
            alt="avatar"
            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/c8b36e26d2b9bb5dbf9b74dd6d7345af.svg~tplv-49unhts6dw-image.image"
          />
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
          <img
            alt="avatar"
            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/288b89194e657603ff40db39e8072640.svg~tplv-49unhts6dw-image.image"
          />
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
          <img
            alt="avatar"
            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/288b89194e657603ff40db39e8072640.svg~tplv-49unhts6dw-image.image"
          />
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
          <img
            alt="avatar"
            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/77d74c9a245adeae1ec7fb5d4539738d.svg~tplv-49unhts6dw-image.image"
          />
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
          <img
            alt="avatar"
            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/c8b36e26d2b9bb5dbf9b74dd6d7345af.svg~tplv-49unhts6dw-image.image"
          />
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
          <img
            alt="avatar"
            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/c8b36e26d2b9bb5dbf9b74dd6d7345af.svg~tplv-49unhts6dw-image.image"
          />
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
          <img
            alt="avatar"
            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/fdc66b07224cdf18843c6076c2587eb5.svg~tplv-49unhts6dw-image.image"
          />
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
          <img
            alt="avatar"
            src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/77d74c9a245adeae1ec7fb5d4539738d.svg~tplv-49unhts6dw-image.image"
          />
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
  </a-grid>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import { queryBaseData, BaseDataRecord } from '@/api/dashboard';

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
</script>

<style lang="less" scoped>
  .arco-grid.panel {
    margin-bottom: 0;
    padding: 16px 20px 0 20px;
  }
  .panel-col {
    padding-left: 43px;
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
</style>
