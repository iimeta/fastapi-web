<template>
  <div
    class="model-square-card"
    :class="{ 'model-square-card--off': record.status === 2 }"
    @click="$emit('clickCard', record)"
  >
    <!-- 顶部品牌色带 -->
    <div
      class="model-square-card__bar"
      :style="{ background: providerGradient }"
    />

    <!-- 头部: Logo + 模型名称 + 类型 -->
    <div class="model-square-card__head">
      <div class="model-square-card__provider">
        <svg
          v-if="logoData?.kind === 'svg'"
          class="model-square-card__svg"
          :viewBox="logoData.viewBox"
          :style="logoData.color ? { color: logoData.color } : undefined"
        >
          <path v-if="logoData.path" :d="logoData.path" />
          <g v-else-if="logoData.markup" v-html="logoData.markup" />
        </svg>
        <span
          v-else
          class="model-square-card__letter"
          :style="{ background: providerGradient }"
        >
          {{ initial }}
        </span>
        <div class="model-square-card__name-wrap">
          <div
            class="model-square-card__name"
            :title="record.name || record.model"
            @click.stop="doCopyName"
          >
            <span class="model-square-card__name-text">{{
              record.name || record.model
            }}</span>
            <icon-copy class="model-square-card__cp" />
          </div>
          <div
            class="model-square-card__model-sub"
            :title="record.model"
            @click.stop="doCopy"
          >
            <span class="model-square-card__model-text">{{
              record.model
            }}</span>
            <icon-copy class="model-square-card__cp" />
          </div>
        </div>
      </div>
      <div class="model-square-card__head-tags">
        <span class="model-square-card__tag" :style="typeTagStyle">
          {{ $t(`dict.model_type.${record.type}`) }}
        </span>
        <div class="model-square-card__head-tags-bill">
          <span
            v-for="bm in billingMethods"
            :key="bm"
            class="model-square-card__tag"
            :style="billingTagStyle(bm)"
          >
            {{ $t(`dict.billing_methods.${bm}`) }}
          </span>
        </div>
      </div>
    </div>

    <!-- 备注 -->
    <p v-if="showRemark" class="model-square-card__remark">
      {{ record.remark || '' }}
    </p>

    <!-- 弹性占位，把下方内容推到底部 -->
    <div class="model-square-card__spacer" />

    <!-- 时段规则 -->
    <div
      v-if="record.time_rules && record.time_rules.length"
      class="model-square-card__time-rules"
    >
      <div class="model-square-card__time-rules-hd">
        <icon-clock-circle :size="12" />
        <span>{{ $t('time_rule.label.rule') }}</span>
        <a-button
          v-if="record.time_rules.length > 2"
          type="text"
          size="mini"
          class="model-square-card__section-more"
          @click.stop="$emit('clickCard', record)"
        >
          {{ $t('model.square.card.pricing.more') }}
        </a-button>
      </div>
      <div class="model-square-card__time-rules-list">
        <div
          v-for="(tr, idx) in record.time_rules.slice(0, 2)"
          :key="idx"
          class="model-square-card__time-rule"
        >
          <span class="model-square-card__time-rule-name">
            {{ tr.name }}
          </span>
          <span class="model-square-card__time-rule-discount">
            {{ tr.discount }}%
          </span>
          <span class="model-square-card__time-rule-range">
            {{ fmtMs(tr.start_time) }}~{{ fmtMs(tr.end_time) }}
          </span>
        </div>
      </div>
    </div>

    <!-- 定价 -->
    <div class="model-square-card__pricing">
      <div class="model-square-card__pricing-hd">
        <span class="model-square-card__pricing-title">
          <span class="model-square-card__pricing-icon">{{
            app.getCurrencySymbol || '$'
          }}</span>
          {{ $t('model.columns.pricing') }}
        </span>
        <a-button
          v-if="items.length > 0"
          type="text"
          size="mini"
          class="model-square-card__section-more"
          @click.stop="$emit('clickCard', record)"
        >
          {{ $t('model.square.card.pricing.more') }}
        </a-button>
      </div>
      <div
        v-if="previewItems.length > 0"
        class="model-square-card__pricing-grid"
      >
        <div
          v-for="pi in previewItems"
          :key="pi.key"
          class="model-square-card__pricing-card"
        >
          <div class="model-square-card__pricing-card-name">
            {{ pi.label }}
          </div>
          <div class="model-square-card__pricing-card-val">
            {{ pi.value }}
          </div>
        </div>
      </div>
      <div v-else class="model-square-card__pricing-nil">
        {{ $t('model.square.card.pricing.empty') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import { useClipboard } from '@vueuse/core';
  import { ModelPage } from '@/api/model';
  import { useAppStore } from '@/store';
  import { parseQuota } from '@/utils/common';
  import {
    getProviderBrandColor,
    getProviderInitial,
    getProviderLogo,
  } from '@/utils/provider-brand';

  const { t } = useI18n();
  const { copy } = useClipboard();
  const app = useAppStore();

  const props = defineProps<{
    record: ModelPage;
    showRemark: boolean;
  }>();
  defineEmits<{
    (e: 'clickCard', r: ModelPage): void;
  }>();

  const logoData = computed(() =>
    getProviderLogo(props.record.provider_code, props.record.provider_name)
  );

  const brandColor = computed(() =>
    getProviderBrandColor(
      props.record.provider_code,
      props.record.provider_name
    )
  );

  const providerGradient = computed(() => {
    const c = brandColor.value;
    return `linear-gradient(135deg, ${c}, ${c}bb)`;
  });

  const initial = computed(() =>
    getProviderInitial(props.record.provider_name)
  );

  /* ---- 计费 ---- */
  const billingMethods = computed(
    () => props.record.pricing?.billing_methods || [1]
  );

  const billingColorMap: Record<number, string> = {
    1: '6, 182, 212', // 按Tokens - 青
    2: '245, 158, 11', // 按次 - 琥珀
  };

  const billingTagStyle = (bm: number) => {
    const rgb = billingColorMap[bm] || '107, 114, 128';
    return {
      color: `rgb(${rgb})`,
      background: `rgba(${rgb}, 0.08)`,
    };
  };

  /* ---- 类型颜色 ---- */
  const typeColorMap: Record<number, string> = {
    1: '22, 93, 255', // 文生文 - 蓝
    2: '168, 85, 247', // 文生图 - 紫
    3: '14, 165, 233', // 图生文 - 天蓝
    4: '236, 72, 153', // 图生图 - 粉
    5: '245, 158, 11', // 文生语音 - 琥珀
    6: '34, 197, 94', // 语音生文 - 绿
    7: '6, 182, 212', // 向量化 - 青
    8: '239, 68, 68', // 视频生成 - 红
    100: '99, 102, 241', // 多模态 - 靛蓝
    101: '79, 70, 229', // 多模态实时 - 深靛蓝
    102: '217, 119, 87', // 多模态语音 - 珊瑚
    103: '20, 184, 166', // 多模态向量化 - 蓝绿
    10000: '107, 114, 128', // 通用 - 灰蓝
  };

  const typeTagStyle = computed(() => {
    const rgb = typeColorMap[props.record.type] || '99, 102, 241';
    return {
      color: `rgb(${rgb})`,
      background: `rgba(${rgb}, 0.08)`,
    };
  });

  const items = computed(() => props.record.pricing?.billing_items || []);

  const sym = computed(() => app.getCurrencySymbol || '$');
  const fmt = (v: any) => {
    if (v > 0) return `${sym.value}\u2009${parseQuota(v)}`;
    if (v < 0) return `-${sym.value}\u2009${parseQuota(-v)}`;
    return `${sym.value}\u20090.00`;
  };

  interface PreviewItem {
    key: string;
    label: string;
    value: string;
  }

  const buildPreview = (): PreviewItem[] => {
    const p = props.record.pricing;
    if (!p) return [];
    const bi = p.billing_items || [];
    if (!bi.length) return [];
    const arr: PreviewItem[] = [];
    const il = t('model.square.card.pricing.input');
    const ol = t('model.square.card.pricing.output');
    const rl = t('model.square.card.pricing.read');
    const wl = t('model.square.card.pricing.write');
    const has = (k: string) => bi.includes(k);

    // 文本: 输入 $x / M, 输出 $x / M
    if (has('text') && p.text?.length) {
      const r = p.text[0];
      arr.push({
        key: 'text',
        label: t('dict.billing_items.text'),
        value: `${il} ${fmt(r.input_ratio)} / M\n${ol} ${fmt(
          r.output_ratio
        )} / M`,
      });
    }
    // 文本缓存: 读取 $x / M
    if (has('text_cache') && p.text_cache?.length) {
      const r = p.text_cache[0];
      arr.push({
        key: 'text_cache',
        label: t('dict.billing_items.text_cache'),
        value: `${rl} ${fmt(r.read_ratio)} / M`,
      });
    }
    // 阶梯文本: 输入 0k-200k $x / M, 输出 0k-200k $x / M
    if (has('tiered_text') && p.tiered_text?.length) {
      const r = p.tiered_text[0];
      const range = `${r.gt || 0}k-${r.lte || 0}k`;
      arr.push({
        key: 'tiered',
        label: t('dict.billing_items.tiered_text'),
        value: `${il} ${range} ${fmt(r.input_ratio)} / M\n${ol} ${range} ${fmt(
          r.output_ratio
        )} / M`,
      });
    }
    // 阶梯文本缓存: 读取 0k-200k $x / M, 写入 0k-200k $x / M
    if (has('tiered_text_cache') && p.tiered_text_cache?.length) {
      const r = p.tiered_text_cache[0];
      const range = `${r.gt || 0}k-${r.lte || 0}k`;
      const lines = [`${rl} ${range} ${fmt(r.read_ratio)} / M`];
      if (r.write_ratio) {
        lines.push(`${wl} ${range} ${fmt(r.write_ratio)} / M`);
      }
      arr.push({
        key: 'tiered_cache',
        label: t('dict.billing_items.tiered_text_cache'),
        value: lines.join('\n'),
      });
    }
    // 图像生成: 宽x高 价格 / 张
    if (has('image_generation') && p.image_generation?.length) {
      const d =
        p.image_generation.find((x) => x.is_default) || p.image_generation[0];
      arr.push({
        key: 'imgGen',
        label: t('dict.billing_items.image_generation'),
        value: `${d.width}x${d.height} ${fmt(d.once_ratio)} / ${t(
          'unit.piece'
        )}`,
      });
    }
    // 识图: 模式 价格 / 张
    if (has('vision') && p.vision?.length) {
      const d = p.vision.find((x) => x.is_default) || p.vision[0];
      arr.push({
        key: 'vision',
        label: t('dict.billing_items.vision'),
        value: `${d.mode || '-'} ${fmt(d.once_ratio)} / ${t('unit.piece')}`,
      });
    }
    // 音频: 输入价格 / M, 输出价格 / M 或 / min
    if (has('audio') && p.audio) {
      const audioOutUnit =
        props.record.type === 5 || props.record.type === 6 ? 'min' : 'M';
      arr.push({
        key: 'audio',
        label: t('dict.billing_items.audio'),
        value: `${il} ${fmt(p.audio.input_ratio)} / M\n${ol} ${fmt(
          p.audio.output_ratio
        )} / ${audioOutUnit}`,
      });
    }
    // 音频缓存: 读取 $x / M
    if (has('audio_cache') && p.audio_cache) {
      arr.push({
        key: 'audio_cache',
        label: t('dict.billing_items.audio_cache'),
        value: `${rl} ${fmt(p.audio_cache.read_ratio)} / M`,
      });
    }
    // 视频生成: 宽x高 价格 / 秒 或 / M
    if (has('video_generation') && p.video_generation?.length) {
      const d =
        p.video_generation.find((x) => x.is_default) || p.video_generation[0];
      const pc = (props.record.provider_code || '').toLowerCase();
      const pn = props.record.provider_name || '';
      const vidUnit =
        pc === 'volcengine' || pn === '火山引擎' ? 'M' : t('unit.second');
      arr.push({
        key: 'vidGen',
        label: t('dict.billing_items.video_generation'),
        value: `${d.width}x${d.height} ${fmt(d.once_ratio)} / ${vidUnit}`,
      });
    }
    // 视频: 输入价格 / M, 输出价格 / M
    if (has('video') && p.video) {
      arr.push({
        key: 'video',
        label: t('dict.billing_items.video'),
        value: `${il} ${fmt(p.video.input_ratio)} / M\n${ol} ${fmt(
          p.video.output_ratio
        )} / M`,
      });
    }
    // 视频缓存: 读取 $x / M
    if (has('video_cache') && p.video_cache) {
      arr.push({
        key: 'video_cache',
        label: t('dict.billing_items.video_cache'),
        value: `${rl} ${fmt(p.video_cache.read_ratio)} / M`,
      });
    }
    // 搜索: 价格 / 次
    if (has('search') && p.search?.length) {
      const d = p.search.find((x) => x.is_default) || p.search[0];
      arr.push({
        key: 'search',
        label: t('dict.billing_items.search'),
        value: `${fmt(d.once_ratio)} / ${t('unit.once')}`,
      });
    }
    // Midjourney: 价格 / 次
    if (has('midjourney') && p.midjourney?.length) {
      arr.push({
        key: 'mj',
        label: t('dict.billing_items.midjourney'),
        value: `${fmt(p.midjourney[0].once_ratio)} / ${t('unit.once')}`,
      });
    }
    // 一次: 价格 / 次
    if (has('once') && p.once) {
      arr.push({
        key: 'once',
        label: t('dict.billing_items.once'),
        value: `${fmt(p.once.once_ratio)} / ${t('unit.once')}`,
      });
    }
    // 图像: 输入价格 / M, 输出价格 / M
    if (has('image') && p.image) {
      arr.push({
        key: 'image',
        label: t('dict.billing_items.image'),
        value: `${il} ${fmt(p.image.input_ratio)} / M\n${ol} ${fmt(
          p.image.output_ratio
        )} / M`,
      });
    }
    // 图像缓存: 读取 $x / M
    if (has('image_cache') && p.image_cache) {
      arr.push({
        key: 'image_cache',
        label: t('dict.billing_items.image_cache'),
        value: `${rl} ${fmt(p.image_cache.read_ratio)} / M`,
      });
    }
    return arr;
  };

  const previewItems = computed(() => buildPreview().slice(0, 3));

  /* ---- 时间格式化 ---- */
  const fmtMs = (ms: number): string => {
    if (!ms) return '00:00';
    const totalMin = Math.floor(ms / 60000);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  /* ---- 复制 ---- */
  const doCopy = async () => {
    try {
      await copy(props.record.model);
      Message.success(t('model.square.card.copied'));
    } catch {
      Message.error('Copy failed');
    }
  };

  const doCopyName = async () => {
    try {
      await copy(props.record.name || props.record.model);
      Message.success(t('model.square.card.copied'));
    } catch {
      Message.error('Copy failed');
    }
  };
</script>

<script lang="ts">
  export default { name: 'ModelSquareCard' };
</script>

<style scoped lang="less">
  .model-square-card {
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

  .model-square-card__bar {
    height: 4px;
  }

  .model-square-card__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 18px 0;
  }

  .model-square-card__provider {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  .model-square-card__svg {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
  }

  .model-square-card__letter {
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

  .model-square-card__name-wrap {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .model-square-card__name {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    transition: color 0.2s;
    min-width: 0;

    &:hover {
      color: rgb(var(--primary-6));
      .model-square-card__cp {
        opacity: 1;
      }
    }
  }

  .model-square-card__name-text {
    font-size: 15px;
    font-weight: 700;
    color: inherit;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.3;
  }

  .model-square-card__model-sub {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: var(--color-text-2);
    font-family: Consolas, 'Liberation Mono', Menlo, monospace;
    cursor: pointer;
    transition: color 0.2s;
    min-width: 0;

    &:hover {
      color: rgb(var(--primary-6));
      .model-square-card__cp {
        opacity: 1;
      }
    }
  }

  .model-square-card__model-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .model-square-card__cp {
    flex-shrink: 0;
    font-size: 12px;
    color: var(--color-text-3);
    opacity: 0;
    transition: opacity 0.15s;
  }

  .model-square-card__head-tags {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }

  .model-square-card__head-tags-bill {
    display: flex;
    gap: 4px;
  }

  .model-square-card__tag {
    font-size: 11px;
    line-height: 1;
    padding: 3px 8px;
    border-radius: 3px;
    white-space: nowrap;
  }

  .model-square-card__remark {
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

  .model-square-card__spacer {
    flex: 1;
  }

  /* 时段规则 */

  .model-square-card__time-rules {
    margin: 8px 14px 0;
    padding: 6px 10px;
    background: rgba(var(--purple-1), 0.4);
    border: 1px solid rgba(var(--purple-3), 0.3);
    border-radius: 8px;
  }

  .model-square-card__time-rules-hd {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 4px;
    font-size: 11px;
    font-weight: 600;
    color: rgb(var(--purple-6));

    .model-square-card__section-more {
      margin-left: auto;
    }
  }

  .model-square-card__time-rules-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
  }

  .model-square-card__time-rule {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 8px;
    font-size: 11px;
    background: var(--color-bg-2);
    border-radius: 4px;
    border: 1px solid var(--color-border-1);
  }

  .model-square-card__time-rule-name {
    color: var(--color-text-1);
    font-weight: 500;
  }

  .model-square-card__time-rule-discount {
    color: rgb(var(--purple-6));
    font-weight: 600;
  }

  .model-square-card__time-rule-range {
    color: var(--color-text-2);
    font-family: Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 11px;
  }

  .model-square-card__section-more {
    font-size: 11px;
    color: rgb(var(--primary-6));
    padding: 0 4px;
    height: auto;
    line-height: 1;
  }

  .model-square-card__pricing {
    margin: 10px 14px 12px;
    padding: 8px 10px;
    background: linear-gradient(180deg, #f8fbff, #fff);
    border: 1px solid var(--color-border-1);
    border-radius: 10px;
  }

  .model-square-card__pricing-hd {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }

  .model-square-card__pricing-title {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 700;
    color: var(--color-text-1);
    letter-spacing: 0.02em;
  }

  .model-square-card__pricing-icon {
    flex-shrink: 0;
    font-size: 12px;
    font-weight: 700;
    font-family: 'JetBrains Mono', Consolas, monospace;
    color: rgb(var(--gold-6));
  }

  .model-square-card__pricing-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
  }

  .model-square-card__pricing-card {
    padding: 6px 8px;
    background: var(--color-bg-2);
    border: 1px solid var(--color-border-1);
    border-radius: 6px;
  }

  .model-square-card__pricing-card-name {
    margin-bottom: 2px;
    font-size: 11px;
    font-weight: 600;
    color: var(--color-text-1);
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .model-square-card__pricing-card-val {
    font-size: 10px;
    color: var(--color-text-2);
    line-height: 1.4;
    white-space: pre-line;
    word-break: break-word;
  }

  .model-square-card__pricing-nil {
    font-size: 11px;
    color: var(--color-text-4);
  }
</style>
