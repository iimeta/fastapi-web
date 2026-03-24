<template>
  <div class="detail-container">
    <a-descriptions
      :column="2"
      bordered
      :label-style="{ padding: '5px 8px 5px 15px' }"
      :value-style="descriptionValueStyle"
    >
      <a-descriptions-item :label="$t('group.label.name')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.name }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.billing_methods')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            $t(`dict.billing_methods.${currentData.billing_methods || [1, 2]}`)
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('group.detail.is_default')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`dict.${currentData.is_default || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.discount')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <div v-else>
          <span
            v-if="currentData.time_rules && currentData.time_rules.length === 1"
          >
            {{ currentData.time_rules[0].discount }}%
          </span>
          <span
            v-else-if="
              currentData.time_rules && currentData.time_rules.length > 1
            "
          >
            {{ getDiscountRange(currentData.time_rules)
            }}<a-button
              type="text"
              size="small"
              @click="viewTimeRules(currentData.time_rules || [])"
            >
              {{ $t('button.view') }}
            </a-button>
          </span>
          <span v-else>-</span>
        </div>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.used_quota')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <Quota :model-value="currentData.used_quota" />
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
      <a-descriptions-item :label="$t('common.is_public')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`dict.public.${currentData.is_public || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('group.label.weight')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else-if="currentData.is_default">
          {{ $t('common.highest') }}
        </span>
        <span v-else>
          {{ currentData.weight || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.enable_model_agent')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`dict.enable.${currentData.is_enable_model_agent || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.lb_strategy')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`dict.lb_strategy.${currentData.lb_strategy || 1}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.model_agents')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="detail-textarea detail-textarea--compact">
          {{ currentData?.model_agent_names?.join('\n') || '-' }}
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
      <a-descriptions-item :label="$t('common.quota')">
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
      <a-descriptions-item :label="$t('group.label.is_enable_forward')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`dict.enable.${currentData.is_enable_forward || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('group.label.forward_rule')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData?.forward_config?.forward_rule
              ? $t(
                  `dict.forward_rule.${
                    currentData?.forward_config?.forward_rule || 1
                  }`
                )
              : '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('group.label.forward_mode')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData?.forward_config?.forward_mode
              ? $t(
                  `dict.forward_mode.${
                    currentData?.forward_config?.forward_mode || 1
                  }`
                )
              : '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('group.label.content_length')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData?.forward_config?.content_length || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.used_quota')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <Quota
            v-if="currentData?.forward_config?.used_quota"
            :model-value="currentData?.forward_config?.used_quota"
          />
          <span v-else>-</span>
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('group.label.target_model')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="detail-textarea detail-textarea--compact">
          {{
            currentData?.forward_config?.forward_rule &&
            String(currentData?.forward_config?.forward_rule) === '1'
              ? currentData?.forward_config?.forward_mode &&
                currentData?.forward_config?.forward_mode === 1
                ? currentData?.forward_config?.target_model_name
                : currentData?.forward_config?.target_model_names?.join('\n')
              : '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('group.label.match_rule')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData?.forward_config?.match_rule
              ? $t(
                  `dict.match_rule.${
                    currentData?.forward_config?.match_rule || 1
                  }`
                )
              : '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('group.label.decision_model')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData?.forward_config?.decision_model_name || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('group.label.keywords')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="detail-textarea detail-textarea--compact">
          {{
            currentData?.forward_config?.forward_rule &&
            String(currentData?.forward_config?.forward_rule) === '2'
              ? currentData?.forward_config?.keywords?.join('\n')
              : '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('group.label.target_model')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="detail-textarea detail-textarea--compact">
          {{
            currentData?.forward_config?.forward_rule &&
            String(currentData?.forward_config?.forward_rule) === '2'
              ? currentData?.forward_config?.target_model_names?.join('\n')
              : '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('group.label.remark')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else class="detail-textarea detail-textarea--compact">
          {{ currentData.remark || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.expires_at')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.expires_at || '-' }}
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

    <!-- 时段规则 -->
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
        <template #time_range="{ record }">
          {{ formatMs(record.start_time) }}~{{ formatMs(record.end_time) }}
        </template>
        <template #days="{ record }">
          {{ formatDays(record) }}
        </template>
        <template #discount="{ record }"> {{ record.discount }}% </template>
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
  import { ref, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import {
    queryGroupDetail,
    GroupDetailParams,
    GroupDetail,
  } from '@/api/group';
  import Quota from '@/views/common/quota.vue';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const currentData = ref<GroupDetail>({} as GroupDetail);
  const descriptionValueStyle = {
    width: '350px',
    padding: '5px 8px 5px 15px',
  };
  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
  });

  const getGroupDetail = async (
    params: GroupDetailParams = { id: props.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryGroupDetail(params);
      currentData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getGroupDetail();

  const timeRulesVisible = ref(false);
  const timeRulesData = ref<any[]>([]);
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
          width: 150,
        },
        {
          title: t('time_rule.label.time_range'),
          slotName: 'time_range',
          align: 'center',
          width: 150,
        },
        {
          title: t('time_rule.label.days'),
          slotName: 'days',
          align: 'center',
          width: 200,
        },
        {
          title: t('time_rule.label.priority'),
          dataIndex: 'priority',
          titleSlotName: 'priority_title',
          align: 'center',
          width: 80,
        },
        {
          title: t('common.discount'),
          slotName: 'discount',
          align: 'center',
          width: 80,
        },
      ],
    },
  ]);

  const getDiscountRange = (rules: any[]) => {
    const discounts = rules.map((r: any) => r.discount);
    const min = Math.min(...discounts);
    const max = Math.max(...discounts);
    return `${min}%~${max}%`;
  };

  const viewTimeRules = (rules: any[]) => {
    timeRulesData.value = rules;
    timeRulesVisible.value = true;
  };

  function formatMs(ms: number): string {
    if (!ms) return '00:00';
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}`;
  }

  function formatDays(rule: any): string {
    if (!rule.days || rule.days.length === 0) return t('common.all');
    if (rule.day_mode === 'month') {
      return rule.days
        .map((d: number) => d + t('time_rule.label.day_suffix'))
        .join('、');
    }
    return rule.days
      .map((d: number) => t(`time_rule.dict.week.${d}`))
      .join('、');
  }
</script>

<script lang="ts">
  export default {
    name: 'GroupDetail',
  };
</script>

<style scoped lang="less">
  // 公共骨架已由 global.less 全局提供

  .priority-tooltip {
    cursor: pointer;
    color: var(--color-text-3);
  }
</style>
