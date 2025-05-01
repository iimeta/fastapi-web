<template>
  <div style="margin: 10px 0 30px 10px">
    <a-descriptions
      v-permission="['reseller', 'user']"
      :column="2"
      bordered
      :value-style="{ width: '350px', padding: '5px 8px 5px 20px' }"
    >
      <a-descriptions-item label="Trace ID" :span="2">
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
      <a-descriptions-item label="Host" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.host || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item label="调用密钥" :span="2">
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
      <a-descriptions-item label="用户ID">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.user_id || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="应用ID" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.app_id || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="公司">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.corp_name }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="模型">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.model || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="模型类型">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ $t(`dict.model_type.${currentData.type}`) }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="流式">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{
          $t(`chat.dict.stream.${currentData.stream || false}`)
        }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="提问" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 220px; display: block; overflow: auto">
          {{ currentData.prompt || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item label="回答">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 220px; display: block; overflow: auto">
          {{ currentData.completion || '-' }}
        </span>
      </a-descriptions-item>
      <!-- <a-descriptions-item label="计费方式">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            $t(
              `chat.dict.billing_method.${currentData.text_quota.billing_method}`
            )
          }}
        </span>
      </a-descriptions-item> -->
      <a-descriptions-item label="分组名称">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.group_name || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="分组折扣" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData.discount > 0
              ? Number((currentData.discount * 100).toFixed(2)) + '%'
              : '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item label="提问倍率">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{
          currentData.type !== 100
            ? currentData.text_quota.prompt_ratio || '-'
            : currentData.multimodal_quota.text_quota.prompt_ratio || '-'
        }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="回答倍率" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else
          >{{
            currentData.type !== 100
              ? currentData.text_quota.completion_ratio || '-'
              : currentData.multimodal_quota.text_quota.completion_ratio || '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item label="提问令牌数">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.prompt_tokens || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="回答令牌数">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.completion_tokens || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="缓存写入令牌数">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.cache_write_tokens || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="缓存命中令牌数">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.cache_hit_tokens || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="搜索令牌数">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.search_tokens || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="花费令牌数">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData.total_tokens
              ? currentData.total_tokens
              : currentData.status === 1 &&
                currentData.text_quota.billing_method === 2
              ? 0
              : '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item label="连接耗时">
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
      <a-descriptions-item label="持续时长">
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
      <a-descriptions-item label="总耗时">
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
      <a-descriptions-item label="结果">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <a-tag v-if="currentData.status === 1" color="green">
            {{ $t(`chat.dict.status.${currentData.status}`) }}
          </a-tag>
          <a-tag v-else-if="currentData.status === 2" color="gold">
            {{ $t(`chat.dict.status.${currentData.status}`) }}
          </a-tag>
          <a-tag v-else-if="currentData.status === 3" color="orange">
            {{ $t(`chat.dict.status.${currentData.status}`) }}
          </a-tag>
          <a-tag v-else color="red">
            {{ $t(`chat.dict.status.${currentData.status}`) }}
          </a-tag>
        </span>
      </a-descriptions-item>
      <a-descriptions-item label="客户端IP">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.client_ip || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="请求时间">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.req_time || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="错误信息">
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
      <a-descriptions-item label="Trace ID" :span="2">
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
      <a-descriptions-item label="Host">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.host || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item label="调用密钥" :span="2">
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
      <a-descriptions-item label="用户ID">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{
          currentData.is_smart_match ? '-' : currentData.user_id || '-'
        }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="应用ID" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{
          currentData.is_smart_match ? '-' : currentData.app_id || '-'
        }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="公司">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.corp_name }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="模型类型">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ $t(`dict.model_type.${currentData.type}`) }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="请求模型名称">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.name || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="请求模型">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.model || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="真实模型名称">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.real_model_name }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="真实模型">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.real_model }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="流式">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`chat.dict.stream.${currentData.stream || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item label="启用后备">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            $t(
              `chat.dict.is_enable_fallback.${
                currentData.is_enable_fallback || false
              }`
            )
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item label="后备代理">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData?.fallback_config?.model_agent_name || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item label="后备模型">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData?.fallback_config?.model || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item label="启用转发">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{
          $t(
            `chat.dict.is_enable_forward.${
              currentData.is_enable_forward || false
            }`
          )
        }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="转发规则">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{
          currentData.is_enable_forward
            ? $t(
                `chat.dict.forward_rule.${
                  currentData.forward_config.forward_rule || '1'
                }`
              )
            : '-'
        }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="启用代理" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{
          $t(
            `chat.dict.is_enable_model_agent.${
              currentData.is_enable_model_agent || false
            }`
          )
        }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="代理名称">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData?.model_agent?.name || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="密钥">
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
      <a-descriptions-item label="提问" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 220px; display: block; overflow: auto">
          {{ currentData.prompt || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item label="回答">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 220px; display: block; overflow: auto">
          {{ currentData.completion || '-' }}
        </span>
      </a-descriptions-item>
      <!-- <a-descriptions-item label="计费方式" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{
          $t(
            `chat.dict.billing_method.${currentData.text_quota.billing_method}`
          )
        }}</span>
      </a-descriptions-item> -->
      <a-descriptions-item label="分组名称" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.group_name || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="分组折扣">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData.discount > 0
              ? Number((currentData.discount * 100).toFixed(2)) + '%'
              : '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item label="提问倍率" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{
          currentData.type !== 100
            ? currentData.text_quota.prompt_ratio || '-'
            : currentData.multimodal_quota.text_quota.prompt_ratio || '-'
        }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="回答倍率">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{
          currentData.type !== 100
            ? currentData.text_quota.completion_ratio || '-'
            : currentData.multimodal_quota.text_quota.completion_ratio || '-'
        }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="提问令牌数" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.prompt_tokens || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="回答令牌数">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.completion_tokens || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="缓存写入令牌数" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.cache_write_tokens || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="缓存命中令牌数">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.cache_hit_tokens || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="搜索令牌数" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.search_tokens || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="花费令牌数">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData.total_tokens
              ? currentData.total_tokens
              : currentData.status === 1 &&
                currentData.text_quota.billing_method === 2
              ? 0
              : '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item label="连接耗时" :span="2">
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
      <a-descriptions-item label="持续时长">
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
      <a-descriptions-item label="总耗时">
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
      <a-descriptions-item label="内耗">
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
      <a-descriptions-item label="结果">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <a-tag v-if="currentData.status === 1" color="green">
            {{ $t(`chat.dict.status.${currentData.status}`) }}
          </a-tag>
          <a-tag v-else-if="currentData.status === 2" color="gold">
            {{ $t(`chat.dict.status.${currentData.status}`) }}
          </a-tag>
          <a-tag v-else-if="currentData.status === 3" color="orange">
            {{ $t(`chat.dict.status.${currentData.status}`) }}
          </a-tag>
          <a-tag v-else color="red">
            {{ $t(`chat.dict.status.${currentData.status}`) }}
          </a-tag>
        </span>
      </a-descriptions-item>
      <a-descriptions-item label="本地IP">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.local_ip || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="客户端IP">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.client_ip || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="远程IP" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.remote_ip || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="请求时间">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.req_time || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="创建时间">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.created_at || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="错误信息" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 220px; display: block; overflow: auto">
          {{ currentData.err_msg || '-' }}
        </span>
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions
      layout="inline-vertical"
      :column="2"
      style="margin-top: 10px; position: relative"
    >
      <a-descriptions-item :span="2">
        <a-tabs type="card">
          <a-tab-pane key="1" title="提问上下文">
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
    <a-descriptions
      v-permission="['admin']"
      layout="inline-vertical"
      :column="2"
      style="margin-top: 10px; position: relative"
    >
      <a-descriptions-item :span="2">
        <a-tabs type="card">
          <a-tab-pane key="1" title="模型代理">
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
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, getCurrentInstance } from 'vue';
  import useLoading from '@/hooks/loading';
  import { useClipboard } from '@vueuse/core';
  import VueJsonPretty from 'vue-json-pretty';
  import {
    queryChatDetail,
    DetailParams,
    ChatDetail,
    chatCopyField,
  } from '@/api/log';
  import 'vue-json-pretty/lib/styles.css';

  const { loading, setLoading } = useLoading(true);
  const currentData = ref<ChatDetail>({} as ChatDetail);
  const { copy, copied } = useClipboard();
  const { proxy } = getCurrentInstance() as any;

  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
  });

  const getChatDetail = async (params: DetailParams = { id: props.id }) => {
    setLoading(true);
    try {
      const { data } = await queryChatDetail(params);
      currentData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getChatDetail();

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
      proxy.$message.success('复制成功');
    }
  });

  /**
   * 复制字段值
   */
  const handleCopyField = async (id: string, field: string) => {
    const { data } = await chatCopyField({ id, field });
    copy(data.value);
  };
</script>

<script lang="ts">
  export default {
    name: 'ChatDetail',
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
</style>
