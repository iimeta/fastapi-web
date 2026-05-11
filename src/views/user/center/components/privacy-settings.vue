<template>
  <a-spin :loading="loading">
    <a-list :bordered="false">
      <a-list-item>
        <a-list-item-meta>
          <template #avatar>
            <a-typography-paragraph>
              {{ $t('user.center.privacy.request') }}
            </a-typography-paragraph>
          </template>
          <template #description>
            <div class="tip">
              {{ $t('user.center.privacy.tip.request') }}
            </div>
            <div class="content">
              <a-checkbox-group v-model="form.log_request_fields">
                <a-space wrap>
                  <a-checkbox
                    v-for="item in requestFields"
                    :key="item.key"
                    :value="item.key"
                    :disabled="!form.log_request_content"
                  >
                    <span class="field-name">{{ item.label }}</span>
                    <span v-if="item.description" class="field-desc">
                      {{ item.description }}
                    </span>
                  </a-checkbox>
                </a-space>
              </a-checkbox-group>
            </div>
            <div class="operation">
              <a-switch v-model="form.log_request_content" />
            </div>
          </template>
        </a-list-item-meta>
      </a-list-item>

      <a-list-item>
        <a-list-item-meta>
          <template #avatar>
            <a-typography-paragraph>
              {{ $t('user.center.privacy.response') }}
            </a-typography-paragraph>
          </template>
          <template #description>
            <div class="tip">
              {{ $t('user.center.privacy.tip.response') }}
            </div>
            <div class="content">
              <a-checkbox-group v-model="form.log_response_fields">
                <a-space wrap>
                  <a-checkbox
                    v-for="item in responseFields"
                    :key="item.key"
                    :value="item.key"
                    :disabled="!form.log_response_content"
                  >
                    <span class="field-name">{{ item.label }}</span>
                    <span v-if="item.description" class="field-desc">
                      {{ item.description }}
                    </span>
                  </a-checkbox>
                </a-space>
              </a-checkbox-group>
            </div>
            <div class="operation">
              <a-switch v-model="form.log_response_content" />
            </div>
          </template>
        </a-list-item-meta>
      </a-list-item>

      <a-list-item>
        <a-list-item-meta>
          <template #avatar>
            <a-typography-paragraph>
              {{ $t('user.center.privacy.resource') }}
            </a-typography-paragraph>
          </template>
          <template #description>
            <div class="tip">
              {{ $t('user.center.privacy.tip.resource') }}
            </div>
            <div class="content">
              <a-checkbox-group v-model="form.log_resource_fields">
                <a-space wrap>
                  <a-checkbox
                    v-for="item in resourceFields"
                    :key="item.key"
                    :value="item.key"
                    :disabled="!form.log_resource_url"
                  >
                    <span class="field-name">{{ item.label }}</span>
                    <span v-if="item.description" class="field-desc">
                      {{ item.description }}
                    </span>
                  </a-checkbox>
                </a-space>
              </a-checkbox-group>
            </div>
            <div class="operation">
              <a-switch v-model="form.log_resource_url" />
            </div>
          </template>
        </a-list-item-meta>
      </a-list-item>

      <a-list-item>
        <a-list-item-meta>
          <template #avatar>
            <a-typography-paragraph>
              {{ $t('user.center.privacy.client_ip') }}
            </a-typography-paragraph>
          </template>
          <template #description>
            <div class="tip">
              {{ $t('user.center.privacy.tip.client_ip') }}
            </div>
            <div class="content">
              <a-checkbox-group v-model="form.log_network_fields">
                <a-space wrap>
                  <a-checkbox
                    v-for="item in networkFields"
                    :key="item.key"
                    :value="item.key"
                    :disabled="!form.log_client_ip"
                  >
                    <span class="field-name">{{ item.label }}</span>
                    <span v-if="item.description" class="field-desc">
                      {{ item.description }}
                    </span>
                  </a-checkbox>
                </a-space>
              </a-checkbox-group>
            </div>
            <div class="operation">
              <a-switch v-model="form.log_client_ip" />
            </div>
          </template>
        </a-list-item-meta>
      </a-list-item>

      <a-list-item>
        <a-list-item-meta>
          <template #avatar>
            <span />
          </template>
          <template #description>
            <div class="tip" />
            <div class="content">
              <a-space>
                <a-button :loading="saving" type="primary" @click="handleSave">
                  {{ $t('button.save') }}
                </a-button>
                <a-button @click="handleReset">
                  {{ $t('button.reset') }}
                </a-button>
              </a-space>
            </div>
            <div class="operation" />
          </template>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </a-spin>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import {
    getPrivacyLogFields,
    getPrivacySettings,
    PrivacyLogFieldOption,
    updatePrivacySettings,
    UserPrivacy,
  } from '@/api/user-center';

  const { t } = useI18n();
  const loading = ref(false);
  const saving = ref(false);
  const fields = ref<PrivacyLogFieldOption[]>([]);

  const defaultPrivacy = (): UserPrivacy => ({
    log_request_content: false,
    log_response_content: false,
    log_resource_url: false,
    log_client_ip: false,
    log_request_fields: [],
    log_response_fields: [],
    log_resource_fields: [],
    log_network_fields: [],
  });

  const form = reactive<UserPrivacy>(defaultPrivacy());
  const origin = ref<UserPrivacy>(defaultPrivacy());

  const categoryFields = (category: string) =>
    computed(() =>
      fields.value
        .filter((item) => item.category === category)
        .sort((a, b) => (a.sort || 0) - (b.sort || 0))
    );

  const requestFields = categoryFields('request');
  const responseFields = categoryFields('response');
  const resourceFields = categoryFields('resource');
  const networkFields = categoryFields('network');

  const setForm = (data: UserPrivacy) => {
    Object.assign(form, defaultPrivacy(), data);
    origin.value = JSON.parse(JSON.stringify(form));
  };

  const getData = async () => {
    loading.value = true;
    try {
      const [privacyRes, fieldRes] = await Promise.all([
        getPrivacySettings(),
        getPrivacyLogFields(),
      ]);
      fields.value = fieldRes.data.items || [];
      setForm(privacyRes.data || defaultPrivacy());
    } finally {
      loading.value = false;
    }
  };

  const handleSave = async () => {
    if (saving.value) return;
    saving.value = true;
    try {
      await updatePrivacySettings(form);
      origin.value = JSON.parse(JSON.stringify(form));
      Message.success(t('success.save'));
    } finally {
      saving.value = false;
    }
  };

  const handleReset = () => {
    Object.assign(form, JSON.parse(JSON.stringify(origin.value)));
  };

  getData();
