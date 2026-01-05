<template>
  <div class="list-wrap" style="margin-top: 10px">
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
      :width="
        configFormData.action === 'user_shield_error' ||
        configFormData.action === 'reseller_shield_error'
          ? 728
          : 528
      "
      :body-style="{
        padding: '20px 20px 0 20px',
        maxHeight: '520px',
      }"
      @cancel="handleCancel"
      @before-ok="handleBeforeOk"
    >
      <a-form ref="configForm" :model="configFormData" auto-label-width>
        <a-form-item
          v-if="configFormData.action === 'user_login_register'"
          field="user_login_register.account_login"
          :label="$t('sys.config.label.user_login_register.account_login')"
          :rules="[
            {
              required: true,
            },
          ]"
        >
          <a-switch
            v-model="configFormData.user_login_register.account_login"
          />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'user_login_register'"
          field="user_login_register.email_login"
          :label="$t('sys.config.label.user_login_register.email_login')"
          :rules="[
            {
              required: true,
            },
          ]"
        >
          <a-switch v-model="configFormData.user_login_register.email_login" />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'user_login_register'"
          field="user_login_register.email_register"
          :label="$t('sys.config.label.user_login_register.email_register')"
          :rules="[
            {
              required: true,
            },
          ]"
        >
          <a-switch
            v-model="configFormData.user_login_register.email_register"
          />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'user_login_register'"
          field="user_login_register.email_retrieve"
          :label="$t('sys.config.label.user_login_register.email_retrieve')"
          :rules="[
            {
              required: true,
            },
          ]"
        >
          <a-switch
            v-model="configFormData.user_login_register.email_retrieve"
          />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'user_login_register'"
          field="user_login_register.session_expire"
          :label="$t('sys.config.label.user_login_register.session_expire')"
          :rules="[
            {
              required: true,
              message: $t(
                'sys.config.error.user_login_register.session_expire.required'
              ),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.user_login_register.session_expire"
            :placeholder="
              $t('sys.config.placeholder.user_login_register.session_expire')
            "
            :min="10"
            allow-clear
          >
            <template #append> 秒 </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-for="(item, index) of configFormData.user_shield_error.errors"
          v-show="configFormData.action === 'user_shield_error'"
          :key="index"
          :field="`user_shield_error.errors[${index}]`"
          :label="
            `${index + 1}. ` + $t('sys.config.label.user_shield_error.errors')
          "
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.user_shield_error.errors.required'),
            },
          ]"
          :label-col-style="{
            padding: '0 16px 2px 0',
          }"
        >
          <a-input
            v-model="configFormData.user_shield_error.errors[index]"
            :placeholder="$t('sys.config.placeholder.user_shield_error.errors')"
            allow-clear
            style="width: 84%; margin-right: 5px"
          />
          <a-button
            type="primary"
            shape="circle"
            style="margin: 0 10px 0 10px"
            @click="handleUserShieldErrorAdd()"
          >
            <icon-plus />
          </a-button>
          <a-button
            type="secondary"
            shape="circle"
            @click="handleUserShieldErrorDel(index)"
          >
            <icon-minus />
          </a-button>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'reseller_login_register'"
          field="reseller_login_register.account_login"
          :label="$t('sys.config.label.reseller_login_register.account_login')"
          :rules="[
            {
              required: true,
            },
          ]"
        >
          <a-switch
            v-model="configFormData.reseller_login_register.account_login"
          />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'reseller_login_register'"
          field="reseller_login_register.email_login"
          :label="$t('sys.config.label.reseller_login_register.email_login')"
          :rules="[
            {
              required: true,
            },
          ]"
        >
          <a-switch
            v-model="configFormData.reseller_login_register.email_login"
          />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'reseller_login_register'"
          field="reseller_login_register.email_register"
          :label="$t('sys.config.label.reseller_login_register.email_register')"
          :rules="[
            {
              required: true,
            },
          ]"
        >
          <a-switch
            v-model="configFormData.reseller_login_register.email_register"
          />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'reseller_login_register'"
          field="reseller_login_register.email_retrieve"
          :label="$t('sys.config.label.reseller_login_register.email_retrieve')"
          :rules="[
            {
              required: true,
            },
          ]"
        >
          <a-switch
            v-model="configFormData.reseller_login_register.email_retrieve"
          />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'reseller_login_register'"
          field="reseller_login_register.session_expire"
          :label="$t('sys.config.label.reseller_login_register.session_expire')"
          :rules="[
            {
              required: true,
              message: $t(
                'sys.config.error.reseller_login_register.session_expire.required'
              ),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.reseller_login_register.session_expire"
            :placeholder="
              $t(
                'sys.config.placeholder.reseller_login_register.session_expire'
              )
            "
            :min="10"
            allow-clear
          >
            <template #append> 秒 </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-for="(item, index) of configFormData.reseller_shield_error.errors"
          v-show="configFormData.action === 'reseller_shield_error'"
          :key="index"
          :field="`reseller_shield_error.errors[${index}]`"
          :label="
            `${index + 1}. ` +
            $t('sys.config.label.reseller_shield_error.errors')
          "
          :rules="[
            {
              required: true,
              message: $t(
                'sys.config.error.reseller_shield_error.errors.required'
              ),
            },
          ]"
          :label-col-style="{
            padding: '0 16px 2px 0',
          }"
        >
          <a-input
            v-model="configFormData.reseller_shield_error.errors[index]"
            :placeholder="
              $t('sys.config.placeholder.reseller_shield_error.errors')
            "
            allow-clear
            style="width: 84%; margin-right: 5px"
          />
          <a-button
            type="primary"
            shape="circle"
            style="margin: 0 10px 0 10px"
            @click="handleResellerShieldErrorAdd()"
          >
            <icon-plus />
          </a-button>
          <a-button
            type="secondary"
            shape="circle"
            @click="handleResellerShieldErrorDel(index)"
          >
            <icon-minus />
          </a-button>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'admin_login'"
          field="admin_login.account_login"
          :label="$t('sys.config.label.admin_login.account_login')"
          :rules="[
            {
              required: true,
            },
          ]"
        >
          <a-switch v-model="configFormData.admin_login.account_login" />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'admin_login'"
          field="admin_login.email_login"
          :label="$t('sys.config.label.admin_login.email_login')"
          :rules="[
            {
              required: true,
            },
          ]"
        >
          <a-switch v-model="configFormData.admin_login.email_login" />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'admin_login'"
          field="admin_login.email_retrieve"
          :label="$t('sys.config.label.admin_login.email_retrieve')"
          :rules="[
            {
              required: true,
            },
          ]"
        >
          <a-switch v-model="configFormData.admin_login.email_retrieve" />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'admin_login'"
          field="admin_login.session_expire"
          :label="$t('sys.config.label.admin_login.session_expire')"
          :rules="[
            {
              required: true,
              message: $t(
                'sys.config.error.admin_login.session_expire.required'
              ),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.admin_login.session_expire"
            :placeholder="
              $t('sys.config.placeholder.admin_login.session_expire')
            "
            :min="10"
            allow-clear
          >
            <template #append> 秒 </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'quota'"
          field="quota.warning"
          :label="$t('sys.config.label.quota.warning')"
          :rules="[
            {
              required: true,
            },
          ]"
        >
          <a-switch v-model="configFormData.quota.warning" />
        </a-form-item>
        <a-form-item
          v-if="
            configFormData.action === 'quota' && configFormData.quota.warning
          "
          field="quota.threshold"
          :label="$t('sys.config.label.quota.threshold')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.quota.threshold.required'),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.quota.threshold"
            :placeholder="$t('sys.config.placeholder.quota.threshold')"
            :precision="0"
            :min="1"
            allow-clear
          >
            <template #prefix> {{ appStore.getCurrencySymbol }} </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'quota'"
          field="quota.expired_warning"
          :label="$t('sys.config.label.quota.expired_warning')"
          :rules="[
            {
              required: true,
            },
          ]"
        >
          <a-switch v-model="configFormData.quota.expired_warning" />
        </a-form-item>
        <a-form-item
          v-if="
            configFormData.action === 'quota' &&
            configFormData.quota.expired_warning
          "
          field="quota.expired_threshold"
          :label="$t('sys.config.label.quota.expired_threshold')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.quota.expired_threshold.required'),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.quota.expired_threshold"
            :placeholder="$t('sys.config.placeholder.quota.expired_threshold')"
            :precision="0"
            :min="1"
            allow-clear
          >
            <template #append> {{ $t('unit.day') }} </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'quota'"
          field="quota.exhausted_notice"
          :label="$t('sys.config.label.quota.exhausted_notice')"
          :rules="[
            {
              required: true,
            },
          ]"
        >
          <a-switch v-model="configFormData.quota.exhausted_notice" />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'quota'"
          field="quota.expired_notice"
          :label="$t('sys.config.label.quota.expired_notice')"
          :rules="[
            {
              required: true,
            },
          ]"
        >
          <a-switch v-model="configFormData.quota.expired_notice" />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'quota'"
          field="quota.expired_clear"
          :label="$t('sys.config.label.quota.expired_clear')"
          :rules="[
            {
              required: true,
            },
          ]"
        >
          <a-switch v-model="configFormData.quota.expired_clear" />
        </a-form-item>
        <a-form-item
          v-if="
            configFormData.action === 'quota' &&
            configFormData.quota.expired_clear
          "
          field="quota.expired_clear_defer"
          :label="$t('sys.config.label.quota.expired_clear_defer')"
          :rules="[
            {
              required: true,
              message: $t(
                'sys.config.error.quota.expired_clear_defer.required'
              ),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.quota.expired_clear_defer"
            :placeholder="
              $t('sys.config.placeholder.quota.expired_clear_defer')
            "
            :precision="0"
            :min="1"
            allow-clear
          >
            <template #append> 分钟 </template>
          </a-input-number>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, getCurrentInstance } from 'vue';
  import useLoading from '@/hooks/loading';
  import { FormInstance } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import { useAppStore } from '@/store';
  import {
    SysConfigItem,
    querySysConfigDetail,
    SysConfigUpdate,
    submitSysConfigUpdate,
    submitSysConfigReset,
    submitSysConfigChangeStatus,
  } from '@/api/sys_config';

  const { proxy } = getCurrentInstance() as any;
  const { setLoading } = useLoading(true);
  const { t } = useI18n();
  const appStore = useAppStore();

  const configVisible = ref(false);
  const configTitle = ref('');
  const configForm = ref<FormInstance>();
  const configFormData = ref<SysConfigUpdate>({
    user_login_register: {},
    user_shield_error: {},
    reseller_login_register: {},
    reseller_shield_error: {},
    admin_login: {},
    quota: {},
  } as SysConfigUpdate);

  const configHandle = async (sysConfigItem: SysConfigItem) => {
    if (
      sysConfigItem.action === 'user_shield_error' &&
      configFormData.value.user_shield_error.errors.length === 0
    ) {
      handleUserShieldErrorAdd();
    }

    if (
      sysConfigItem.action === 'reseller_shield_error' &&
      configFormData.value.reseller_shield_error.errors.length === 0
    ) {
      handleResellerShieldErrorAdd();
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
      configFormData.value.user_shield_error.errors.length > 0 &&
      !configFormData.value.user_shield_error.errors[
        configFormData.value.user_shield_error.errors.length - 1
      ]
    ) {
      handleUserShieldErrorDel(
        configFormData.value.user_shield_error.errors.length - 1
      );
    }

    if (
      configFormData.value.reseller_shield_error.errors.length > 0 &&
      !configFormData.value.reseller_shield_error.errors[
        configFormData.value.reseller_shield_error.errors.length - 1
      ]
    ) {
      handleUserShieldErrorDel(
        configFormData.value.reseller_shield_error.errors.length - 1
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

  const sysConfigItems = ref<SysConfigItem[]>({} as SysConfigItem[]);

  const getSysConfigDetail = async () => {
    const { data } = await querySysConfigDetail();
    configFormData.value.user_login_register = data.user_login_register;
    configFormData.value.user_shield_error = data.user_shield_error;
    configFormData.value.reseller_login_register = data.reseller_login_register;
    configFormData.value.reseller_shield_error = data.reseller_shield_error;
    configFormData.value.admin_login = data.admin_login;
    configFormData.value.quota = data.quota;
    configFormData.value.quota.threshold = data.quota.threshold;
    sysConfigItems.value = [
      {
        action: 'user_login_register',
        title: t('sys.config.item.title.user_login_register'),
        desc: '配置登录页上的登录方式、用户注册、找回密码以及会话过期时长, 对应的开关可控制登录页上对应功能的显示, 关闭用户注册时, 通过邮箱登录也无法自动注册',
        config: true,
        reset: true,
      },
      {
        action: 'user_shield_error',
        title: t('sys.config.item.title.user_shield_error'),
        desc: '用户查看调用日志错误时, 包含有配置错误内容时则屏蔽显示, 为空则屏蔽所有错误显示',
        open: configFormData.value.user_shield_error.open,
        config: true,
        reset: true,
      },
      {
        action: 'reseller_login_register',
        title: t('sys.config.item.title.reseller_login_register'),
        desc: '配置登录页上的登录方式、代理商注册、找回密码以及会话过期时长, 对应的开关可控制登录页上对应功能的显示, 关闭代理商注册时, 通过邮箱登录也无法自动注册',
        config: true,
        reset: true,
      },
      {
        action: 'reseller_shield_error',
        title: t('sys.config.item.title.reseller_shield_error'),
        desc: '代理商查看调用日志错误时, 包含有配置错误内容时则屏蔽显示, 为空则屏蔽所有错误显示',
        open: configFormData.value.reseller_shield_error.open,
        config: true,
        reset: true,
      },
      {
        action: 'admin_login',
        title: t('sys.config.item.title.admin_login'),
        desc: '配置登录页上的登录方式、找回密码以及会话过期时长, 对应的开关可控制登录页上对应功能的显示',
        config: true,
        reset: true,
      },
      {
        action: 'quota',
        title: t('sys.config.item.title.quota'),
        desc: '配置额度预警参数默认值和各类开关, 用户如若有配置额度预警和预警阈值等, 将以用户的配置优先, 额度过期清零开关默认关闭, 可按需选择是否开启',
        config: true,
        reset: true,
      },
    ];
  };
  getSysConfigDetail();

  const handleUserShieldErrorAdd = () => {
    configFormData.value.user_shield_error.errors.push('');
  };

  const handleUserShieldErrorDel = (index: number) => {
    configFormData.value.user_shield_error.errors.splice(index, 1);
  };

  const handleResellerShieldErrorAdd = () => {
    configFormData.value.reseller_shield_error.errors.push('');
  };

  const handleResellerShieldErrorDel = (index: number) => {
    configFormData.value.reseller_shield_error.errors.splice(index, 1);
  };
</script>

<script lang="ts">
  export default {
    name: 'General',
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
