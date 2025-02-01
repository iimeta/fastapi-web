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
      <a-form
        ref="configForm"
        :model="configFormData"
        auto-label-width
        style="max-height: 300px"
      >
        <a-form-item
          v-if="configFormData.action === 'base'"
          field="base.err_retry"
          :label="$t('sys.config.label.base.err_retry')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.base.err_retry.required'),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.base.err_retry"
            :placeholder="$t('sys.config.placeholder.base.err_retry')"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'base'"
          field="base.model_key_err_disable"
          :label="$t('sys.config.label.base.model_key_err_disable')"
          :rules="[
            {
              required: true,
              message: $t(
                'sys.config.error.base.model_key_err_disable.required'
              ),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.base.model_key_err_disable"
            :placeholder="
              $t('sys.config.placeholder.base.model_key_err_disable')
            "
            allow-clear
          />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'base'"
          field="base.model_agent_err_disable"
          :label="$t('sys.config.label.base.model_agent_err_disable')"
          :rules="[
            {
              required: true,
              message: $t(
                'sys.config.error.base.model_agent_err_disable.required'
              ),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.base.model_agent_err_disable"
            :placeholder="
              $t('sys.config.placeholder.base.model_agent_err_disable')
            "
            allow-clear
          />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'base'"
          field="base.model_agent_key_err_disable"
          :label="$t('sys.config.label.base.model_agent_key_err_disable')"
          :rules="[
            {
              required: true,
              message: $t(
                'sys.config.error.base.model_agent_key_err_disable.required'
              ),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.base.model_agent_key_err_disable"
            :placeholder="
              $t('sys.config.placeholder.base.model_agent_key_err_disable')
            "
            allow-clear
          />
        </a-form-item>
        <a-form-item
          v-for="(item, index) of configFormData.log.records"
          v-show="configFormData.action === 'log'"
          :key="index"
          :field="`log.records[${index}]`"
          :label="`${index + 1}. ` + $t('sys.config.label.log.records')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.log.records.required'),
            },
          ]"
          :label-col-style="{
            padding: '0 16px 2px 0',
          }"
        >
          <a-input
            v-model="configFormData.log.records[index]"
            :placeholder="$t('sys.config.placeholder.log.records')"
            allow-clear
            style="width: 75%; margin-right: 5px"
          />
          <a-button
            type="primary"
            shape="circle"
            style="margin: 0 10px 0 10px"
            @click="handleLogRecordAdd()"
          >
            <icon-plus />
          </a-button>
          <a-button
            type="secondary"
            shape="circle"
            @click="handleLogRecordDel(index)"
          >
            <icon-minus />
          </a-button>
        </a-form-item>
        <a-form-item
          v-for="(item, index) of configFormData.auto_disabled_error.errors"
          v-show="configFormData.action === 'auto_disabled_error'"
          :key="index"
          :field="`auto_disabled_error.errors[${index}]`"
          :label="
            `${index + 1}. ` + $t('sys.config.label.auto_disabled_error.errors')
          "
          :rules="[
            {
              required: true,
              message: $t(
                'sys.config.error.auto_disabled_error.errors.required'
              ),
            },
          ]"
          :label-col-style="{
            padding: '0 16px 2px 0',
          }"
        >
          <a-input
            v-model="configFormData.auto_disabled_error.errors[index]"
            :placeholder="
              $t('sys.config.placeholder.auto_disabled_error.errors')
            "
            allow-clear
            style="width: 75%; margin-right: 5px"
          />
          <a-button
            type="primary"
            shape="circle"
            style="margin: 0 10px 0 10px"
            @click="handleAutoDisabledErrorAdd()"
          >
            <icon-plus />
          </a-button>
          <a-button
            type="secondary"
            shape="circle"
            @click="handleAutoDisabledErrorDel(index)"
          >
            <icon-minus />
          </a-button>
        </a-form-item>
        <a-form-item
          v-for="(item, index) of configFormData.not_retry_error.errors"
          v-show="configFormData.action === 'not_retry_error'"
          :key="index"
          :field="`not_retry_error.errors[${index}]`"
          :label="
            `${index + 1}. ` + $t('sys.config.label.not_retry_error.errors')
          "
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.not_retry_error.errors.required'),
            },
          ]"
          :label-col-style="{
            padding: '0 16px 2px 0',
          }"
        >
          <a-input
            v-model="configFormData.not_retry_error.errors[index]"
            :placeholder="$t('sys.config.placeholder.not_retry_error.errors')"
            allow-clear
            style="width: 75%; margin-right: 5px"
          />
          <a-button
            type="primary"
            shape="circle"
            style="margin: 0 10px 0 10px"
            @click="handleNotRetryErrorAdd()"
          >
            <icon-plus />
          </a-button>
          <a-button
            type="secondary"
            shape="circle"
            @click="handleNotRetryErrorDel(index)"
          >
            <icon-minus />
          </a-button>
        </a-form-item>
        <a-form-item
          v-for="(item, index) of configFormData.not_shield_error.errors"
          v-show="configFormData.action === 'not_shield_error'"
          :key="index"
          :field="`not_shield_error.errors[${index}]`"
          :label="
            `${index + 1}. ` + $t('sys.config.label.not_shield_error.errors')
          "
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.not_shield_error.errors.required'),
            },
          ]"
          :label-col-style="{
            padding: '0 16px 2px 0',
          }"
        >
          <a-input
            v-model="configFormData.not_shield_error.errors[index]"
            :placeholder="$t('sys.config.placeholder.not_shield_error.errors')"
            allow-clear
            style="width: 75%; margin-right: 5px"
          />
          <a-button
            type="primary"
            shape="circle"
            style="margin: 0 10px 0 10px"
            @click="handleNotShieldErrorAdd()"
          >
            <icon-plus />
          </a-button>
          <a-button
            type="secondary"
            shape="circle"
            @click="handleNotShieldErrorDel(index)"
          >
            <icon-minus />
          </a-button>
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
    base: {},
    log: {},
    auto_disabled_error: {},
    not_retry_error: {},
    not_shield_error: {},
  } as SysConfigUpdate);

  const configHandle = async (sysConfigItem: SysConfigItem) => {
    if (
      sysConfigItem.action === 'auto_disabled_error' &&
      configFormData.value.auto_disabled_error.errors.length === 0
    ) {
      handleAutoDisabledErrorAdd();
    }
    if (
      sysConfigItem.action === 'not_retry_error' &&
      configFormData.value.not_retry_error.errors.length === 0
    ) {
      handleNotRetryErrorAdd();
    }
    if (
      sysConfigItem.action === 'not_shield_error' &&
      configFormData.value.not_shield_error.errors.length === 0
    ) {
      handleNotShieldErrorAdd();
    }
    configTitle.value = t(`sys.config.item.title.${sysConfigItem.action}`);
    configFormData.value.action = sysConfigItem.action;
    configVisible.value = true;
  };

  const resetHandle = async (sysConfigItem: SysConfigItem) => {
    proxy.$modal.warning({
      title: '警告',
      titleAlign: 'center',
      content: `是否确定重置${t(
        `sys.config.item.title.${sysConfigItem.action}`
      )}?`,
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
    if (
      configFormData.value.auto_disabled_error.errors.length > 0 &&
      !configFormData.value.auto_disabled_error.errors[
        configFormData.value.auto_disabled_error.errors.length - 1
      ]
    ) {
      handleAutoDisabledErrorDel(
        configFormData.value.auto_disabled_error.errors.length - 1
      );
    }
    if (
      configFormData.value.not_retry_error.errors.length > 0 &&
      !configFormData.value.not_retry_error.errors[
        configFormData.value.not_retry_error.errors.length - 1
      ]
    ) {
      handleNotRetryErrorDel(
        configFormData.value.not_retry_error.errors.length - 1
      );
    }
    if (
      configFormData.value.not_shield_error.errors.length > 0 &&
      !configFormData.value.not_shield_error.errors[
        configFormData.value.not_shield_error.errors.length - 1
      ]
    ) {
      handleNotShieldErrorDel(
        configFormData.value.not_shield_error.errors.length - 1
      );
    }
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
    configFormData.value.base = data.base;
    configFormData.value.log = data.log;
    configFormData.value.auto_disabled_error = data.auto_disabled_error;
    configFormData.value.not_retry_error = data.not_retry_error;
    configFormData.value.not_shield_error = data.not_shield_error;
    sysConfigItems.value = [
      {
        action: 'base',
        title: t('sys.config.item.title.base'),
        description:
          '配置错误重试次数和各类错误禁用次数等, 错误重试次数N > 0 重试 N 次, N < 0 重试所有key一轮, N = 0 不重试, 错误次数每天0点会自动重置, 注: 代理密钥错误时, 也会记录模型代理错误次数',
        config: true,
        reset: true,
      },
      {
        action: 'log',
        title: t('sys.config.item.title.log'),
        description:
          '调用日志记录内容, prompt: 提问, completion: 回答, messages: 上下文, image: 多模态识图的BASE64图像数据',
        open: currentData.value.log.open,
        config: true,
        reset: true,
      },
      {
        action: 'auto_disabled_error',
        title: t('sys.config.item.title.auto_disabled_error'),
        description:
          '调用报错时, 包含有配置错误内容时则自动会禁用密钥或模型代理等, 为空则不会自动禁用(达到错误次数上限除外)',
        open: currentData.value.auto_disabled_error.open,
        config: true,
        reset: true,
      },
      {
        action: 'not_retry_error',
        title: t('sys.config.item.title.not_retry_error'),
        description:
          '调用报错时, 包含有配置错误内容时则不会自动重试, 为空则会自动重试',
        open: currentData.value.not_retry_error.open,
        config: true,
        reset: true,
      },
      {
        action: 'not_shield_error',
        title: t('sys.config.item.title.not_shield_error'),
        description:
          '调用报错时, 包含有配置错误内容时则会将错误内容返回给调用方, 为空则屏蔽所有错误',
        open: currentData.value.not_shield_error.open,
        config: true,
        reset: true,
      },
    ];
  };
  getSysConfigDetail();

  const handleLogRecordAdd = () => {
    configFormData.value.log.records.push('');
  };

  const handleLogRecordDel = (index: number) => {
    if (configFormData.value.log.records.length > 1) {
      configFormData.value.log.records.splice(index, 1);
    }
  };

  const handleAutoDisabledErrorAdd = () => {
    configFormData.value.auto_disabled_error.errors.push('');
  };

  const handleAutoDisabledErrorDel = (index: number) => {
    configFormData.value.auto_disabled_error.errors.splice(index, 1);
  };

  const handleNotRetryErrorAdd = () => {
    configFormData.value.not_retry_error.errors.push('');
  };

  const handleNotRetryErrorDel = (index: number) => {
    configFormData.value.not_retry_error.errors.splice(index, 1);
  };

  const handleNotShieldErrorAdd = () => {
    configFormData.value.not_shield_error.errors.push('');
  };

  const handleNotShieldErrorDel = (index: number) => {
    configFormData.value.not_shield_error.errors.splice(index, 1);
  };
</script>

<script lang="ts">
  export default {
    name: 'API',
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
        height: 130px;
        .arco-card-meta {
          height: 100%;
          display: flex;
          flex-flow: column;
          .arco-card-meta-content {
            flex: 1;
            .arco-card-meta-description {
              color: rgb(var(--gray-6));
              line-height: 18px;
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
        margin-top: 2px;
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
