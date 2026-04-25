<template>
  <div
    class="group-square-card"
    :class="{ 'group-square-card--off': record.status === 2 }"
    @click="$emit('clickCard', record)"
  >
    <!-- 顶部品牌色带 -->
    <div class="group-square-card__bar" :style="{ background: barGradient }" />

    <!-- 头部: 首字母 + 名称 + 状态 -->
    <div class="group-square-card__head">
      <div class="group-square-card__avatar-area">
        <svg
          v-if="logoData?.kind === 'svg'"
          class="group-square-card__svg"
          :viewBox="logoData.viewBox"
          :style="logoData.color ? { color: logoData.color } : undefined"
        >
          <path v-if="logoData.path" :d="logoData.path" />
          <g v-else-if="logoData.markup" v-html="logoData.markup" />
        </svg>
        <span
          v-else
          class="group-square-card__letter"
          :style="{ background: barGradient }"
        >
          {{ initial }}
        </span>
        <div class="group-square-card__name-wrap">
          <div class="group-square-card__name" :title="record.name">
            <span
              class="group-square-card__name-text"
              :class="{
                'group-square-card__name-text--bold': record.is_default,
              }"
            >
              {{ record.name }}
            </span>
            <span
              v-if="record.is_default"
              class="group-square-card__default-tag"
            >
              {{ $t('group.detail.is_default') }}
            </span>
          </div>
          <div class="group-square-card__billing-tags">
            <span
              v-for="bm in billingMethods"
              :key="bm"
              class="group-square-card__tag"
              :style="billingTagStyle(bm)"
            >
              {{ $t(`dict.billing_methods.${bm}`) }}
            </span>
          </div>
        </div>
      </div>
      <div
        v-if="groupMultiplierText"
        class="group-square-card__multiplier"
        :style="{ '--brand': brandColor }"
      >
        {{ groupMultiplierText }}
      </div>
    </div>

    <!-- 备注 -->
    <p v-if="showRemark" class="group-square-card__remark">
      {{ record.remark || '' }}
    </p>

    <!-- 弹性占位 -->
    <div class="group-square-card__spacer" />

    <!-- 时段规则 -->
    <div
      v-if="record.time_rules && record.time_rules.length"
      class="group-square-card__time-rules"
    >
      <div class="group-square-card__time-rules-hd">
        <icon-clock-circle :size="12" />
        <span>{{ $t('time_rule.label.rule') }}</span>
        <a-button
          v-if="
            record.time_rules.length > 1 || hasModelNames(record.time_rules)
          "
          type="text"
          size="mini"
          class="group-square-card__section-more"
          @click.stop="$emit('clickCard', record)"
        >
          {{ $t('button.view') }}
        </a-button>
      </div>
      <div class="group-square-card__time-rules-list">
        <div
          v-for="(tr, idx) in record.time_rules.slice(0, 2)"
          :key="idx"
          class="group-square-card__time-rule"
        >
          <span class="group-square-card__time-rule-name">
            {{ tr.name }}
          </span>
          <span class="group-square-card__time-rule-discount">
            {{ formatDiscountText(tr.discount) }}
          </span>
          <span class="group-square-card__time-rule-range">
            {{ fmtMs(tr.start_time) }}~{{ fmtMs(tr.end_time) }}
          </span>
        </div>
      </div>
    </div>

    <!-- 底部信息区 -->
    <div class="group-square-card__footer">
      <div class="group-square-card__footer-row">
        <div
          v-if="record.models && record.models.length"
          class="group-square-card__info-item"
        >
          <icon-apps :size="12" class="group-square-card__models-icon" />
          <span>{{ $t('common.models') }}: {{ record.models.length }}</span>
        </div>
        <div v-if="record.expires_at" class="group-square-card__info-item">
          <icon-calendar :size="12" />
          <span>{{ record.expires_at }}</span>
        </div>
        <div
          v-if="!record.models?.length && !record.expires_at"
          class="group-square-card__info-item group-square-card__info-item--empty"
        >
          <span>-</span>
        </div>
        <a-button
          v-if="record.models && record.models.length"
          type="text"
          size="mini"
          class="group-square-card__view-btn"
          @click.stop="$emit('viewModels', record)"
        >
          {{ $t('button.view') }}
        </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { GroupPage } from '@/api/group';
  import {
    getProviderBrandColor,
    getProviderCompanyLogo,
    getProviderInitial,
    getProviderLogo,
  } from '@/utils/provider-brand';

  const props = defineProps<{
    record: GroupPage;
    showRemark: boolean;
  }>();
  defineEmits<{
    (e: 'clickCard', r: GroupPage): void;
    (e: 'viewModels', r: GroupPage): void;
  }>();

  /* ---- 颜色 ---- */
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

  /* ---- 计费 ---- */
  const billingMethods = computed(() => props.record.billing_methods || [1, 2]);

  const billingColorMap: Record<number, string> = {
    1: '6, 182, 212',
    2: '245, 158, 11',
  };

  const billingTagStyle = (bm: number) => {
    const rgb = billingColorMap[bm] || '107, 114, 128';
    return {
      color: `rgb(${rgb})`,
      background: `rgba(${rgb}, 0.08)`,
    };
  };

  /* ---- 时间格式化 ---- */
  const fmtMs = (ms: number): string => {
    if (!ms) return '00:00';
    const totalMin = Math.floor(ms / 60000);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const formatDiscountText = (discount: number) => `${discount / 100}x`;

  const groupMultiplierText = computed(() => {
    const rules = props.record.time_rules || [];
    if (!rules.length) return '';
    if (rules.length === 1) return formatDiscountText(rules[0].discount);

    const discounts = rules.map((r) => r.discount);
    const min = Math.min(...discounts);
    const max = Math.max(...discounts);
    return min === max
      ? formatDiscountText(min)
      : `${formatDiscountText(min)}~${formatDiscountText(max)}`;
  });

  /* ---- 时段规则 ---- */
  const hasModelNames = (rules: any[]) => {
    return rules.some((r: any) => r.model_names?.length);
  };
</script>

<script lang="ts">
  export default { name: 'GroupSquareCard' };
</script>

<style scoped lang="less">
  .group-square-card {
    position: relative;
    display: flex;
    flex-direction: column;
    background: var(--color-bg-2);
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.25s, box-shadow 0.25s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    height: 100%;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    &--off {
      opacity: 0.55;
    }
  }

  .group-square-card__bar {
    height: 4px;
  }

  .group-square-card__head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
    padding: 16px 18px 0;
  }

  .group-square-card__avatar-area {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex: 1;
  }

  .group-square-card__svg {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
  }

  .group-square-card__letter {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
  }

  .group-square-card__name-wrap {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .group-square-card__name {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }

  .group-square-card__name-text {
    font-size: 15px;
    font-weight: 600;
    color: var(--color-text-1);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.3;

    &--bold {
      font-weight: 800;
    }
  }

  .group-square-card__default-tag {
    flex-shrink: 0;
    font-size: 10px;
    line-height: 1;
    padding: 2px 6px;
    border-radius: 3px;
    color: rgb(var(--primary-6));
    background: rgba(var(--primary-6), 0.08);
    font-weight: 500;
    white-space: nowrap;
  }

  .group-square-card__billing-tags {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 4px;
  }

  .group-square-card__status-row {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .group-square-card__status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgb(var(--green-6));

    &--off {
      background: rgb(var(--red-6));
    }
  }

  .group-square-card__status-text {
    font-size: 12px;
    color: var(--color-text-3);
  }

  .group-square-card__tag {
    font-size: 11px;
    line-height: 1;
    padding: 3px 8px;
    border-radius: 3px;
    white-space: nowrap;
  }

  .group-square-card__multiplier {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    height: 20px;
    padding: 0 7px;
    border-radius: 5px;
    background: color-mix(in srgb, var(--brand) 7%, transparent);
    color: color-mix(in srgb, var(--brand) 88%, var(--color-text-1));
    font-size: 11px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.1px;
    white-space: nowrap;
  }

  .group-square-card__remark {
    margin: 8px 18px 0;
    padding: 0;
    font-size: 12px;
    color: var(--color-text-2);
    line-height: 18px;
    height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .group-square-card__spacer {
    flex: 1;
  }

  /* 时段规则 */

  .group-square-card__time-rules {
    margin: 8px 14px 0;
    padding: 6px 10px;
    background: rgba(var(--purple-1), 0.4);
    border: 1px solid rgba(var(--purple-3), 0.3);
    border-radius: 8px;
  }

  .group-square-card__time-rules-hd {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 4px;
    font-size: 11px;
    font-weight: 600;
    color: rgb(var(--purple-6));

    .group-square-card__section-more {
      margin-left: auto;
    }
  }

  .group-square-card__time-rules-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
  }

  .group-square-card__time-rule {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 8px;
    font-size: 11px;
    background: var(--color-bg-2);
    border-radius: 4px;
    border: 1px solid var(--color-border-1);
  }

  .group-square-card__time-rule-name {
    color: var(--color-text-1);
    font-weight: 500;
  }

  .group-square-card__time-rule-discount {
    color: rgb(var(--purple-6));
    font-weight: 600;
  }

  .group-square-card__time-rule-range {
    color: var(--color-text-2);
    font-family: Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 11px;
  }

  .group-square-card__section-more {
    font-size: 11px;
    color: rgb(var(--primary-6));
    padding: 0 4px;
    height: auto;
    line-height: 1;
  }

  /* 底部信息区 */

  .group-square-card__footer {
    margin: 10px 14px 12px;
    padding: 8px 10px;
    background: linear-gradient(180deg, #f8fbff, #fff);
    border: 1px solid var(--color-border-1);
    border-radius: 10px;
  }

  .group-square-card__footer-row {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .group-square-card__view-btn {
    margin-left: auto;
    font-size: 12px;
    color: rgb(var(--primary-6));
    padding: 0 4px;
    height: auto;
    line-height: 1;
  }

  .group-square-card__info-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: var(--color-text-2);

    &--empty {
      color: var(--color-text-4);
    }
  }

  .group-square-card__models-icon {
    color: rgb(var(--primary-6));
  }
</style>
