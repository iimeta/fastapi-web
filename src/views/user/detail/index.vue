<template>
  <div class="detail-container">
    <a-descriptions :column="2" bordered :value-style="descriptionValueStyle">
      <a-descriptions-item :label="$t('common.user_id')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.user_id }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.reseller_id')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.rid || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.account')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.account }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.name')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.name }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.email')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.email }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.current_quota')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <Quota :model-value="currentData.quota" />
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.used_quota')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <Quota :model-value="currentData.used_quota" />
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('user.label.quota_expires_at')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.quota_expires_at || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.cycle_reset')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`dict.${currentData?.is_cycle_reset_quota || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.reset_quota')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <Quota
            v-if="currentData.is_cycle_reset_quota"
            :model-value="currentData.reset_quota"
          />
          <span v-else>-</span>
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.cycle_period')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <span v-if="currentData.is_cycle_reset_quota">
            {{ currentData.cycle_period }}
            {{ $t(`unit.${currentData.period_unit}`) }}
            {{ $t(`dict.reset_mode.${currentData.reset_mode}`) }}
          </span>
          <span v-else>-</span>
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.reset_at')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <span v-if="currentData.is_cycle_reset_quota">
            {{ currentData.reset_at || '-' }}
          </span>
          <span v-else>-</span>
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.next_reset_at')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <span v-if="currentData.is_cycle_reset_quota">
            {{ currentData.next_reset_at || '-' }}
          </span>
          <span v-else>-</span>
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('user.detail.quota_warning')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            $t(
              `dict.open.${
                currentData.quota_warning ||
                (currentData.warning_threshold === 0 &&
                  currentData.expire_warning_threshold === 0)
              }`
            )
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('user.detail.warning_threshold')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <Quota :model-value="currentData.warning_threshold" />
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('user.detail.expire_warning_threshold')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.expire_warning_threshold }}{{ $t('unit.day') }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('user.detail.warning_notice')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`dict.notice.${currentData.warning_notice || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('user.detail.expire_warning_notice')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`dict.notice.${currentData.expire_warning_notice || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('user.detail.exhaustion_notice')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`dict.notice.${currentData.exhaustion_notice || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('user.detail.expire_notice')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`dict.notice.${currentData.expire_notice || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.groups')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="detail-textarea detail-textarea--tall">
          {{ currentData?.group_names?.join('\n') || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.remark')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="detail-textarea detail-textarea--compact">
          {{ currentData.remark || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="$t('user.detail.privacy_settings')"
        :span="2"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="3" />
        </a-skeleton>
        <div v-else>
          <div class="privacy-detail-status">
            <a-tag :color="isPrivacyConfigured ? 'green' : 'orange'">
              {{
                isPrivacyConfigured
                  ? $t('user.detail.privacy_configured')
                  : $t('user.detail.privacy_unconfigured')
              }}
            </a-tag>
          </div>
          <div class="privacy-detail">
            <div
              v-for="item in privacyItems"
              :key="item.key"
              class="privacy-detail-item"
            >
              <div class="privacy-detail-title">
                <span>{{ item.title }}</span>
                <a-tag :color="item.enabled ? 'green' : 'red'" size="small">
                  {{ $t(`dict.open.${item.enabled}`) }}
                </a-tag>
              </div>
              <div class="privacy-detail-fields">
                <a-tag
                  v-for="field in item.fields"
                  :key="field"
                  color="arcoblue"
                  size="small"
                >
                  {{ field }}
                </a-tag>
                <span v-if="item.fields.length === 0" class="privacy-empty">
                  -
                </span>
              </div>
            </div>
          </div>
        </div>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('invite.columns.inviter_user_id')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.inviter_user_id || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('invite.columns.invite_code')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.invite_code || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('user.detail.login_ip')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.login_ip || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('user.detail.login_time')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.login_time || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('user.detail.login_domain')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.login_domain || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.status')">
        <a-tag v-if="currentData.status === 1" color="green">
          {{ $t(`dict.status.${currentData.status}`) }}
        </a-tag>
        <a-tag v-else color="red">
          {{ $t(`dict.status.${currentData.status}`) }}
        </a-tag>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.created_at')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.created_at }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.updated_at')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.updated_at }}
        </span>
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import {
    queryUserDetail,
    UserDetailParams,
    UserDetail,
    UserPrivacy,
  } from '@/api/admin_user';
  import {
    LogPrivacy,
    PrivacyLogFieldOption,
    querySysConfigDetail,
  } from '@/api/sys_config';
  import Quota from '@/views/common/quota.vue';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const currentData = ref<UserDetail>({} as UserDetail);
  const logPrivacy = ref<LogPrivacy>();
  const descriptionValueStyle = {
    width: '350px',
    padding: '5px 8px 5px 20px',
  };
  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
  });

  const privacyFieldLabel = (
    key: string,
    fields: PrivacyLogFieldOption[] = []
  ) => {
    const field = fields.find((item) => item.key === key);
    return field?.label || key;
  };

  const isPrivacyConfigured = computed(
    () => currentData.value?.privacy?.is_configured || false
  );

  const defaultPrivacyFields = (fields: PrivacyLogFieldOption[] = []) =>
    fields.filter((item) => item.enabled && item.key).map((item) => item.key);

  const effectivePrivacy = computed<UserPrivacy>(() => {
    const privacy = currentData.value?.privacy;
    const privacyConfig = logPrivacy.value;
    if (privacy?.is_configured) {
      return privacy;
    }
    return {
      is_configured: false,
      log_request_content:
        !!privacyConfig?.is_enable_request &&
        !!privacyConfig?.is_default_enable_request,
      log_response_content:
        !!privacyConfig?.is_enable_response &&
        !!privacyConfig?.is_default_enable_response,
      log_resource_url:
        !!privacyConfig?.is_enable_resource &&
        !!privacyConfig?.is_default_enable_resource,
      log_client_ip:
        !!privacyConfig?.is_enable_network &&
        !!privacyConfig?.is_default_enable_network,
      log_request_fields:
        privacyConfig?.is_enable_request &&
        privacyConfig?.is_default_enable_request
          ? defaultPrivacyFields(privacyConfig.request_privacy_fields)
          : [],
      log_response_fields:
        privacyConfig?.is_enable_response &&
        privacyConfig?.is_default_enable_response
          ? defaultPrivacyFields(privacyConfig.response_privacy_fields)
          : [],
      log_resource_fields:
        privacyConfig?.is_enable_resource &&
        privacyConfig?.is_default_enable_resource
          ? defaultPrivacyFields(privacyConfig.resource_privacy_fields)
          : [],
      log_network_fields:
        privacyConfig?.is_enable_network &&
        privacyConfig?.is_default_enable_network
          ? defaultPrivacyFields(privacyConfig.network_privacy_fields)
          : [],
    };
  });

  const privacyItems = computed(() => {
    const privacy = effectivePrivacy.value;
    const privacyConfig = logPrivacy.value;
    return [
      {
        key: 'request',
        title: t('user.center.privacy.request'),
        enabled: privacy.log_request_content,
        fields: privacy.log_request_fields.map((key) =>
          privacyFieldLabel(key, privacyConfig?.request_privacy_fields)
        ),
      },
      {
        key: 'response',
        title: t('user.center.privacy.response'),
        enabled: privacy.log_response_content,
        fields: privacy.log_response_fields.map((key) =>
          privacyFieldLabel(key, privacyConfig?.response_privacy_fields)
        ),
      },
      {
        key: 'resource',
        title: t('user.center.privacy.resource'),
        enabled: privacy.log_resource_url,
        fields: privacy.log_resource_fields.map((key) =>
          privacyFieldLabel(key, privacyConfig?.resource_privacy_fields)
        ),
      },
      {
        key: 'network',
        title: t('user.center.privacy.client_ip'),
        enabled: privacy.log_client_ip,
        fields: privacy.log_network_fields.map((key) =>
          privacyFieldLabel(key, privacyConfig?.network_privacy_fields)
        ),
      },
    ];
  });

  const getUserDetail = async (params: UserDetailParams = { id: props.id }) => {
    setLoading(true);
    try {
      const [userRes, configRes] = await Promise.all([
        queryUserDetail(params),
        querySysConfigDetail(),
      ]);
      currentData.value = userRes.data;
      logPrivacy.value = configRes.data.log?.privacy;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getUserDetail();
</script>

<script lang="ts">
  export default {
    name: 'UserDetail',
  };
</script>

<style scoped lang="less">
  // 公共骨架已由 global.less 全局提供

  .privacy-detail {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 8px 16px;
    width: 100%;
  }

  .privacy-detail-status {
    margin-bottom: 8px;
  }

  .privacy-detail-item {
    min-width: 0;
  }

  .privacy-detail-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    color: var(--color-text-1);
  }

  .privacy-detail-fields {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    min-height: 24px;
  }

  .privacy-empty {
    color: rgb(var(--gray-6));
  }
</style>
