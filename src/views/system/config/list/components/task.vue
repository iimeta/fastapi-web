<template>
  <div class="list-wrap" style="margin-top: 10px">
    <a-row class="list-row" :gutter="24">
      <a-col
        v-for="item in sysConfigItems"
        :key="item.action"
        :xs="12"
        :sm="12"
        :md="12"
        :lg="6"
        :xl="6"
        :xxl="6"
        class="list-col"
      >
        <div class="card-wrap">
          <a-card
            :title="item.title"
            :bordered="false"
            :header-style="{ padding: '16px' }"
            :body-style="{
              padding: '0px 16px',
            }"
          >
            <template #extra>
              <a-switch
                v-if="item.open !== undefined"
                v-model="item.open"
                @change="sysConfigChangeStatus(item)"
              />
            </template>
            <a-card-meta>
              <template #description>
                {{ item.description }}
                <a-descriptions
                  style="margin-top: 10px"
                  :data="item.data"
                  layout="inline-horizontal"
                  :column="2"
                />
              </template>
            </a-card-meta>
            <template #actions>
              <a-button v-if="item.reset" @click="resetHandle(item)">
                {{ $t('button.reset') }}
              </a-button>
              <a-button
                v-if="item.config"
                type="primary"
                @click="configHandle(item)"
              >
                {{ $t('button.config') }}
              </a-button>
            </template>
            <template #skeleton>
              <a-skeleton :animation="true">
                <a-skeleton-line
                  :widths="['50%', '50%', '100%', '40%']"
                  :rows="4"
                />
                <a-skeleton-line :widths="['40%']" :rows="1" />
              </a-skeleton>
            </template>
          </a-card>
        </div>
      </a-col>
    </a-row>

    <a-modal
      v-model:visible="configVisible"
      :title="$t(configTitle)"
      @cancel="handleCancel"
      @before-ok="handleBeforeOk"
    >
      <a-form ref="configForm" :model="configFormData">
        <a-form-item
          v-if="configFormData.action === 'email'"
          field="email.host"
          :label="$t('sys.config.label.email.host')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.email.host.required'),
            },
          ]"
        >
          <a-input
            v-model="configFormData.email.host"
            :placeholder="$t('sys.config.placeholder.email.host')"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'email'"
          field="email.port"
          :label="$t('sys.config.label.email.port')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.email.port.required'),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.email.port"
            :placeholder="$t('sys.config.placeholder.email.port')"
            :min="1"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'email'"
          field="email.user_name"
          :label="$t('sys.config.label.email.user_name')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.email.user_name.required'),
            },
          ]"
        >
          <a-input
            v-model="configFormData.email.user_name"
            :placeholder="$t('sys.config.placeholder.email.user_name')"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'email'"
          field="email.password"
          :label="$t('sys.config.label.email.password')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.email.password.required'),
            },
          ]"
        >
          <a-input
            v-model="configFormData.email.password"
            :placeholder="$t('sys.config.placeholder.email.password')"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'email'"
          field="email.from_name"
          :label="$t('sys.config.label.email.from_name')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.email.from_name.required'),
            },
          ]"
        >
          <a-input
            v-model="configFormData.email.from_name"
            :placeholder="$t('sys.config.placeholder.email.from_name')"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'http'"
          field="http.timeout"
          :label="$t('sys.config.label.http.timeout')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.http.timeout.required'),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.http.timeout"
            :placeholder="$t('sys.config.placeholder.http.timeout')"
            :min="1"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'http'"
          field="http.proxy_url"
          :label="$t('sys.config.label.http.proxy_url')"
        >
          <a-input
            v-model="configFormData.http.proxy_url"
            :placeholder="$t('sys.config.placeholder.http.proxy_url')"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'core'"
          field="core.secret_key_prefix"
          :label="$t('sys.config.label.core.secret_key_prefix')"
        >
          <a-input
            v-model="configFormData.core.secret_key_prefix"
            :placeholder="$t('sys.config.placeholder.core.secret_key_prefix')"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'core'"
          field="core.error_prefix"
          :label="$t('sys.config.label.core.error_prefix')"
        >
          <a-input
            v-model="configFormData.core.error_prefix"
            :placeholder="$t('sys.config.placeholder.core.error_prefix')"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'core'"
          field="core.channel_prefix"
          :label="$t('sys.config.label.core.channel_prefix')"
        >
          <a-input
            v-model="configFormData.core.channel_prefix"
            :placeholder="$t('sys.config.placeholder.core.channel_prefix')"
            allow-clear
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, getCurrentInstance } from 'vue';
  import useLoading from '@/hooks/loading';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { useI18n } from 'vue-i18n';
  import {
    SysConfigItem,
    SysConfigDetail,
    querySysConfigDetail,
    SysConfigUpdate,
    submitSysConfigUpdate,
    submitSysConfigReset,
    submitSysConfigChangeStatus,
  } from '@/api/sys_config';

  const { proxy } = getCurrentInstance() as any;
  const { setLoading } = useLoading(true);
  const { t } = useI18n();

  const configVisible = ref(false);
  const configTitle = ref('');
  const configForm = ref<FormInstance>();
  const configFormData = ref<SysConfigUpdate>({
    email: {},
    http: {},
    core: {},
  } as SysConfigUpdate);

  const configHandle = async (sysConfigItem: SysConfigItem) => {
    switch (sysConfigItem.action) {
      case 'email':
        configTitle.value = t('sys.config.item.title.email');
        break;
      case 'http':
        configTitle.value = t('sys.config.item.title.http');
        break;
      case 'core':
        configTitle.value = t('sys.config.item.title.core');
        break;
      default:
        configTitle.value = t('menu.sys.config');
    }
    configFormData.value.action = sysConfigItem.action;
    configVisible.value = true;
  };

  const resetHandle = async (sysConfigItem: SysConfigItem) => {
    let alertContent;
    switch (sysConfigItem.action) {
      case 'email':
        alertContent = `是否确定重置${t('sys.config.item.title.email')}?`;
        break;
      case 'http':
        alertContent = `是否确定重置${t('sys.config.item.title.http')}?`;
        break;
      case 'core':
        alertContent = `是否确定重置${t('sys.config.item.title.core')}?`;
        break;
      default:
        alertContent = `是否确定重置此配置?`;
    }

    proxy.$modal.warning({
      title: '警告',
      titleAlign: 'center',
      content: alertContent,
      hideCancel: false,
      onOk: () => {
        sysConfigReset(sysConfigItem);
      },
    });
  };

  const handleBeforeOk = async (done: any) => {
    const res = await configForm.value?.validate();
    if (res) {
      configVisible.value = true;
      done(false);
      return;
    }

    setLoading(true);
    try {
      await submitSysConfigUpdate(configFormData.value);
      done();
      proxy.$message.success('操作成功');
      getSysConfigDetail();
    } catch (err) {
      done(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    configVisible.value = false;
  };

  const sysConfigReset = async (sysConfigItem: SysConfigItem) => {
    setLoading(true);
    try {
      await submitSysConfigReset({
        action: sysConfigItem.action,
      });
      proxy.$message.success('操作成功');
      getSysConfigDetail();
    } finally {
      setLoading(false);
    }
  };

  const sysConfigChangeStatus = async (sysConfigItem: SysConfigItem) => {
    setLoading(true);
    try {
      await submitSysConfigChangeStatus({
        action: sysConfigItem.action,
        open: sysConfigItem.open || false,
      });
      proxy.$message.success('操作成功');
      getSysConfigDetail();
    } finally {
      setLoading(false);
    }
  };

  const currentData = ref<SysConfigDetail>({} as SysConfigDetail);
  const sysConfigItems = ref<SysConfigItem[]>({} as SysConfigItem[]);

  const getSysConfigDetail = async () => {
    const { data } = await querySysConfigDetail();
    currentData.value = data;
    configFormData.value.email = data.email;
    configFormData.value.http = data.http;
    configFormData.value.core = data.core;
    sysConfigItems.value = [
      {
        action: 'email',
        title: t('sys.config.item.title.email'),
        description: '配置邮箱相关信息',
        open: currentData.value.email.open,
        config: true,
        reset: true,
      },
      {
        action: 'http',
        title: t('sys.config.item.title.http'),
        description: '配置HTTP请求超时时间和代理地址',
        config: true,
        reset: true,
      },
      {
        action: 'core',
        title: t('sys.config.item.title.core'),
        description: '系统核心配置, 请谨慎修改',
        config: true,
        reset: true,
      },
      {
        action: 'debug',
        title: t('sys.config.item.title.debug'),
        description:
          '系统调试开关, 打开后, 日志会打印更多详细信息, 日志级别需是: DEBUG',
        open: currentData.value.debug.open,
      },
    ];
  };
  getSysConfigDetail();
</script>

<script lang="ts">
  export default {
    name: 'Task',
  };
</script>

<style scoped lang="less">
  .card-wrap {
    height: 100%;
    transition: all 0.3s;
    border: 1px solid var(--color-neutral-3);
    border-radius: 5px;
    &:hover {
      transform: translateY(-5px);
      box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
    }
    :deep(.arco-card) {
      height: 100%;
      border-radius: 5px;
      .arco-card-body {
        height: 120px;
        .arco-card-meta {
          height: 100%;
          display: flex;
          flex-flow: column;
          .arco-card-meta-content {
            flex: 1;
            .arco-card-meta-description {
              color: rgb(var(--gray-6));
              line-height: 20px;
              font-size: 12px;
              .arco-descriptions-item-label-inline {
                font-weight: normal;
                font-size: 13px;
                color: rgb(var(--gray-8));
              }
            }
          }
        }
      }
      .arco-card-meta-footer:last-child {
        margin-top: 16px;
        margin-bottom: 12px;
      }
    }
    :deep(.arco-card-meta-title) {
      display: flex;
      align-items: center;
      line-height: 28px;
    }
    :deep(.arco-card-header) {
      border: none;
    }
    :deep(.arco-skeleton-line) {
      &:last-child {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
      }
    }
  }
</style>
