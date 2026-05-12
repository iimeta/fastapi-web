<template>
  <a-spin :loading="loading" class="privacy-settings">
    <a-list :bordered="false">
      <a-list-item v-if="requestFields.length > 0">
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
                <div class="field-options">
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
                </div>
              </a-checkbox-group>
            </div>
            <div class="operation">
              <a-switch v-model="form.log_request_content" />
            </div>
          </template>
        </a-list-item-meta>
      </a-list-item>

      <a-list-item v-if="responseFields.length > 0">
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
                <div class="field-options">
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
                </div>
              </a-checkbox-group>
            </div>
            <div class="operation">
              <a-switch v-model="form.log_response_content" />
            </div>
          </template>
        </a-list-item-meta>
      </a-list-item>

      <a-list-item v-if="resourceFields.length > 0">
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
                <div class="field-options">
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
                </div>
              </a-checkbox-group>
            </div>
            <div class="operation">
              <a-switch v-model="form.log_resource_url" />
            </div>
          </template>
        </a-list-item-meta>
      </a-list-item>

      <a-list-item v-if="networkFields.length > 0">
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
                <div class="field-options">
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
                </div>
              </a-checkbox-group>
            </div>
            <div class="operation">
              <a-switch v-model="form.log_client_ip" />
            </div>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </a-spin>
</template>

<script lang="ts" setup>
  import {
    computed,
    nextTick,
    onBeforeUnmount,
    reactive,
    ref,
    watch,
  } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import {
    getPrivacySettings,
    LogPrivacy,
    PrivacyLogFieldOption,
    updatePrivacySettings,
    UserPrivacy,
  } from '@/api/user-center';

  const loading = ref(false);
  const saving = ref(false);
  const initialized = ref(false);
  const pendingSave = ref(false);
  let saveTimer: ReturnType<typeof setTimeout> | undefined;

  const defaultPrivacy = (): UserPrivacy => ({
    is_configured: false,
    log_request_content: false,
    log_response_content: false,
    log_resource_url: false,
    log_client_ip: false,
    log_request_fields: [],
    log_response_fields: [],
    log_resource_fields: [],
    log_network_fields: [],
  });

  const defaultLogPrivacy = (): LogPrivacy => ({
    is_enable_request: false,
    is_default_enable_request: false,
    request_privacy_fields: [],
    is_enable_response: false,
    is_default_enable_response: false,
    response_privacy_fields: [],
    is_enable_resource: false,
    is_default_enable_resource: false,
    resource_privacy_fields: [],
    is_enable_network: false,
    is_default_enable_network: false,
    network_privacy_fields: [],
  });

  const form = reactive<UserPrivacy>(defaultPrivacy());
  const logPrivacy = ref<LogPrivacy>(defaultLogPrivacy());

  const sortFields = (fields: PrivacyLogFieldOption[]) =>
    [...(fields || [])]
      .filter((item) => item.enabled)
      .sort((a, b) => (a.sort || 0) - (b.sort || 0));

  const requestFields = computed(() =>
    logPrivacy.value.is_enable_request
      ? sortFields(logPrivacy.value.request_privacy_fields)
      : []
  );
  const responseFields = computed(() =>
    logPrivacy.value.is_enable_response
      ? sortFields(logPrivacy.value.response_privacy_fields)
      : []
  );
  const resourceFields = computed(() =>
    logPrivacy.value.is_enable_resource
      ? sortFields(logPrivacy.value.resource_privacy_fields)
      : []
  );
  const networkFields = computed(() =>
    logPrivacy.value.is_enable_network
      ? sortFields(logPrivacy.value.network_privacy_fields)
      : []
  );

  const fieldKeys = (fields: PrivacyLogFieldOption[]) =>
    fields.map((item) => item.key).filter((key) => !!key);

  const setForm = (data: UserPrivacy) => {
    Object.assign(form, defaultPrivacy(), data);
  };

  const getData = async () => {
    loading.value = true;
    initialized.value = false;
    try {
      const { data } = await getPrivacySettings();
      logPrivacy.value = data.log_privacy || defaultLogPrivacy();
      setForm(data.privacy || defaultPrivacy());
      await nextTick();
      initialized.value = true;
    } finally {
      loading.value = false;
    }
  };

  const saveData = async () => {
    if (saving.value) {
      pendingSave.value = true;
      return;
    }
    saving.value = true;
    try {
      const { data } = await updatePrivacySettings({
        ...JSON.parse(JSON.stringify(form)),
        is_configured: true,
      });
      if (!pendingSave.value) {
        initialized.value = false;
        logPrivacy.value = data.log_privacy || logPrivacy.value;
        setForm(data.privacy || defaultPrivacy());
        await nextTick();
        initialized.value = true;
      }
    } finally {
      saving.value = false;
      if (pendingSave.value) {
        pendingSave.value = false;
        queueSave();
      }
    }
  };

  const queueSave = () => {
    if (!initialized.value || loading.value) return;
    if (saving.value) {
      pendingSave.value = true;
      return;
    }
    if (saveTimer) {
      clearTimeout(saveTimer);
    }
    saveTimer = setTimeout(() => {
      saveData().catch((err) => {
        Message.error(err?.message || 'Save failed');
      });
    }, 500);
  };

  watch(
    () => form.log_request_content,
    (value, oldValue) => {
      if (
        !initialized.value ||
        !value ||
        oldValue ||
        form.log_request_fields.length > 0
      ) {
        return;
      }
      form.log_request_fields = fieldKeys(requestFields.value);
    }
  );

  watch(
    () => form.log_request_fields,
    (fields) => {
      if (
        initialized.value &&
        form.log_request_content &&
        fields.length === 0
      ) {
        form.log_request_content = false;
      }
    },
    { deep: true }
  );

  watch(
    () => form.log_response_content,
    (value, oldValue) => {
      if (
        !initialized.value ||
        !value ||
        oldValue ||
        form.log_response_fields.length > 0
      ) {
        return;
      }
      form.log_response_fields = fieldKeys(responseFields.value);
    }
  );

  watch(
    () => form.log_response_fields,
    (fields) => {
      if (
        initialized.value &&
        form.log_response_content &&
        fields.length === 0
      ) {
        form.log_response_content = false;
      }
    },
    { deep: true }
  );

  watch(
    () => form.log_resource_url,
    (value, oldValue) => {
      if (
        !initialized.value ||
        !value ||
        oldValue ||
        form.log_resource_fields.length > 0
      ) {
        return;
      }
      form.log_resource_fields = fieldKeys(resourceFields.value);
    }
  );

  watch(
    () => form.log_resource_fields,
    (fields) => {
      if (initialized.value && form.log_resource_url && fields.length === 0) {
        form.log_resource_url = false;
      }
    },
    { deep: true }
  );

  watch(
    () => form.log_client_ip,
    (value, oldValue) => {
      if (
        !initialized.value ||
        !value ||
        oldValue ||
        form.log_network_fields.length > 0
      ) {
        return;
      }
      form.log_network_fields = fieldKeys(networkFields.value);
    }
  );

  watch(
    () => form.log_network_fields,
    (fields) => {
      if (initialized.value && form.log_client_ip && fields.length === 0) {
        form.log_client_ip = false;
      }
    },
    { deep: true }
  );

  watch(form, queueSave, { deep: true });

  onBeforeUnmount(() => {
    if (saveTimer) {
      clearTimeout(saveTimer);
    }
  });

  getData();
