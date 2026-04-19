<template>
  <div class="card-wrap model-agent-card-item">
    <a-checkbox
      class="model-agent-card-item__check"
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
        <div class="model-agent-card-item__title-bar">
          <span class="model-agent-card-item__logo-box">
            <svg
              v-if="logoData"
              class="model-agent-card-item__logo"
              :viewBox="logoData.viewBox"
              fill="currentColor"
              :style="{ color: logoData.color }"
              aria-hidden="true"
            >
              <path :d="logoData.path" />
            </svg>
            <span v-else class="model-agent-card-item__logo-fallback">
              {{ providerInitial }}
            </span>
          </span>
          <div class="model-agent-card-item__title-wrap">
            <span class="model-agent-card-item__title" :title="record.name">
              {{ record.name }}
            </span>
            <div
              v-if="record.remark"
              class="model-agent-card-item__remark"
              :title="record.remark"
            >
              {{ record.remark }}
            </div>
            <div
              v-if="record.updated_at"
              class="model-agent-card-item__updated-at"
              :title="record.updated_at"
            >
              {{ record.updated_at }}
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
          <div class="model-agent-card-item__desc">
            <div class="model-agent-card-item__inline-row">
              <div
                v-if="hasField('models')"
                class="model-agent-card-item__inline-item"
              >
                <span class="model-agent-card-item__label">
                  {{ fieldTitleMap.models }}
                </span>
                <span class="model-agent-card-item__value">
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
                v-if="hasField('weight')"
                class="model-agent-card-item__inline-item"
              >
                <span class="model-agent-card-item__label">
                  {{ fieldTitleMap.weight }}
                </span>
                <span class="model-agent-card-item__value">
                  {{ record.weight || 0 }}
                </span>
              </div>
              <div
                v-if="hasField('lb_strategy')"
                class="model-agent-card-item__inline-item"
              >
                <span class="model-agent-card-item__label">
                  {{ fieldTitleMap.lb_strategy }}
                </span>
                <span class="model-agent-card-item__value">
                  {{ $t(`dict.lb_strategy.${record.lb_strategy || 1}`) }}
                </span>
              </div>
            </div>
            <div
              v-for="field in visibleFields"
              :key="field.dataIndex"
              class="model-agent-card-item__field"
            >
              <template
                v-if="
                  !['models', 'weight', 'lb_strategy'].includes(field.dataIndex)
                "
              >
                <span class="model-agent-card-item__label">
                  {{ field.title }}
                </span>
                <span class="model-agent-card-item__value">
                  <template v-if="field.dataIndex === 'group_names'">
                    <span :title="record.group_names?.join(', ') || ''">
                      {{ record.group_names?.join(', ') || '-' }}
                    </span>
                  </template>
                  <template v-else>
                    {{ valueOf(field.dataIndex) }}
                  </template>
                </span>
              </template>
            </div>
          </div>
        </template>
      </a-card-meta>
      <template #actions>
        <a-button type="primary" @click.stop="$emit('update', record.id)">
          {{ $t('button.update') }}
        </a-button>
        <a-button @click.stop="$emit('keys', record.id)">
          {{ $t('button.key') }}
        </a-button>
        <a-button status="success" @click.stop="$emit('test', record.id)">
          {{ $t('button.test') }}
        </a-button>
      </template>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import type {
    ModelAgentChangeStatus,
    ModelAgentPage,
  } from '@/api/model_agent';

  type FieldItem = {
    title: string;
    dataIndex: string;
    checked?: boolean;
  };
  type ModelAgentCardRecord = ModelAgentPage & {
    group_names?: string[];
    updated_at?: string;
    lb_strategy?: number;
  };

  const props = defineProps<{
    record: ModelAgentCardRecord;
    checked: boolean;
    size: 'mini' | 'small' | 'medium' | 'large';
    visibleFields: FieldItem[];
  }>();

  const emit = defineEmits<{
    (e: 'toggleCheck', checked: boolean): void;
    (e: 'detail', id: string): void;
    (e: 'models', id: string): void;
    (e: 'update', id: string): void;
    (e: 'keys', id: string): void;
    (e: 'test', id: string): void;
    (e: 'statusChange', payload: ModelAgentChangeStatus): void;
  }>();

  const cardHeaderStyle = {
    padding: '14px 16px 0 16px',
  };
  const cardBodyStyle = {
    padding: '10px 16px 0 16px',
  };

  const logoMap: Record<
    string,
    { viewBox: string; path: string; color: string }
  > = {
    openai: {
      viewBox: '0 0 24 24',
      path: 'M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z',
      color: '#10a37f',
    },
    google: {
      viewBox: '0 0 24 24',
      path: 'M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12c6.627 0 12-5.373 12-12S18.627 0 12 0zm-.001 4.8a7.2 7.2 0 0 1 7.2 7.2 7.2 7.2 0 1 1-7.2-7.2z',
      color: '#4285f4',
    },
    anthropic: {
      viewBox: '0 0 24 24',
      path: 'M17.304 3.541h-3.672l6.696 16.918h3.672zm-10.608 0L0 20.459h3.744l1.37-3.553h7.005l1.369 3.553h3.744L10.536 3.541zm-.372 10.339l2.3-5.967 2.3 5.967z',
      color: '#d97757',
    },
    deepseek: {
      viewBox: '0 0 24 24',
      path: 'M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3.248 7.2a.6.6 0 0 1 .6.6v8.4a.6.6 0 0 1-.6.6H8.752a.6.6 0 0 1-.6-.6V7.8a.6.6 0 0 1 .6-.6z',
      color: '#4d6bfe',
    },
    baidu: {
      viewBox: '0 0 24 24',
      path: 'M5.927 12.497c2.063-.443 1.782-2.909 1.72-3.448-.101-.83-.593-2.36-2.32-2.206-2.14.202-1.996 2.975-1.996 2.975s-.461 3.146 2.596 2.679zm3.22-4.803c1.7 0 2.315-1.756 2.315-3.282S10.847.011 9.147.011c-1.7 0-2.315 1.62-2.315 3.146s.615 2.537 2.315 2.537zm5.54.758c1.762.35 2.605-1.265 2.898-2.54.293-1.277.086-3.169-1.762-3.555C14.068 2.97 13.394 4.5 13.197 5.2c-.283 1.022-.18 2.86 1.49 3.253zm4.744 2.735c0-.764-.544-3.31-2.771-3.31-2.227 0-2.622 1.99-2.622 3.539 0 1.358.336 3.281 2.827 3.068 2.492-.214 2.566-2.532 2.566-3.297zm-6.343 3.394c-.499-.56-1.545-.982-2.478-1.06-1.16-.13-1.418.396-2.741.207-1.321-.193-.783-.633-2.224-.245-1.029.275-2.658 1.265-3.27 2.972-.867 2.476.699 6.2 2.404 7.554 1.596 1.249 2.879.687 3.936.588 1.033-.109 1.753.514 3.008.289 1.252-.227 2.097-1.185 2.537-1.87.632-.986 1.035-1.86 1.187-3.37.023-.185-.012-.367-.121-.51-.49-.632-1.733-3.963-2.238-4.555z',
      color: '#2932e1',
    },
    meta: {
      viewBox: '0 0 24 24',
      path: 'M6.915 4.03c-1.968 0-3.412 1.06-4.36 2.847C1.524 8.572.93 10.77.93 12.568c0 2.378.79 3.964 2.602 3.964 1.232 0 2.19-.628 3.564-2.704.985-1.49 1.74-2.9 2.36-4.107.398-.775.68-1.353.86-1.754a12.4 12.4 0 0 0-1.202-2.12C8.24 4.674 7.577 4.03 6.915 4.03zM17.085 4.03c-.662 0-1.325.644-2.199 1.817a12.4 12.4 0 0 0-1.202 2.12c.18.401.462.979.86 1.754.62 1.207 1.375 2.617 2.36 4.107 1.374 2.076 2.332 2.704 3.564 2.704 1.813 0 2.602-1.586 2.602-3.964 0-1.798-.594-3.996-1.625-5.691-.948-1.787-2.392-2.847-4.36-2.847z',
      color: '#0082fb',
    },
    mistral: {
      viewBox: '0 0 24 24',
      path: 'M0 0h4.8v4.8H0zm19.2 0H24v4.8h-4.8zM0 4.8h4.8v4.8H0zm4.8 0h4.8v4.8H4.8zm9.6 0h4.8v4.8h-4.8zm4.8 0H24v4.8h-4.8zM0 9.6h4.8v4.8H0zm4.8 0h4.8v4.8H4.8zm4.8 0h4.8v4.8H9.6zm4.8 0h4.8v4.8h-4.8zm4.8 0H24v4.8h-4.8zM0 14.4h4.8v4.8H0zm4.8 0h4.8v4.8H4.8zm9.6 0h4.8v4.8h-4.8zm4.8 0H24v4.8h-4.8zM0 19.2h4.8V24H0zm19.2 0H24V24h-4.8z',
      color: '#ff7000',
    },
  };

  const logoData = computed(() => {
    const key = (props.record.provider_name || '').toLowerCase();
    const matched = Object.keys(logoMap).find((item) => key.includes(item));
    return matched ? logoMap[matched] : null;
  });

  const providerInitial = computed(() => {
    const value = props.record.provider_name || '';
    return value ? value.charAt(0).toUpperCase() : '?';
  });

  const fieldTitleMap = {
    models: props.visibleFields.find((item) => item.dataIndex === 'models')
      ?.title,
    weight: props.visibleFields.find((item) => item.dataIndex === 'weight')
      ?.title,
    lb_strategy: props.visibleFields.find(
      (item) => item.dataIndex === 'lb_strategy'
    )?.title,
  };

  const hasField = (dataIndex: string) =>
    props.visibleFields.some((item) => item.dataIndex === dataIndex);

  const valueOf = (dataIndex: string) => {
    const value = props.record[dataIndex as keyof ModelAgentCardRecord];
    if (Array.isArray(value)) {
      return value.join(', ') || '-';
    }
    return value || '-';
  };

  const changeStatus = (value: string | number | boolean) => {
    emit('statusChange', {
      id: props.record.id,
      status: Number(value),
    });
  };
