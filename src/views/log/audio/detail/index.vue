<template>
  <div style="margin: 10px 0 30px 10px">
    <a-descriptions
      v-permission="['user']"
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
      <!-- <a-descriptions-item label="公司">
              <a-skeleton v-if="loading" :animation="true">
                <a-skeleton-line :rows="1" />
              </a-skeleton>
              <span v-else>{{ currentData.corp_name }}</span>
            </a-descriptions-item> -->
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
      <a-descriptions-item label="提问" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 220px; display: block; overflow: auto">
          {{ currentData.input || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item label="回答">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 220px; display: block; overflow: auto">
          {{ currentData.text || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item label="计费方式" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{
          $t(
            `chat.dict.billing_method.${currentData.audio_quota.billing_method}`
          )
        }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="花费令牌数" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{
          currentData.total_tokens
            ? currentData.total_tokens
            : currentData.status === 1 &&
              currentData.audio_quota.billing_method === 2
            ? 0
            : '-'
        }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="提问倍率" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{
          currentData.type !== 6
            ? currentData.audio_quota.prompt_ratio || '-'
            : '-'
        }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="回答倍率" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{
          currentData.type !== 5
            ? currentData.audio_quota.completion_ratio || '-'
            : '-'
        }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="提问字符数" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.characters || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="回答分钟数" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.minute || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="总耗时" :span="2">
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
      <a-descriptions-item label="结果" :span="2">
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
      <a-descriptions-item label="客户端IP" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.client_ip || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="请求时间" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.req_time || '-' }}</span>
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
      <!-- <a-descriptions-item label="启用后备">
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
            </a-descriptions-item> -->
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
          {{ currentData.input || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item label="回答">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 220px; display: block; overflow: auto">
          {{ currentData.text || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item label="计费方式" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{
          $t(
            `chat.dict.billing_method.${currentData.audio_quota.billing_method}`
          )
        }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="花费令牌数" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{
          currentData.total_tokens
            ? currentData.total_tokens
            : currentData.status === 1 &&
              currentData.audio_quota.billing_method === 2
            ? 0
            : '-'
        }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="提问倍率" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{
          currentData.type !== 6
            ? currentData.audio_quota.prompt_ratio || '-'
            : '-'
        }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="回答倍率" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{
          currentData.type !== 5
            ? currentData.audio_quota.completion_ratio || '-'
            : '-'
        }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="提问字符数" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.characters || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="回答分钟数" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.minute || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="总耗时" :span="2">
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
      <a-descriptions-item label="内耗" :span="2">
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
      <a-descriptions-item label="结果" :span="2">
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
      <a-descriptions-item label="本地IP" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.local_ip || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="客户端IP" :span="2">
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
      <a-descriptions-item label="请求时间" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :widths="['200px']" :rows="1" />
        </a-skeleton>
        <span v-else>{{ currentData.req_time || '-' }}</span>
      </a-descriptions-item>
      <a-descriptions-item label="创建时间" :span="2">
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
    queryAudioDetail,
    DetailParams,
    AudioDetail,
    audioCopyField,
  } from '@/api/log';
  import 'vue-json-pretty/lib/styles.css';

  const { loading, setLoading } = useLoading(true);
  const currentData = ref<AudioDetail>({} as AudioDetail);
  const { copy, copied } = useClipboard();
  const { proxy } = getCurrentInstance() as any;

  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
  });

  const getAudioDetail = async (params: DetailParams = { id: props.id }) => {
    setLoading(true);
    try {
      const { data } = await queryAudioDetail(params);
      currentData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getAudioDetail();

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
    const { data } = await audioCopyField({ id, field });
    copy(data.value);
  };
</script>

<script lang="ts">
  export default {
    name: 'AudioDetail',
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
