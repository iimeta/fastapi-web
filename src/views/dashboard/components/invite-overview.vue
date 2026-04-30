<template>
  <a-spin :loading="loading" class="invite-overview-spin">
    <a-card
      class="general-card invite-overview"
      :header-style="cardHeaderStyle"
      :body-style="cardBodyStyle"
      :title="$t('invite.overview.dashboard_title')"
      :bordered="false"
    >
      <div class="ov-row invite-main-row">
        <div class="ov-card ov-card--calls">
          <div class="ov-label">{{ $t('invite.columns.invite_code') }}</div>
          <div class="invite-code-row">
            <div class="ov-val ov-val--calls invite-code">{{
              profile.invite_code || '-'
            }}</div>
            <a-button size="mini" @click="copyText(profile.invite_code)">{{
              $t('button.copy')
            }}</a-button>
          </div>
        </div>
        <div class="ov-card ov-card--spend">
          <div class="ov-label">{{ $t('invite.columns.invite_link') }}</div>
          <div class="invite-link-row">
            <div class="invite-link">{{ displayInviteLink }}</div>
            <a-button
              size="mini"
              @click="copyInviteLink(profile.invite_link)"
              >{{ $t('button.copy') }}</a-button
            >
          </div>
        </div>
      </div>
      <div class="ov-row ov-row-sm">
        <div
          v-for="item in overviewItems"
          :key="item.key"
          class="ov-card-sm"
          :style="{ borderLeft: `3px solid ${item.color}` }"
        >
          <div class="ov-label-sm">{{ item.label }}</div>
          <div class="ov-val-sm" :style="{ color: item.color }">
            <template v-if="item.quota">
              <Quota :model-value="item.value" />
            </template>
            <template v-else>{{ item.value.toLocaleString() }}</template>
          </div>
        </div>
      </div>
      <div v-if="profile.invite_rule_text" class="invite-rule">
        <span>{{ $t('invite.columns.invite_rule_text') }}：</span
        >{{ profile.invite_rule_text }}
      </div>
      <div
        v-if="rechargeRebateRules.length"
        class="invite-rule invite-rebate-rules"
      >
        <span>{{ $t('invite.columns.recharge_rebate_rule') }}：</span>
        <div
          v-for="rule in rechargeRebateRules"
          :key="rule.key"
          class="invite-rebate-rule"
        >
          {{ rule.label }}：
          <Quota v-if="rule.type === 'fixed'" :model-value="rule.value" />
          <template v-else>{{ rule.value }}%</template>
        </div>
      </div>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import { queryInviteProfile, InviteProfile } from '@/api/invite';
  import Quota from '@/views/common/quota.vue';

  const { t } = useI18n();
  const cardHeaderStyle = { padding: '15px 20px 8px 20px' };
  const cardBodyStyle = { padding: '10px 20px' };
  const { loading, setLoading } = useLoading(true);
  const profile = ref({} as InviteProfile);

  const overviewItems = computed(() => [
    {
      key: 'total_invites',
      label: t('invite.columns.total_invites'),
      value: profile.value.total_invites || 0,
      color: '#3469ff',
    },
    {
      key: 'pending_quota',
      label: t('invite.columns.pending_quota'),
      value: profile.value.pending_quota || 0,
      color: '#f7ba1e',
      quota: true,
    },
    {
      key: 'applying_quota',
      label: t('invite.columns.applying_quota'),
      value: profile.value.applying_quota || 0,
      color: '#ea8d24',
      quota: true,
    },
    {
      key: 'credited_quota',
      label: t('invite.columns.credited_quota'),
      value: profile.value.credited_quota || 0,
      color: '#23c343',
      quota: true,
    },
    {
      key: 'invite_min_apply_quota',
      label: t('invite.columns.invite_min_apply_quota'),
      value: profile.value.invite_min_apply_quota || 0,
      color: '#722ed1',
      quota: true,
    },
  ]);

  const formatRechargeRebateValue = (
    type: string,
    rate: number,
    quota: number
  ) => {
    if (type === 'fixed') {
      return quota || 0;
    }
    return rate || 0;
  };

  const rechargeRebateRules = computed(() => {
    if (!profile.value.invite_recharge_rebate_enabled) {
      return [];
    }
    const rules = [];
    if (profile.value.invite_recharge_rebate_first_enabled) {
      const type = profile.value.invite_recharge_rebate_first_type || 'percent';
      const value = formatRechargeRebateValue(
        type,
        profile.value.invite_recharge_rebate_first_rate,
        profile.value.invite_recharge_rebate_first_quota
      );
      if (value > 0) {
        rules.push({
          key: 'first',
          label: t('invite.columns.first_recharge_rebate'),
          type,
          value,
        });
      }
    }
    if (profile.value.invite_recharge_rebate_second_enabled) {
      const type =
        profile.value.invite_recharge_rebate_second_type || 'percent';
      const value = formatRechargeRebateValue(
        type,
        profile.value.invite_recharge_rebate_second_rate,
        profile.value.invite_recharge_rebate_second_quota
      );
      if (value > 0) {
        rules.push({
          key: 'second',
          label: t('invite.columns.following_recharge_rebate'),
          type,
          value,
        });
      }
    }
    return rules;
  });

  const getCurrentOrigin = () => {
    const { protocol, hostname, port } = window.location;
    const defaultPort =
      (protocol === 'http:' && port === '80') ||
      (protocol === 'https:' && port === '443');
    return `${protocol}//${hostname}${port && !defaultPort ? `:${port}` : ''}`;
  };

  const buildInviteLink = (value?: string) => {
    if (!value) return '';
    if (/^https?:\/\//.test(value)) {
      const url = new URL(value);
      return `${getCurrentOrigin()}${url.pathname}${url.search}${url.hash}`;
    }
    if (value.startsWith('//')) {
      const url = new URL(`${window.location.protocol}${value}`);
      return `${getCurrentOrigin()}${url.pathname}${url.search}${url.hash}`;
    }
    return `${getCurrentOrigin()}${
      value.startsWith('/') ? value : `/${value}`
    }`;
  };

  const displayInviteLink = computed(
    () => buildInviteLink(profile.value.invite_link) || '-'
  );

  const copyText = async (value?: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    Message.success(t('invite.overview.copy_success'));
  };

  const copyInviteLink = async (value?: string) => {
    const inviteLink = buildInviteLink(value);
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    Message.success(t('invite.overview.copy_success'));
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await queryInviteProfile();
      profile.value = data;
    } finally {
      setLoading(false);
    }
  };

  fetchData();
</script>

<script lang="ts">
  export default {
    name: 'InviteOverview',
  };
</script>

<style scoped lang="less">
  @import '@/views/statistics/style/statistics-overview-shared.less';

  .invite-overview-spin {
    display: block;
    width: 100%;
    margin-top: 10px;
  }

  .invite-overview {
    width: 100%;
  }

  .invite-main-row {
    @media (max-width: 1200px) {
      flex-direction: column;
    }
  }

  .invite-code-row,
  .invite-link-row {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  .invite-code {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .invite-link {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--color-text-1);
    line-height: 22px;
    font-size: 16px;
  }

  .invite-rule {
    margin-top: 11px;
    padding: 10px 14px;
    border-radius: 4px;
    background: var(--color-fill-1);
    color: var(--color-text-2);
    font-size: 12px;
    line-height: 1.6;

    span {
      color: var(--color-text-1);
      font-weight: 500;
    }
  }

  .invite-rebate-rules {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px 12px;
  }

  .invite-rebate-rule {
    display: inline-flex;
    align-items: center;
    gap: 2px;
  }
</style>
