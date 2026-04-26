<template>
  <div class="card-wrap group-card-item">
    <a-checkbox
      class="group-card-item__check"
      :model-value="checked"
      @click.stop
      @change="$emit('toggleCheck', Boolean($event))"
    />
    <a-card
      :bordered="false"
      :header-style="cardHeaderStyle"
      :body-style="cardBodyStyle"
      @click="$emit('detail', record.id)"
    >
      <template #title>
        <div class="group-card-item__title-bar">
          <span class="group-card-item__logo-box">
            <svg
              v-if="logoData?.kind === 'svg'"
              class="group-card-item__logo"
              :viewBox="logoData.viewBox"
              :style="logoData.color ? { color: logoData.color } : undefined"
              aria-hidden="true"
            >
              <path v-if="logoData.path" :d="logoData.path" />
              <g v-else-if="logoData.markup" v-html="logoData.markup" />
            </svg>
            <span
              v-else
              class="group-card-item__logo-fallback"
              :style="{ background: barGradient }"
            >
              {{ initial }}
            </span>
          </span>
          <div class="group-card-item__title-wrap">
            <span class="group-card-item__title" :title="record.name">
              {{ record.name }}
            </span>
            <div
              v-if="record.remark"
              class="group-card-item__remark"
              :title="record.remark"
            >
              {{ record.remark }}
            </div>
            <div
              v-if="record.expires_at"
              class="group-card-item__updated-at"
              :title="record.expires_at"
            >
              {{ record.expires_at }}
            </div>
          </div>
        </div>
      </template>
      <template #extra>
        <a-switch
          :model-value="record.status"
          :checked-value="1"
          :unchecked-value="2"
          @click.stop
          @change="changeStatus"
        />
      </template>
      <a-card-meta>
        <template #description>
          <div class="group-card-item__desc">
            <div class="group-card-item__inline-row">
              <div
                v-if="hasField('models')"
                class="group-card-item__inline-item"
              >
                <span class="group-card-item__label">
                  {{ fieldTitleMap.models }}
                </span>
                <span class="group-card-item__value">
                  <a-button
                    v-if="record.models?.length"
                    type="text"
                    size="small"
                    @click.stop="$emit('models', record.id)"
                  >
                    {{ $t('button.view') }}
                  </a-button>
                  <span v-else>-</span>
                </span>
              </div>
              <div
                v-if="hasField('time_rules')"
                class="group-card-item__inline-item"
              >
                <span class="group-card-item__label">
                  {{ fieldTitleMap.time_rules }}
                </span>
                <span class="group-card-item__value">
                  <span
                    v-if="record.time_rules && record.time_rules.length === 1"
                  >
                    {{ formatDiscountText(record.time_rules[0].discount) }}
                    <a-button
                      v-if="hasModelNames(record.time_rules)"
                      type="text"
                      size="mini"
                      @click.stop="$emit('timeRules', record.time_rules)"
                    >
                      {{ $t('button.view') }}
                    </a-button>
                  </span>
                  <span
                    v-else-if="
                      record.time_rules && record.time_rules.length > 1
                    "
                  >
                    {{ getDiscountRange(record.time_rules) }}
                    <a-button
                      type="text"
                      size="mini"
                      @click.stop="$emit('timeRules', record.time_rules)"
                    >
                      {{ $t('button.view') }}
                    </a-button>
                  </span>
                  <span v-else>-</span>
                </span>
              </div>
              <div
                v-if="hasField('weight')"
                class="group-card-item__inline-item"
              >
                <span class="group-card-item__label">
                  {{ fieldTitleMap.weight }}
                </span>
                <span class="group-card-item__value">
                  <b v-if="record.is_default">{{ $t('common.highest') }}</b>
                  <template v-else>{{ record.weight || '-' }}</template>
                </span>
              </div>
            </div>

            <div class="group-card-item__inline-row">
              <div
                v-if="hasField('lb_strategy')"
                class="group-card-item__inline-item"
              >
                <span class="group-card-item__label">
                  {{ fieldTitleMap.lb_strategy }}
                </span>
                <span class="group-card-item__value">
                  {{
                    record.is_enable_model_agent
                      ? $t(`dict.lb_strategy.${record.lb_strategy || 1}`)
                      : '-'
                  }}
                </span>
              </div>
              <div
                v-if="hasField('used_quota')"
                class="group-card-item__inline-item"
              >
                <span class="group-card-item__label">
                  {{ fieldTitleMap.used_quota }}
                </span>
                <span
                  class="group-card-item__value"
                  :title="`${renderQuota(record.used_quota)}`"
                >
                  <Quota :model-value="record.used_quota" />
                </span>
              </div>
              <div
                v-if="hasField('is_public')"
                class="group-card-item__inline-item"
              >
                <span class="group-card-item__label">
                  {{ fieldTitleMap.is_public }}
                </span>
                <span class="group-card-item__value">
                  <a-switch
                    :model-value="record.is_public"
                    :checked-value="true"
                    :unchecked-value="false"
                    size="small"
                    @click.stop
                    @change="changePublic"
                  />
                </span>
              </div>
            </div>

            <template v-for="field in visibleFields" :key="field.dataIndex">
              <div
                v-if="
                  ![
                    'models',
                    'used_quota',
                    'weight',
                    'time_rules',
                    'lb_strategy',
                    'is_public',
                  ].includes(field.dataIndex)
                "
                class="group-card-item__field"
              >
                <span class="group-card-item__label">
                  {{ field.title }}
                </span>
                <span class="group-card-item__value">
                  <template v-if="field.dataIndex === 'model_agent_names'">
                    <span :title="record.model_agent_names?.join(', ') || ''">
                      {{ record.model_agent_names?.join(', ') || '-' }}
                    </span>
                  </template>

                  <template v-else-if="field.dataIndex === 'expires_at'">
                    <a-date-picker
                      :model-value="record.expires_at"
                      :placeholder="$t('placeholder.expires_at')"
                      :time-picker-props="{ defaultValue: '23:59:59' }"
                      :disabled-date="disabledDate"
                      :shortcuts="expireShortcuts"
                      show-time
                      @click.stop
                      @change="changeExpire"
                    >
                      <a-button
                        class="group-card-item__expire-button"
                        type="text"
                        size="mini"
                        @click.stop
                      >
                        {{ record.expires_at || $t('placeholder.expires_at') }}
                      </a-button>
                    </a-date-picker>
                  </template>
                </span>
              </div>
            </template>
          </div>
        </template>
      </a-card-meta>

      <template #actions>
        <a-button type="primary" @click.stop="$emit('update', record.id)">
          {{ $t('button.update') }}
        </a-button>
        <a-button @click.stop="$emit('detail', record.id)">
          {{ $t('button.detail') }}
        </a-button>
      </template>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import dayjs from 'dayjs';
  import { useAppStore } from '@/store';
  import { disabledDate, parseQuota } from '@/utils/common';
  import type {
    GroupChangeExpire,
    GroupChangePublic,
    GroupChangeStatus,
    GroupPage,
  } from '@/api/group';
  import Quota from '@/views/common/quota.vue';
  import {
    getProviderBrandColor,
    getProviderCompanyLogo,
    getProviderInitial,
    getProviderLogo,
  } from '@/utils/provider-brand';

  type FieldItem = {
    title: string;
    dataIndex: string;
    checked?: boolean;
  };

  type GroupCardRecord = GroupPage & {
    model_agent_names?: string[];
    weight?: number;
    is_public?: boolean;
    is_enable_model_agent?: boolean;
    lb_strategy?: number;
  };

  const props = defineProps<{
    record: GroupCardRecord;
    checked: boolean;
    size: 'mini' | 'small' | 'medium' | 'large';
    visibleFields: FieldItem[];
  }>();

  const emit = defineEmits<{
    (e: 'toggleCheck', checked: boolean): void;
    (e: 'detail', id: string): void;
    (e: 'models', id: string): void;
    (e: 'update', id: string): void;
    (e: 'timeRules', rules: any[]): void;
    (e: 'publicChange', payload: GroupChangePublic): void;
    (e: 'statusChange', payload: GroupChangeStatus): void;
    (e: 'expireChange', payload: GroupChangeExpire): void;
  }>();

  const appStore = useAppStore();

  const renderQuota = (value: number) => {
    const symbol = appStore.getCurrencySymbol;
    if (value > 0) return `${symbol}${parseQuota(value)}`;
    if (value < 0) return `-${symbol}${parseQuota(-value)}`;
    return `${symbol}0.00`;
  };

  const cardHeaderStyle = {
    padding: '14px 16px 0 16px',
  };
  const cardBodyStyle = {
    padding: '10px 16px 0 16px',
  };

  const logoData = computed(
    () =>
      getProviderLogo(undefined, props.record.name) ||
      getProviderCompanyLogo(undefined, props.record.name)
  );

  const brandColor = computed(() =>
    getProviderBrandColor(undefined, props.record.name)
  );

  const barGradient = computed(() => {
    const c = brandColor.value;
    return `linear-gradient(135deg, ${c}, ${c}bb)`;
  });

  const initial = computed(() => getProviderInitial(props.record.name));

  const fieldTitleMap = computed(() => ({
    models: props.visibleFields.find((item) => item.dataIndex === 'models')
      ?.title,
    used_quota: props.visibleFields.find(
      (item) => item.dataIndex === 'used_quota'
    )?.title,
    weight: props.visibleFields.find((item) => item.dataIndex === 'weight')
      ?.title,
    time_rules: props.visibleFields.find(
      (item) => item.dataIndex === 'time_rules'
    )?.title,
    lb_strategy: props.visibleFields.find(
      (item) => item.dataIndex === 'lb_strategy'
    )?.title,
    is_public: props.visibleFields.find(
      (item) => item.dataIndex === 'is_public'
    )?.title,
  }));

  const hasField = (dataIndex: string) =>
    props.visibleFields.some((item) => item.dataIndex === dataIndex);

  const getDiscountRange = (rules: any[]) => {
    const discounts = rules.map((r: any) => r.discount);
    const min = Math.min(...discounts);
    const max = Math.max(...discounts);
    return `${formatDiscountText(min)}~${formatDiscountText(max)}`;
  };

  const formatDiscountText = (discount: number) => `${discount / 100}x`;

  const hasModelNames = (rules: any[]) => {
    return rules.some((r: any) => r.model_names?.length);
  };

  const expireShortcuts = [1, 7, 15, 30, 90, 180, 365].map((day) => ({
    label: String(day),
    value: () =>
      dayjs(
        props.record.expires_at || new Date().setHours(23, 59, 59, 999)
      ).add(day, 'day'),
  }));

  const changePublic = (value: string | number | boolean) => {
    emit('publicChange', {
      id: props.record.id,
      is_public: value,
    });
  };

  const changeStatus = (value: string | number | boolean) => {
    emit('statusChange', {
      id: props.record.id,
      status: Number(value),
    });
  };

  const changeExpire = (value: string | undefined) => {
    emit('expireChange', {
      id: props.record.id,
      expires_at: value || '',
    });
  };
