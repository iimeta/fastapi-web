<template>
  <a-spin :loading="loading" class="invite-overview-spin">
    <a-card
      class="general-card invite-overview"
      :header-style="cardHeaderStyle"
      :body-style="cardBodyStyle"
      :title="$t('invite.overview.dashboard_title')"
      :bordered="false"
    >
      <div class="ov-row invite-hero-row">
        <div class="ov-card ov-card--calls invite-code-card">
          <div class="ov-label">{{ $t('invite.columns.invite_code') }}</div>
          <div class="invite-code-row">
            <div
              class="ov-val ov-val--calls invite-code"
              :title="$t('invite.overview.click_copy_code')"
              @click="copyText(profile.invite_code)"
              >{{ profile.invite_code || '-' }}</div
            >
            <a-tooltip :content="$t('invite.overview.copy_link')">
              <icon-copy
                class="invite-copy-icon"
                @click="copyInviteLink(profile.invite_link)"
              />
            </a-tooltip>
          </div>
        </div>
        <div
          v-for="item in rewardRuleItems"
          :key="item.key"
          class="reward-card"
          :style="{ '--reward-color': item.color }"
        >
          <div class="reward-label">{{ item.label }}</div>
          <div class="reward-val">
            <template v-if="item.displayType === 'quota'">
              <Quota :model-value="item.value" />
            </template>
            <template v-else>{{ item.value }}%</template>
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
      <div v-if="profile.rule_text" class="invite-rule">
        <span>{{ $t('invite.columns.invite_rule_text') }}: </span>
        {{ profile.rule_text }}
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
      color: '#00b2ff',
    },
    {
      key: 'pending_quota',
      label: t('invite.columns.pending_quota'),
      value: profile.value.pending_quota || 0,
      color: '#ea8d24',
      quota: true,
    },
    {
      key: 'applying_quota',
      label: t('invite.columns.applying_quota'),
      value: profile.value.applying_quota || 0,
      color: '#23c343',
      quota: true,
    },
    {
      key: 'credited_quota',
      label: t('invite.columns.credited_quota'),
      value: profile.value.credited_quota || 0,
      color: '#ff7d00',
      quota: true,
    },
    {
      key: 'invite_min_apply_quota',
      label: t('invite.columns.invite_min_apply_quota'),
      value: profile.value.min_apply_quota || 0,
      color: '#eb2f96',
      quota: true,
    },
  ]);

  const rewardRuleItems = computed(() => {
    const items: {
      key: string;
      label: string;
      value: number;
      color: string;
      displayType: 'quota' | 'percent';
    }[] = [];
    if (profile.value.reward_quota > 0) {
      items.push({
        key: 'invite_reward',
        label: t('invite.columns.invite_reward_rule'),
        value: profile.value.reward_quota,
        color: '#7b61ff',
        displayType: 'quota',
      });
    }
    if (profile.value.grant_quota > 0) {
      items.push({
        key: 'invitee_grant',
        label: t('invite.columns.invitee_grant_rule'),
        value: profile.value.grant_quota,
        color: '#14C9C9',
        displayType: 'quota',
      });
    }
    if (profile.value.recharge_rebate_enabled) {
      if (profile.value.recharge_rebate_first_enabled) {
        const type = profile.value.recharge_rebate_first_type || 'percent';
        if (type === 'fixed' && profile.value.recharge_rebate_first_quota > 0) {
          items.push({
            key: 'rebate_first',
            label: t('invite.columns.first_recharge_rebate'),
            value: profile.value.recharge_rebate_first_quota,
            color: '#ff7d00',
            displayType: 'quota',
          });
        } else if (
          type === 'percent' &&
          profile.value.recharge_rebate_first_rate > 0
        ) {
          items.push({
            key: 'rebate_first',
            label: t('invite.columns.first_recharge_rebate'),
            value: profile.value.recharge_rebate_first_rate,
            color: '#ff7d00',
            displayType: 'percent',
          });
        }
      }
      if (profile.value.recharge_rebate_second_enabled) {
        const type = profile.value.recharge_rebate_second_type || 'percent';
        if (
          type === 'fixed' &&
          profile.value.recharge_rebate_second_quota > 0
        ) {
          items.push({
            key: 'rebate_second',
            label: t('invite.columns.following_recharge_rebate'),
            value: profile.value.recharge_rebate_second_quota,
            color: '#F7BA1E',
            displayType: 'quota',
          });
        } else if (
          type === 'percent' &&
          profile.value.recharge_rebate_second_rate > 0
        ) {
          items.push({
            key: 'rebate_second',
            label: t('invite.columns.following_recharge_rebate'),
            value: profile.value.recharge_rebate_second_rate,
            color: '#F7BA1E',
            displayType: 'percent',
          });
        }
      }
    }
    return items;
  });

  const copyText = async (value?: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    Message.success(t('invite.overview.copy_success'));
  };

  const copyInviteLink = async (value?: string) => {
    if (!value) return;
    const { protocol, hostname, port } = window.location;
    const defaultPort =
      (protocol === 'http:' && port === '80') ||
      (protocol === 'https:' && port === '443');
    const origin = `${protocol}//${hostname}${
      port && !defaultPort ? `:${port}` : ''
    }`;
    let path = value;
    if (/^https?:\/\//.test(value) || value.startsWith('//')) {
      const url = new URL(
        value.startsWith('//') ? `${protocol}${value}` : value
      );
      path = `${url.pathname}${url.search}${url.hash}`;
    } else if (!value.startsWith('/')) {
      path = `/${value}`;
    }
    await navigator.clipboard.writeText(`${origin}${path}`);
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

  .invite-hero-row {
    flex-wrap: wrap;
  }

  .invite-code-card {
    flex: 0 0 auto;
  }

  .invite-code-row {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  .invite-code {
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }

  .invite-copy-icon {
    font-size: 20px;
    color: #3469ff;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;

    &:hover {
      opacity: 1;
    }
  }

  .reward-card {
    flex: 1 1 0;
    min-width: 100px;
    background: var(--color-fill-1);
    border-radius: 4px;
    padding: 14px 16px;
    border-left: 3px solid var(--reward-color);
  }

  .reward-label {
    font-size: 12px;
    color: var(--color-text-3);
    margin-bottom: 6px;
    white-space: nowrap;
  }

  .reward-val {
    font-size: 24px;
    font-weight: 700;
    line-height: 1.2;
    font-variant-numeric: tabular-nums;
    color: var(--reward-color);
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
</style>
