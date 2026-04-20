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
              <path v-if="logoData.path" :d="logoData.path" />
              <g v-else-if="logoData.markup" v-html="logoData.markup" />
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
  import {
    getProviderCompanyLogo,
    getProviderInitial,
  } from '@/utils/provider-brand';

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

  const logoData = computed(() =>
    getProviderCompanyLogo(
      props.record.provider_code || props.record.provider_id,
      props.record.provider_name
    )
  );

  const providerInitial = computed(() =>
    getProviderInitial(props.record.provider_name)
  );

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