</script>

<script lang="ts">
  export default {
    name: 'PrivacySettings',
  };
</script>

<style scoped lang="less">
  .privacy-settings {
    display: block;
    width: 100%;
  }

  :deep(.arco-spin-children),
  :deep(.arco-list) {
    width: 100%;
  }

  :deep(.arco-list-item) {
    width: 100%;
    padding: 20px 20px 20px 0;

    &:not(:last-child) {
      border-bottom: none;
    }

    .arco-typography {
      margin-bottom: 0;
      white-space: nowrap;
    }
    .arco-list-item-meta-avatar {
      width: 96px;
      min-width: 96px;
      margin-right: 20px;
    }
    .arco-list-item-meta {
      padding: 0;
      width: 100%;
      align-items: flex-start;
    }
  }

  :deep(.arco-list-item-meta-content) {
    flex: 1;
    width: 100%;
    min-width: 0;
    border-bottom: 1px solid var(--color-neutral-3);
    padding-bottom: 20px;
    .arco-list-item-meta-description {
      display: grid;
      grid-template-columns: clamp(220px, 24%, 320px) minmax(0, 1fr) 52px;
      align-items: flex-start;
      gap: 20px 24px;
      .tip {
        width: 100%;
        max-width: 320px;
        color: rgb(var(--gray-6));
        line-height: 20px;
        white-space: normal;
        word-break: break-word;
      }
      .content {
        flex: 1 1 0;
        width: 100%;
        min-width: 0;
      }
      .operation {
        width: 52px;
        min-width: 52px;
        text-align: right;
      }
    }
  }

  .field-options {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 8px 20px;
    width: 100%;
  }

  :deep(.arco-checkbox-group) {
    display: block;
    width: 100%;
  }

  :deep(.arco-checkbox) {
    display: grid;
    grid-template-columns: 18px minmax(0, 1fr);
    align-items: flex-start;
    column-gap: 8px;
    width: 100%;
    min-width: 0;
    margin: 0;

    .arco-checkbox-icon {
      grid-column: 1;
      margin-top: 3px;
    }

    .arco-checkbox-label {
      grid-column: 2;
      min-width: 0;
      margin-left: 0;
      line-height: 20px;
    }
  }

  .field-name {
    display: block;
    min-width: 0;
    line-height: 20px;
  }

  .field-desc {
    display: block;
    min-width: 0;
    color: rgb(var(--gray-6));
    font-size: 12px;
    line-height: 18px;
    white-space: normal;
    word-break: break-word;
  }

  @media (max-width: 992px) {
    :deep(.arco-list-item-meta-content) {
      .arco-list-item-meta-description {
        grid-template-columns: minmax(180px, 30%) minmax(0, 1fr) 52px;
        gap: 12px 16px;
      }
    }

    .field-options {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    }
  }

  @media (max-width: 768px) {
    :deep(.arco-list-item) {
      padding: 16px 12px 16px 0;
    }

    :deep(.arco-list-item-meta) {
      display: flex;
      align-items: flex-start;
    }

    :deep(.arco-list-item-meta-avatar) {
      width: 82px !important;
      min-width: 82px !important;
      margin-right: 12px !important;
    }

    :deep(.arco-list-item-meta-content) {
      .arco-list-item-meta-description {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 52px;
        gap: 10px 12px;
      }

      .tip {
        grid-column: 1 / 3;
        width: auto;
        min-width: 0;
        max-width: 100%;
      }

      .content {
        grid-column: 1 / 2;
      }

      .operation {
        grid-column: 2 / 3;
        grid-row: 2;
      }
    }

    .field-options {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
