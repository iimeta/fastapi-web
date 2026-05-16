<template>
  <div class="list-wrap config-list-wrap">
    <a-row class="list-row" :gutter="24">
      <a-col
        v-for="item in sysConfigItems"
        :key="item.action"
        :xs="12"
        :sm="12"
        :md="12"
        :lg="8"
        :xl="8"
        :xxl="6"
        class="list-col"
      >
        <div class="card-wrap">
          <a-card
            :title="item.title"
            :bordered="false"
            :header-style="configCardHeaderStyle"
            :body-style="configCardBodyStyle"
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
                {{ item.desc }}
                <a-descriptions
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
      :width="configFormData.action === 'core' ? 588 : 528"
      :body-style="configModalBodyStyle"
      @cancel="handleCancel"
      @before-ok="handleBeforeOk"
    >
      <a-form ref="configForm" :model="configFormData" auto-label-width>
        <a-form-item
          v-if="configFormData.action === 'email'"
          field="email.host"
          :label="$t('sys.config.label.email.host')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.required.email.host'),
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
              message: $t('sys.config.error.required.email.port'),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.email.port"
            :placeholder="$t('sys.config.placeholder.email.port')"
            :precision="0"
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
              message: $t('sys.config.placeholder.email.user_name'),
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
              message: $t('sys.config.placeholder.email.password'),
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
              message: $t('sys.config.error.required.email.from_name'),
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
          v-if="configFormData.action === 'email'"
          field="email.interval"
          :label="$t('sys.config.label.email.interval')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.placeholder.email.interval'),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.email.interval"
            :placeholder="$t('sys.config.placeholder.email.interval')"
            :precision="0"
            :min="0"
            allow-clear
          >
            <template #append> {{ $t('unit.millisecond') }} </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'http'"
          field="http.timeout"
          :label="$t('sys.config.label.http.timeout')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.required.http.timeout'),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.http.timeout"
            :placeholder="$t('sys.config.placeholder.http.timeout')"
            :precision="0"
            :min="0"
            allow-clear
          >
            <template #append> {{ $t('unit.second') }} </template>
          </a-input-number>
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
          :rules="[
            {
              required: true,
              message: $t('sys.config.placeholder.core.secret_key_prefix'),
            },
          ]"
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
          :rules="[
            {
              required: true,
              message: $t('sys.config.placeholder.core.error_prefix'),
            },
          ]"
        >
          <a-input
            v-model="configFormData.core.error_prefix"
            :placeholder="$t('sys.config.placeholder.core.error_prefix')"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'core'"
          field="core.replace_error_prefixes"
          :label="$t('sys.config.label.core.replace_error_prefixes')"
        >
          <a-input
            v-model="configFormData.core.replace_error_prefixes"
            :placeholder="
              $t('sys.config.placeholder.core.replace_error_prefixes')
            "
            allow-clear
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import useLoading from '@/hooks/loading';
  import { FormInstance, Message, Modal } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import {
    SysConfigItem,
    SysConfigUpdate,
    submitSysConfigUpdate,
    submitSysConfigReset,
    submitSysConfigChangeStatus,
  } from '@/api/sys_config';
  import { useSysConfig } from '../composables/use-sys-config';

  const { setLoading } = useLoading(true);
  const { t } = useI18n();
  const { data: sysConfigData, refresh: refreshSysConfig } = useSysConfig();

  const configCardHeaderStyle = {
    padding: '16px',
  };
  const configCardBodyStyle = {
    padding: '0px 16px',
  };
  const configModalBodyStyle = {
    padding: '20px 20px 0 20px',
    maxHeight: '520px',
  };

  const configVisible = ref(false);
  const configTitle = ref('');
  const configForm = ref<FormInstance>();
  const configFormData = ref<SysConfigUpdate>({
    email: {},
    http: {},
    core: {},
    debug: {},
  } as SysConfigUpdate);

  const configHandle = async (sysConfigItem: SysConfigItem) => {
    configTitle.value = t(`sys.config.item.title.${sysConfigItem.action}`);
    configFormData.value.action = sysConfigItem.action;
    configVisible.value = true;
  };

  const resetHandle = async (sysConfigItem: SysConfigItem) => {
    Modal.warning({
      title: t('modal.warning.title'),
      titleAlign: 'center',
      content: `${t('sys.config.placeholder.are_you_sure_reset')}${t(
        `sys.config.item.title.${sysConfigItem.action}`
      )}?`,
      okText: t('button.ok'),
      cancelText: t('button.cancel'),
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
      if (configFormData.value.core.replace_error_prefixes) {
        configFormData.value.core.replace_error_prefixes =
          configFormData.value.core.replace_error_prefixes.split(',');
      }
      await submitSysConfigUpdate(configFormData.value);
      done();
      Message.success(t('success.operate'));
      refreshSysConfig();
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
      Message.success(t('success.operate'));
      refreshSysConfig();
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
      Message.success(t('success.operate'));
      refreshSysConfig();
    } finally {
      setLoading(false);
    }
  };

  const sysConfigItems = ref<SysConfigItem[]>({} as SysConfigItem[]);

  watch(
    sysConfigData,
    (data) => {
      if (!data) return;
      configFormData.value.email = data.email;
      configFormData.value.http = data.http;
      configFormData.value.core = data.core;
      configFormData.value.core.replace_error_prefixes =
        configFormData.value.core.replace_error_prefixes?.join(',');
      configFormData.value.debug = data.debug;
      sysConfigItems.value = [
        {
          action: 'email',
          title: t('sys.config.item.title.email'),
          desc: t('sys.config.item.desc.email'),
          open: configFormData.value.email.open,
          config: true,
          reset: true,
        },
        {
          action: 'http',
          title: t('sys.config.item.title.http'),
          desc: t('sys.config.item.desc.http'),
          config: true,
          reset: true,
        },
        {
          action: 'core',
          title: t('sys.config.item.title.core'),
          desc: t('sys.config.item.desc.core'),
          config: true,
          reset: true,
        },
        {
          action: 'debug',
          title: t('sys.config.item.title.debug'),
          desc: t('sys.config.item.desc.debug'),
          open: configFormData.value.debug.open,
        },
      ];
    },
    { immediate: true }
  );
</script>

<script lang="ts">
  export default {
    name: 'Global',
  };
</script>

<style scoped lang="less">
  @import '../style/config-card-shared.less';

  .config-list-wrap {
    margin-top: 10px;
  }
</style>
