<template>
  <div class="detail-container">
    <a-descriptions :column="1" bordered :value-style="descriptionValueStyle">
      <a-descriptions-item :label="$t('site.config.label.domain')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.domain }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('site.config.label.title')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.title }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('site.config.label.logo')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="detail-textarea detail-textarea--compact">
          {{ currentData.logo }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('site.config.label.favicon')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="detail-textarea detail-textarea--compact">
          {{ currentData.favicon }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('site.config.label.avatar')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="detail-textarea detail-textarea--compact">
          {{ currentData.avatar || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('site.config.label.bg_img')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="detail-textarea detail-textarea--compact">
          {{ currentData.bg_img || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('site.config.label.copyright')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="site-config-detail-scroll">
          {{ currentData.copyright || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('site.config.label.jump_url')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="site-config-detail-scroll">
          {{ currentData.jump_url || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('site.config.label.keywords')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="site-config-detail-scroll">
          {{ currentData.keywords || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('site.config.label.description')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="site-config-detail-scroll">
          {{ currentData.description || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('site.config.label.icp_beian')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.icp_beian || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('site.config.label.ga_beian')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.ga_beian || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('site.config.label.register_tips')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="site-config-detail-scroll">
          {{ currentData.register_tips || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('site.config.label.invite_enabled')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <a-tag :color="currentData.invite_enabled ? 'green' : 'red'">
            {{
              currentData.invite_enabled ? $t('common.yes') : $t('common.no')
            }}
          </a-tag>
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="$t('site.config.label.invite_code_required')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <a-tag :color="currentData.invite_code_required ? 'green' : 'red'">
            {{
              currentData.invite_code_required
                ? $t('common.yes')
                : $t('common.no')
            }}
          </a-tag>
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('site.config.label.invite_reward_quota')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <Quota
            v-if="currentData.invite_reward_quota"
            :model-value="currentData.invite_reward_quota"
          />
          <span v-else> - </span>
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('site.config.label.invitee_grant_quota')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <Quota
            v-if="currentData.invitee_grant_quota"
            :model-value="currentData.invitee_grant_quota"
          />
          <span v-else> - </span>
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="$t('site.config.label.invite_min_apply_quota')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <Quota
            v-if="currentData.invite_min_apply_quota"
            :model-value="currentData.invite_min_apply_quota"
          />
          <span v-else> - </span>
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('site.config.label.invite_daily_limit')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.invite_daily_limit || $t('common.no_limit') }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('site.config.label.invite_total_limit')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.invite_total_limit || $t('common.no_limit') }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="$t('site.config.label.invite_ip_daily_limit')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.invite_ip_daily_limit || $t('common.no_limit') }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="$t('site.config.label.invite_ip_total_limit')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.invite_ip_total_limit || $t('common.no_limit') }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="$t('site.config.label.invite_ip_per_inviter_limit')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.invite_ip_per_inviter_limit || $t('common.no_limit') }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="$t('site.config.label.invite_ip_limit_action')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData.invite_ip_limit_action
              ? $t(
                  `site.config.option.invite_ip_limit_action.${currentData.invite_ip_limit_action}`
                )
              : '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="$t('site.config.label.invite_invalid_code_action')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData.invite_invalid_code_action
              ? $t(
                  `site.config.option.invite_invalid_code_action.${currentData.invite_invalid_code_action}`
                )
              : '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="$t('site.config.label.invite_recharge_rebate_enabled')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <a-tag
            :color="
              currentData.invite_recharge_rebate_enabled ? 'green' : 'red'
            "
          >
            {{
              currentData.invite_recharge_rebate_enabled
                ? $t('common.yes')
                : $t('common.no')
            }}
          </a-tag>
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="$t('site.config.label.invite_recharge_rebate_first')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="recharge-rebate-detail">
          <template v-if="isRechargeRebateTierEnabled('first')">
            {{ $t('common.yes') }}，
            <Quota
              v-if="currentData.invite_recharge_rebate_first_type === 'fixed'"
              :model-value="currentData.invite_recharge_rebate_first_quota"
            />
            <template v-else>
              {{ currentData.invite_recharge_rebate_first_rate }}%
            </template>
          </template>
          <template v-else>{{ $t('common.no') }}</template>
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="$t('site.config.label.invite_recharge_rebate_second')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="recharge-rebate-detail">
          <template v-if="isRechargeRebateTierEnabled('second')">
            {{ $t('common.yes') }}，
            <Quota
              v-if="currentData.invite_recharge_rebate_second_type === 'fixed'"
              :model-value="currentData.invite_recharge_rebate_second_quota"
            />
            <template v-else>
              {{ currentData.invite_recharge_rebate_second_rate }}%
            </template>
          </template>
          <template v-else>{{ $t('common.no') }}</template>
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('site.config.label.invite_rule_text')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="site-config-detail-scroll">
          {{ currentData.invite_rule_text || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('site.config.label.grant_quota')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <Quota
            v-if="currentData.grant_quota"
            :model-value="currentData.grant_quota"
          />
          <span v-else> - </span>
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('site.config.label.quota_expires_at')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.quota_expires_at || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="$t('site.config.label.support_email_suffix')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="site-config-detail-scroll">
          {{ currentData?.support_email_suffix?.join('\n') || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('site.config.label.register_welcome')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span
          v-else
          class="detail-scroll-500"
          v-html="currentData.register_welcome"
        >
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('site.config.label.default_language')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData.default_language
              ? $t(`dict.language.${currentData.default_language}`)
              : $t('dict.language.default')
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('site.config.label.currency_symbol')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.currency_symbol || '$' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('site.config.label.host')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.host || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('site.config.label.port')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.port || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('site.config.label.user_name')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.user_name || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('site.config.label.password')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.password || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('site.config.label.from_name')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.from_name || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('site.config.label.recharge_tips')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="site-config-detail-scroll">
          {{ currentData.recharge_tips || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.remark')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="site-config-detail-scroll">
          {{ currentData.remark || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.status')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <a-tag v-if="currentData.status === 1" color="green">
            {{ $t(`dict.status.${currentData.status}`) }}
          </a-tag>
          <a-tag v-else color="red">
            {{ $t(`dict.status.${currentData.status}`) }}
          </a-tag>
        </span>
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
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import {
    SiteConfigDetailParams,
    querySiteConfigDetail,
    SiteConfigDetail,
  } from '@/api/site_config';
  import Quota from '@/views/common/quota.vue';

  const { loading, setLoading } = useLoading(true);
  const currentData = ref<SiteConfigDetail>({} as SiteConfigDetail);
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

  const isRechargeRebateTierEnabled = (tier: 'first' | 'second') => {
    const enabled = currentData.value[`invite_recharge_rebate_${tier}_enabled`];
    const type =
      currentData.value[`invite_recharge_rebate_${tier}_type`] || 'percent';
    const rate = currentData.value[`invite_recharge_rebate_${tier}_rate`];
    const quota = currentData.value[`invite_recharge_rebate_${tier}_quota`];
    if (!currentData.value.invite_recharge_rebate_enabled || !enabled) {
      return false;
    }
    if (type === 'fixed') {
      return quota > 0;
    }
    return rate > 0;
  };

  const getSiteConfigDetail = async (
    params: SiteConfigDetailParams = { id: props.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await querySiteConfigDetail(params);
      currentData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getSiteConfigDetail();
</script>

<script lang="ts">
  export default {
    name: 'SiteConfigDetail',
  };
</script>

<style scoped lang="less">
  // 公共骨架已由 global.less 全局提供
  .site-config-detail-scroll {
    display: block;
    max-height: 110px;
    overflow: auto;
  }
  .recharge-rebate-detail {
    display: inline-flex;
    align-items: center;
    gap: 2px;
  }
</style>
