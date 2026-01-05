<template>
  <div style="margin: 10px 0 30px 10px">
    <a-descriptions
      :column="2"
      bordered
      :label-style="{ padding: '5px 8px 5px 15px' }"
      :value-style="{ width: '350px', padding: '5px 8px 5px 15px' }"
    >
      <a-descriptions-item :label="$t('group.detail.label.name')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.name }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('group.detail.label.is_default')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ t(`dict.${currentData.is_default || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('group.detail.label.discount')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ Number((currentData.discount * 100).toFixed(2)) }}%
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('group.detail.label.used_quota')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <Quota :model-value="currentData.used_quota" />
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('group.detail.label.models')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 220px; display: block; overflow: auto">
          {{ currentData?.model_names?.join('\n') || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('common.is_public')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ t(`dict.public.${currentData.is_public || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('group.detail.label.weight')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else-if="currentData.is_default">最高</span>
        <span v-else>
          {{ currentData.weight || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="$t('group.detail.label.is_enable_model_agent')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ t(`dict.enable.${currentData.is_enable_model_agent || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('model.detail.label.lb_strategy')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`dict.lb_strategy.${currentData.lb_strategy || 1}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="$t('group.detail.label.model_agents')"
        :span="2"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData?.model_agent_names?.join('\n') || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('group.detail.label.is_limit_quota')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ t(`dict.${currentData?.is_limit_quota || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('group.detail.label.quota')">
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
      <a-descriptions-item :label="$t('group.detail.label.is_enable_forward')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ t(`dict.enable.${currentData.is_enable_forward || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('group.detail.label.forward_rule')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData?.forward_config?.forward_rule
              ? t(
                  `group.dict.forward_rule.${
                    currentData?.forward_config?.forward_rule || 1
                  }`
                )
              : '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('group.detail.label.content_length')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData?.forward_config?.content_length || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('group.detail.label.used_quota')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          <Quota
            v-if="currentData?.forward_config?.used_quota"
            :model-value="currentData?.forward_config?.used_quota"
          />
          <span v-else> - </span>
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('group.detail.label.target_model')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData?.forward_config?.target_model_name || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('group.detail.label.match_rule')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData?.forward_config?.match_rule
              ? t(
                  `group.dict.match_rule.${
                    currentData?.forward_config?.match_rule || 1
                  }`
                )
              : '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('group.detail.label.decision_model')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData?.forward_config?.decision_model_name || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('group.detail.label.keywords')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData?.forward_config?.keywords?.join('\n') || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('group.detail.label.target_model')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{
            currentData?.forward_config?.target_model_names?.join('\n') || '-'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('group.detail.label.remark')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.remark || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('group.detail.label.expires_at')">
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
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import {
    queryGroupDetail,
    GroupDetailParams,
    GroupDetail,
  } from '@/api/group';
  import Quota from '@/views/common/quota.vue';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const currentData = ref<GroupDetail>({} as GroupDetail);
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
</script>

<script lang="ts">
  export default {
    name: 'GroupDetail',
  };
</script>

<style scoped lang="less"></style>