</script>

<script lang="ts">
  export default {
    name: 'GroupCardItem',
  };
</script>

<style scoped lang="less">
  .group-card-item {
    position: relative;
    height: 100%;

    &.card-wrap {
      height: 100%;
      cursor: pointer;
      transition: all 0.3s;
      border: 1px solid var(--color-neutral-3);
      border-radius: 5px;
      overflow: hidden;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }
    }
  }

  .group-card-item__title-bar {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    min-width: 0;
    width: 100%;
  }

  .group-card-item__check {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 3;
  }

  .group-card-item__logo-box {
    width: 50px;
    height: 50px;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    overflow: hidden;
    border-radius: 4px;
  }

  .group-card-item__logo {
    display: block;
    width: 42px;
    height: 42px;
  }

  .group-card-item__logo-fallback {
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    line-height: 42px;
  }

  .group-card-item__title-wrap {
    flex: 1;
    min-width: 0;
    height: 58px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .group-card-item__title {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 22px;
    line-height: 22px;
    font-size: 15px;
  }

  .group-card-item__remark {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--color-text-2);
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    margin-right: 2px;
  }

  .group-card-item__updated-at {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--color-text-2);
    font-size: 12px;
    height: 18px;
    line-height: 18px;
  }

  .group-card-item__desc {
    min-height: 80px;
  }

  .group-card-item__inline-row {
    display: grid;
    grid-template-columns: 1fr 1.5fr 1fr;
    gap: 12px;
    margin-bottom: 12px;
    font-size: 12px;
  }

  .group-card-item__inline-item {
    min-width: 0;
    display: flex;
    align-items: center;
  }

  .group-card-item__field {
    margin-bottom: 6px;
    font-size: 12px;
    line-height: 20px;
    display: flex;
    align-items: center;
    min-width: 0;
  }

  .group-card-item__label {
    flex-shrink: 0;
    width: 56px;
    margin-right: 4px;
    font-weight: normal;
    color: rgb(var(--gray-8));
  }

  .group-card-item__value {
    display: block;
    flex: 1;
    min-width: 0;
    color: var(--color-text-1);
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    :deep(.arco-btn-text) {
      padding-left: 0;
    }
  }

  .group-card-item__inline-item .group-card-item__value {
    text-align: left;
  }

  .group-card-item__expire-button {
    max-width: 150px;
    padding: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :deep(.arco-card) {
    height: 100%;
    border-radius: 5px;
  }

  :deep(.arco-card-header) {
    border: none;
    min-height: 72px;
  }

  :deep(.arco-card-body) {
    .arco-card-meta {
      height: 100%;
      display: flex;
      flex-flow: column;

      .arco-card-meta-content {
        flex: 1;
      }
    }
  }

  :deep(.arco-card-meta-footer:last-child) {
    margin-top: 4px;
    margin-bottom: 12px;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  :deep(.arco-card-extra) {
    margin-left: 8px;
    margin-right: 22px;
  }
</style>
