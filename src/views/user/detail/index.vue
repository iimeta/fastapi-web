<template>
  <div style="margin: 10px 0 30px 10px">
    <a-descriptions
      :column="2"
      bordered
      :value-style="{ width: '350px', padding: '5px 8px 5px 20px' }"
    >
      <a-descriptions-item :label="t('common.user_id')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.user_id }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('user.detail.label.rid')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.rid || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('common.account')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.account }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('common.name')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.name }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('common.email')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.email }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('user.detail.label.quota')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData.quota > 0
              ? `$${currentData.quota}`
              : currentData.quota < 0
              ? `-$${-currentData.quota}`
              : '$0.00'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('user.detail.label.used_quota')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            currentData.used_quota > 0 ? `$${currentData.used_quota}` : '$0.00'
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('user.detail.label.quota_expires_at')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.quota_expires_at || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('common.status')">
        <a-tag v-if="currentData.status === 1" color="green">
          {{ $t(`dict.status.${currentData.status}`) }}
        </a-tag>
        <a-tag v-else color="red">
          {{ $t(`dict.status.${currentData.status}`) }}
        </a-tag>
      </a-descriptions-item>
      <a-descriptions-item :label="t('user.detail.label.quota_warning')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{
            $t(
              `operations.open.${
                currentData.quota_warning ||
                (currentData.warning_threshold === 0 &&
                  currentData.expire_warning_threshold === 0)
              }`
            )
          }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('user.detail.label.warning_threshold')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else> ${{ currentData.warning_threshold || 50 }} </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="t('user.detail.label.expire_warning_threshold')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else> {{ currentData.expire_warning_threshold || 3 }}天 </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('user.detail.label.warning_notice')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`dict.notice.${currentData.warning_notice || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item
        :label="t('user.detail.label.expire_warning_notice')"
      >
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`dict.notice.${currentData.expire_warning_notice || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('user.detail.label.exhaustion_notice')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`dict.notice.${currentData.exhaustion_notice || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('user.detail.label.expire_notice')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ $t(`dict.notice.${currentData.expire_notice || false}`) }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('user.detail.label.groups')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 220px; display: block; overflow: auto">
          {{ currentData?.group_names?.join('\n') || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('common.remark')" :span="2">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else style="max-height: 110px; display: block; overflow: auto">
          {{ currentData.remark || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('user.detail.label.login_ip')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.login_ip || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('user.detail.label.login_time')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.login_time || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('user.detail.label.login_domain')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.login_domain || '-' }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('common.created_at')">
        <a-skeleton v-if="loading" :animation="true">
          <a-skeleton-line :rows="1" />
        </a-skeleton>
        <span v-else>
          {{ currentData.created_at }}
        </span>
      </a-descriptions-item>
      <a-descriptions-item :label="t('common.updated_at')">
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
    queryUserDetail,
    UserDetailParams,
    UserDetail,
  } from '@/api/admin_user';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const currentData = ref<UserDetail>({} as UserDetail);
  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
  });

  const getUserDetail = async (params: UserDetailParams = { id: props.id }) => {
    setLoading(true);
    try {
      const { data } = await queryUserDetail(params);
      currentData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getUserDetail();
</script>

<script lang="ts">
  export default {
    name: 'UserDetail',
  };
</script>

<style scoped lang="less"></style>