</script>

<script lang="ts">
  export default {
    name: 'PrivacySettings',
  };
</script>

<style scoped lang="less">
  :deep(.arco-list-item) {
    &:not(:last-child) {
      border-bottom: none;
    }

    .arco-typography {
      margin-bottom: 20px;
    }
    .arco-list-item-meta-avatar {
      width: 110px;
      margin-right: 24px;
    }
    .arco-list-item-meta {
      padding: 0;
    }
  }

  :deep(.arco-list-item-meta-content) {
    flex: 1;
    border-bottom: 1px solid var(--color-neutral-3);
    .arco-list-item-meta-description {
      display: flex;
      .tip {
        width: 30%;
        color: rgb(var(--gray-6));
        margin-right: 24px;
      }
      .content {
        flex: 1 1 0;
      }
      .operation {
        width: 70px;
        margin-right: 6px;
        text-align: right;
      }
    }
  }

  :deep(.arco-checkbox) {
    align-items: flex-start;
    min-width: 180px;
    margin-bottom: 8px;
  }

  .field-name {
    display: block;
    line-height: 20px;
  }

  .field-desc {
    display: block;
    max-width: 220px;
    color: rgb(var(--gray-6));
    font-size: 12px;
    line-height: 18px;
    white-space: normal;
  }
</style>
