<template>
  <div style="margin: 10px 0 30px 10px">
    <a-descriptions
      v-permission="['user', 'reseller']"
      :column="2"
      bordered
      :value-style="{ width: '350px', padding: '5px 8px 5px 20px' }"
    >
      <a-descriptions-item :label="$t('common.trace_id')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.trace_id }}
          <icon-copy
            class="copy-btn"
            @click="handleCopy(currentData.trace_id)"
          />
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.host')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.host || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.creator')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.creator }}
          <icon-copy
            class="copy-btn"
            @click="handleCopyField(currentData.id, 'creator')"
          />
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.user_id')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.user_id || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.app_id')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.app_id || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.provider')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.provider_name }}</span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.model')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.model || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.model_type')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{
          $t(`dict.model_type.${currentData.model_type}`)
        }}</span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.stream')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ $t(`dict.${currentData.stream || false}`) }}</span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.prompt')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 220px; display: block; overflow: auto">
          {{ currentData.prompt || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.completion')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 220px; display: block; overflow: auto">
          {{ currentData.completion || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.group_name')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.spend.group_name || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.discount')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData.spend.group_discount > 0
              ? Number((currentData.spend.group_discount * 100).toFixed(2)) +
                '%'
              : '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.billing_methods')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData.spend.billing_methods
              ? $t(`dict.billing_methods.${currentData.spend.billing_methods}`)
              : '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.total.spend')">
        <template #label>
          <span>
            {{ $t('common.total.spend') }}
            <a-tooltip
              :content="$t('log.columns.tooltip.total_spend_tokens')"
              :content-style="{
                whiteSpace: 'nowrap',
                maxWidth: 'none',
              }"
            >
              <icon-question-circle style="color: var(--color-text-3)" />
            </a-tooltip>
          </span>
        </template>
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span
          v-else
          class="spend"
          @click="
            currentData.status === 1 || currentData.status === 2
              ? spendHandle(currentData.spend, currentData.model_type)
              : undefined
          "
        >
          <Quota
            v-if="currentData.status === 1 || currentData.status === 2"
            :model-value="currentData.spend.total_spend_tokens"
          />
          <span v-else> - </span>
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.conn_time')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <a-tag v-if="currentData.conn_time > 30000" color="red">
            {{ currentData.conn_time }} ms
          </a-tag>
          <a-tag v-else-if="currentData.conn_time > 15000" color="orange">
            {{ currentData.conn_time }} ms
          </a-tag>
          <a-tag v-else-if="currentData.conn_time > 5000" color="gold">
            {{ currentData.conn_time }} ms
          </a-tag>
          <a-tag v-else color="green"
            >{{ currentData.conn_time || '-' }} ms</a-tag
          >
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.duration')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <a-tag v-if="currentData.duration > 180000" color="red">
            {{ currentData.duration }} ms
          </a-tag>
          <a-tag v-else-if="currentData.duration > 120000" color="orange">
            {{ currentData.duration }} ms
          </a-tag>
          <a-tag v-else-if="currentData.duration > 90000" color="gold">
            {{ currentData.duration }} ms
          </a-tag>
          <a-tag v-else color="green"
            >{{ currentData.duration || '-' }} ms</a-tag
          >
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.total_time')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <a-tag v-if="currentData.total_time > 180000" color="red">
            {{ currentData.total_time }} ms
          </a-tag>
          <a-tag v-else-if="currentData.total_time > 120000" color="orange">
            {{ currentData.total_time }} ms
          </a-tag>
          <a-tag v-else-if="currentData.total_time > 90000" color="gold">
            {{ currentData.total_time }} ms
          </a-tag>
          <a-tag v-else color="green"
            >{{ currentData.total_time || '-' }} ms</a-tag
          >
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.status')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <a-tag v-if="currentData.status === 1" color="green">
            {{ $t(`log.dict.status.${currentData.status}`) }}
          </a-tag>
          <a-tag v-else-if="currentData.status === 2" color="gold">
            {{ $t(`log.dict.status.${currentData.status}`) }}
          </a-tag>
          <a-tag v-else-if="currentData.status === 3" color="orange">
            {{ $t(`log.dict.status.${currentData.status}`) }}
          </a-tag>
          <a-tag v-else color="red">
            {{ $t(`log.dict.status.${currentData.status}`) }}
          </a-tag>
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.client_ip')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.client_ip || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.req_time')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.req_time || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.err_msg')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 220px; display: block; overflow: auto">
          {{ currentData.err_msg || '-' }}
        </span>
      </a-descriptions-item>
    </a-descriptions>

    <a-descriptions
      v-permission="['admin']"
      :column="2"
      bordered
      :value-style="{ width: '350px', padding: '5px 8px 5px 20px' }"
    >
      <a-descriptions-item :label="$t('common.trace_id')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.trace_id }}
          <icon-copy
            class="copy-btn"
            @click="handleCopy(currentData.trace_id)"
          />
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.host')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.host || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.creator')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.is_smart_match ? '-' : currentData.creator }}
          <icon-copy
            v-if="!currentData.is_smart_match"
            class="copy-btn"
            @click="handleCopyField(currentData.id, 'creator')"
          />
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.user_id')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{
          currentData.is_smart_match ? '-' : currentData.user_id || '-'
        }}</span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.app_id')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{
          currentData.is_smart_match ? '-' : currentData.app_id || '-'
        }}</span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.provider')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.provider_name }}</span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.model_type')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{
          $t(`dict.model_type.${currentData.model_type}`)
        }}</span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.req_model_name')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.model_name || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.req_model')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.model || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.real_model_name')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.real_model_name }}</span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.real_model')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.real_model }}</span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.stream')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`dict.${currentData.stream || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.enable_fallback')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`dict.${currentData.is_enable_fallback || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.fallback_model_agent')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData?.fallback_config?.model_agent_name || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.fallback_model')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData?.fallback_config?.model || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.enable_forward')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{
          $t(`dict.${currentData.is_enable_forward || false}`)
        }}</span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.forward_rule')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{
          currentData.is_enable_forward
            ? $t(
                `dict.forward_rule.${
                  currentData.forward_config.forward_rule || '1'
                }`
              )
            : '-'
        }}</span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.enable_model_agent')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{
          $t(`dict.${currentData.is_enable_model_agent || false}`)
        }}</span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.model_agent_name')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData?.model_agent?.name || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.key')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData.key
              ? currentData.key.length > 0
                ? currentData.key.substr(
                    0,
                    currentData.key.length / 2 > 10
                      ? 10
                      : currentData.key.length / 2
                  ) +
                  '************************************' +
                  currentData.key.substr(
                    -(currentData.key.length / 2 > 5
                      ? 5
                      : currentData.key.length / 2)
                  )
                : currentData.key
              : '-'
          }}
          <icon-copy
            class="copy-btn"
            @click="handleCopyField(currentData.id, 'key')"
          />
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.prompt')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 220px; display: block; overflow: auto">
          {{ currentData.prompt || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.completion')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 220px; display: block; overflow: auto">
          {{ currentData.completion || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.group_name')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.spend.group_name || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.discount')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData.spend.group_discount > 0
              ? Number((currentData.spend.group_discount * 100).toFixed(2)) +
                '%'
              : '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.billing_methods')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData.spend.billing_methods
              ? $t(`dict.billing_methods.${currentData.spend.billing_methods}`)
              : '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.total.spend')">
        <template #label>
          <span>
            {{ $t('common.total.spend') }}
            <a-tooltip
              :content="$t('log.columns.tooltip.total_spend_tokens')"
              :content-style="{
                whiteSpace: 'nowrap',
                maxWidth: 'none',
              }"
            >
              <icon-question-circle style="color: var(--color-text-3)" />
            </a-tooltip>
          </span>
        </template>
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span
          v-else
          class="spend"
          @click="
            currentData.status === 1 || currentData.status === 2
              ? spendHandle(currentData.spend, currentData.model_type)
              : undefined
          "
        >
          <Quota
            v-if="currentData.status === 1 || currentData.status === 2"
            :model-value="currentData.spend.total_spend_tokens"
          />
          <span v-else> - </span>
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.conn_time')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <a-tag v-if="currentData.conn_time > 10000" color="red">
            {{ currentData.conn_time }} ms
          </a-tag>
          <a-tag v-else-if="currentData.conn_time > 5000" color="orange">
            {{ currentData.conn_time }} ms
          </a-tag>
          <a-tag v-else-if="currentData.conn_time > 3000" color="gold">
            {{ currentData.conn_time }} ms
          </a-tag>
          <a-tag v-else color="green"
            >{{ currentData.conn_time || '-' }} ms</a-tag
          >
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.duration')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <a-tag v-if="currentData.duration > 120000" color="red">
            {{ currentData.duration }} ms
          </a-tag>
          <a-tag v-else-if="currentData.duration > 90000" color="orange">
            {{ currentData.duration }} ms
          </a-tag>
          <a-tag v-else-if="currentData.duration > 60000" color="gold">
            {{ currentData.duration }} ms
          </a-tag>
          <a-tag v-else color="green"
            >{{ currentData.duration || '-' }} ms</a-tag
          >
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.total_time')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <a-tag v-if="currentData.total_time > 120000" color="red">
            {{ currentData.total_time }} ms
          </a-tag>
          <a-tag v-else-if="currentData.total_time > 90000" color="orange">
            {{ currentData.total_time }} ms
          </a-tag>
          <a-tag v-else-if="currentData.total_time > 60000" color="gold">
            {{ currentData.total_time }} ms
          </a-tag>
          <a-tag v-else color="green"
            >{{ currentData.total_time || '-' }} ms</a-tag
          >
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.internal_time')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <a-tag v-if="currentData.internal_time > 500" color="red">
            {{ currentData.internal_time }} ms
          </a-tag>
          <a-tag v-else-if="currentData.internal_time > 300" color="orange">
            {{ currentData.internal_time }} ms
          </a-tag>
          <a-tag v-else-if="currentData.internal_time > 100" color="gold">
            {{ currentData.internal_time }} ms
          </a-tag>
          <a-tag v-else color="green"
            >{{ currentData.internal_time || '-' }} ms</a-tag
          >
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.status')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <a-tag v-if="currentData.status === 1" color="green">
            {{ $t(`log.dict.status.${currentData.status}`) }}
          </a-tag>
          <a-tag v-else-if="currentData.status === 2" color="gold">
            {{ $t(`log.dict.status.${currentData.status}`) }}
          </a-tag>
          <a-tag v-else-if="currentData.status === 3" color="orange">
            {{ $t(`log.dict.status.${currentData.status}`) }}
          </a-tag>
          <a-tag v-else color="red">
            {{ $t(`log.dict.status.${currentData.status}`) }}
          </a-tag>
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.local_ip')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.local_ip || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.client_ip')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.client_ip || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.remote_ip')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.remote_ip || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.req_time')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.req_time || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.created_at')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.created_at || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('log.detail.err_msg')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 220px; display: block; overflow: auto">
          {{ currentData.err_msg || '-' }}
        </span>
      </a-descriptions-item>
    </a-descriptions>

    <!-- 提问上下文 -->
    <a-descriptions
      layout="inline-vertical"
      :column="1"
      style="margin-top: 10px; position: relative"
    >
      <a-descriptions-item>
        <a-tabs type="card">
          <a-tab-pane key="1" :title="$t('log.detail.messages')">
            <a-skeleton v-if="loading" :animation="true">
              <a-skeleton-line :rows="3" />
            </a-skeleton>
            <a-space
              v-else
              style="max-height: 220px; display: block; overflow: auto"
            >
              <VueJsonPretty
                v-if="currentData.messages"
                :path="'res'"
                :data="currentData.messages"
                :show-length="true"
              />
              <span v-else>-</span>
            </a-space>
          </a-tab-pane>
        </a-tabs>
      </a-descriptions-item>
    </a-descriptions>

    <!-- 模型代理 -->
    <a-descriptions
      v-permission="['admin']"
      layout="inline-vertical"
      :column="1"
      style="margin-top: 10px; position: relative"
    >
      <a-descriptions-item>
        <a-tabs type="card">
          <a-tab-pane key="1" :title="$t('common.model_agents')">
            <a-skeleton v-if="loading" :animation="true">
              <a-skeleton-line :rows="3" />
            </a-skeleton>
            <a-space v-else>
              <VueJsonPretty
                v-if="currentData.model_agent"
                :data="currentData.model_agent"
                :show-length="true"
              />
              <span v-else>-</span>
            </a-space>
          </a-tab-pane>
        </a-tabs>
      </a-descriptions-item>
    </a-descriptions>

    <!-- 花费明细 -->
    <a-modal
      v-model:visible="spendVisible"
      :width="1068"
      :body-style="{ maxHeight: '520px' }"
      :modal-style="{
        padding: '25px 20px 20px 20px',
      }"
      hide-title
      hide-cancel
      unmount-on-close
      simple
      :ok-text="$t('button.close')"
    >
      <SpendDetail v-model="spend" :model-type="modelType" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import { useClipboard } from '@vueuse/core';
  import VueJsonPretty from 'vue-json-pretty';
  import {
    queryTextDetail,
    DetailParams,
    TextDetail,
    textCopyField,
  } from '@/api/log';
  import { Spend } from '@/api/common';
  import Quota from '@/views/common/quota.vue';
  import SpendDetail from '../components/spend.vue';
  import 'vue-json-pretty/lib/styles.css';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const currentData = ref<TextDetail>({} as TextDetail);
  const { copy, copied } = useClipboard();

  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
  });

  const getTextDetail = async (params: DetailParams = { id: props.id }) => {
    setLoading(true);
    try {
      const { data } = await queryTextDetail(params);
      currentData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getTextDetail();

  /**
   * 复制内容
   *
   * @param content 内容
   */
  const handleCopy = (content: string) => {
    copy(content);
  };

  watch(copied, () => {
    if (copied.value) {
      Message.success(t('success.copy'));
    }
  });

  /**
   * 复制字段值
   */
  const handleCopyField = async (id: string, field: string) => {
    const { data } = await textCopyField({ id, field });
    copy(data.value);
  };

  const spendVisible = ref(false);
  const spend = ref();
  const modelType = ref();

  const spendHandle = async (s: Spend, t: number) => {
    spendVisible.value = true;
    spend.value = s;
    modelType.value = t;
  };
</script>

<script lang="ts">
  export default {
    name: 'LogTextDetail',
  };
</script>

<style scoped lang="less">
  .copy-btn {
    color: gray;
    cursor: pointer;
  }
  .copy-btn:hover {
    color: rgb(var(--arcoblue-6));
  }
  .spend {
    color: rgb(var(--link-6));
    padding: 0;
  }
  .spend:hover {
    color: rgb(var(--link-6));
    cursor: pointer;
  }
</style>
