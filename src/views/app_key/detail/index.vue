<template>
  <div class="detail-container">
    <a-descriptions :column="2" bordered :value-style="descriptionValueStyle">
      <a-descriptions-item :label="$t('common.app_key')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.key }}
          <icon-copy
            v-if="currentData.key"
            class="copy-btn"
            @click="handleCopy(currentData.key)"
          />
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.key_name')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.name || currentData.key.substr(-5) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.app_id')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.app_id }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.user_id')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.user_id }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.limit_quota')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`dict.${currentData?.is_limit_quota || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.current_quota')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <Quota
            v-if="currentData.is_limit_quota"
            :model-value="currentData.quota"
          />
          <span v-else>
            {{ $t(`common.no_limit`) }}
          </span>
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
      <a-descriptions-item :label="$t('common.billing_methods')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`dict.billing_methods.${currentData.billing_methods || 1}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('app.key.detail.quota_expires_rule')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData?.is_limit_quota
              ? $t(
                  `dict.quota_expires_rule.${
                    currentData.quota_expires_rule || 1
                  }`
                ) || '-'
              : '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('app.key.detail.quota_expires_minutes')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData?.is_limit_quota
              ? currentData.quota_expires_minutes || '-'
              : '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.expires_at')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData?.is_limit_quota
              ? currentData.quota_expires_at || '-'
              : '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.models')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="detail-textarea detail-textarea--tall">
          {{ currentData?.model_names?.join('\n') || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.bind_group')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`dict.enable.${currentData.is_bind_group || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.groups')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <span v-if="currentData.group_name">
            {{ currentData.group_name }}
            <span
              v-if="
                currentData.group_time_rules &&
                currentData.group_time_rules.length === 1
              "
            >
              {{ formatDiscountText(currentData.group_time_rules[0].discount) }}<a-button
                v-if="hasModelNames(currentData.group_time_rules)"
                type="text"
                size="small"
                @click="viewTimeRules(currentData.group_time_rules)"
              >
                {{ $t('button.view') }}
              </a-button>
            </span>
            <span
              v-else-if="
                currentData.group_time_rules &&
                currentData.group_time_rules.length > 1
              "
            >
              {{ getDiscountRange(currentData.group_time_rules)
              }}<a-button
                type="text"
                size="small"
                @click="viewTimeRules(currentData.group_time_rules)"
              >
                {{ $t('button.view') }}
              </a-button>
            </span>
          </span>
          <span v-else>-</span>
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.ip_whitelist')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="detail-textarea detail-textarea--compact">
          {{ currentData?.ip_whitelist?.join('\n') || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.ip_blacklist')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="detail-textarea detail-textarea--compact">
          {{ currentData?.ip_blacklist?.join('\n') || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.remark')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="detail-textarea detail-textarea--compact">
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

    <a-modal
      v-model:visible="timeRulesVisible"
      hide-title
      hide-cancel
      simple
      width="888px"
      :ok-text="$t('button.close')"
    >
      <a-table
        :columns="timeRulesColumns"
        :data="timeRulesData"
        :pagination="false"
        :bordered="false"
      >
        <template #discount="{ record }">
          {{ formatDiscountText(record.discount) }}
        </template>
        <template #model_names="{ record }">
          {{ record.model_names?.join(', ') || $t('common.all') }}
        </template>
        <template #time_range="{ record }">
          {{ formatMs(record.start_time) }}~{{ formatMs(record.end_time) }}
        </template>
        <template #days="{ record }">
          {{ formatDays(record) }}
        </template>
        <template #priority_title>
          {{ $t('time_rule.label.priority') }}
          <a-tooltip :content="$t('time_rule.placeholder.priority')">
            <icon-question-circle class="priority-tooltip" />
          </a-tooltip>
        </template>
      </a-table>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import { useClipboard } from '@vueuse/core';
  import { Message } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import type { TimeRule } from '@/api/common';
  import useLoading from '@/hooks/loading';
  import {
    queryAppKeyDetail,
    AppKeyDetailParams,
    AppKeyDetail,
  } from '@/api/app_key';
  import Quota from '@/views/common/quota.vue';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const currentData = ref<AppKeyDetail>({} as AppKeyDetail);
  const { copy, copied } = useClipboard();
  const timeRulesVisible = ref(false);
  const timeRulesData = ref<TimeRule[]>([]);
  const descriptionValueStyle = {
    width: '350px',
    padding: '5px 8px 5px 20px',
  };
  const tableHeaderCellStyle = { background: 'var(--color-bg-2)' };
  const timeRulesColumns = computed<TableColumnData[]>(() => [
    {
      title: t('time_rule.label.rule'),
      headerCellStyle: tableHeaderCellStyle,
      children: [
        {
          title: t('time_rule.label.name'),
          dataIndex: 'name',
          align: 'center',
          width: 100,
        },
        {
          title: t('common.multiplier'),
          slotName: 'discount',
          align: 'center',
          width: 100,
        },
        {
          title: t('time_rule.label.time_range'),
          slotName: 'time_range',
          align: 'center',
          width: 100,
        },
        {
          title: t('time_rule.label.days'),
          slotName: 'days',
          align: 'center',
          width: 100,
        },
        {
          title: t('time_rule.label.priority'),
          dataIndex: 'priority',
          titleSlotName: 'priority_title',
          align: 'center',
          width: 100,
        },
        {
          title: t('common.model'),
          slotName: 'model_names',
          align: 'center',
          width: 100,
          ellipsis: true,
          tooltip: true,
        },
      ],
    },
  ]);
  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
  });

  const getAppKeyDetail = async (
    params: AppKeyDetailParams = { id: props.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryAppKeyDetail(params);
      currentData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getAppKeyDetail();

  const handleCopy = (content: string) => {
    copy(content);
  };

  const getDiscountRange = (rules: TimeRule[]) => {
    const discounts = rules.map((r) => r.discount);
    const min = Math.min(...discounts);
    const max = Math.max(...discounts);
    return `${formatDiscountText(min)}~${formatDiscountText(max)}`;
  };

  const formatDiscountText = (discount: number) => `${discount / 100}x`;

  const hasModelNames = (rules: TimeRule[]) => {
    return rules.some((r) => r.model_names?.length);
  };

  const viewTimeRules = (rules: TimeRule[]) => {
    timeRulesData.value = rules;
    timeRulesVisible.value = true;
  };

  const formatMs = (ms: number) => {
    if (ms === undefined || ms === null) return '';
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}`;
  };

  const formatDays = (rule: TimeRule) => {
    if (!rule.days || rule.days.length === 0) return t('common.all');
    if (rule.day_mode === 'month') {
      return rule.days
        .map((d: number) => `${d}${t('time_rule.label.day_suffix')}`)
        .join(', ');
    }
    return rule.days
      .map((d: number) => t(`time_rule.dict.week.${d}`))
      .join(', ');
  };

  watch(copied, () => {
    if (copied.value) {
      Message.success(t('app.key.success.copy'));
    }
  });
</script>

<script lang="ts">
  export default {
    name: 'AppKeyDetail',
  };
</script>

<style scoped lang="less">
  // 公共骨架已由 global.less 全局提供
  .copy-btn {
    color: gray;
    cursor: pointer;
  }

  .copy-btn:hover {
    color: rgb(var(--arcoblue-6));
  }

  .priority-tooltip {
    cursor: pointer;
    color: var(--color-text-3);
  }
</style>