</script>

<script lang="ts">
  export default {
    name: 'CardItem',
  };
</script>

<style scoped lang="less">
  .model-agent-card-item {
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

    &--checked {
      border-color: rgb(var(--primary-6));
    }

    &--off {
      opacity: 0.7;
    }
  }

  .model-agent-card-item__title-bar {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    min-width: 0;
    width: 100%;
  }

  .model-agent-card-item__extra {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .model-agent-card-item__check {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 3;
  }

  .model-agent-card-item__logo-box {
    width: 50px;
    height: 50px;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    overflow: hidden;
    border-radius: 4px;
  }

  .model-agent-card-item__logo {
    display: block;
    width: 42px;
    height: 42px;
  }

  .model-agent-card-item__logo-fallback {
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--color-fill-2);
    color: var(--color-text-2);
    font-size: 18px;
    line-height: 42px;
  }

  .model-agent-card-item__title-wrap {
    flex: 1;
    min-width: 0;
    height: 58px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .model-agent-card-item__title {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 22px;
    line-height: 22px;
    font-size: 15px;
  }

  .model-agent-card-item__remark {
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

  .model-agent-card-item__updated-at {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--color-text-2);
    font-size: 12px;
    height: 18px;
    line-height: 18px;
  }

  .model-agent-card-item__desc {
    min-height: 80px;
  }

  .model-agent-card-item__inline-row {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 12px;
    font-size: 12px;
  }

  .model-agent-card-item__inline-item {
    min-width: 0;
    display: flex;
    align-items: center;
  }

  .model-agent-card-item__field {
    margin-bottom: 6px;
    font-size: 12px;
    line-height: 20px;
    display: flex;
    align-items: center;
    min-width: 0;
  }

  .model-agent-card-item__label {
    flex-shrink: 0;
    margin-right: 4px;
    font-weight: normal;
    color: rgb(var(--gray-8));
  }

  .model-agent-card-item__value {
    display: block;
    flex: 1;
    min-width: 0;
    color: var(--color-text-1);
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .model-agent-card-item__inline-item .model-agent-card-item__value {
    text-align: left;
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
