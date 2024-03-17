<template>
  <a-card
    class="general-card"
    :title="$t('userCenter.certification.title.enterprise')"
    :header-style="{ padding: '0px 20px 16px 20px' }"
    :bordered="false"
  >
    <template #extra>
      <a-link>{{ $t('userCenter.certification.extra.enterprise') }}</a-link>
    </template>
    <a-descriptions
      class="card-content"
      :data="renderData"
      :column="3"
      align="right"
      layout="inline-horizontal"
      :label-style="{ fontWeight: 'normal' }"
      :value-style="{
        width: '200px',
        paddingLeft: '8px',
        textAlign: 'left',
      }"
    >
      <template #label="{ label }">{{ $t(label) }} :</template>
      <template #value="{ value, data }">
        <a-tag
          v-if="data.label === 'userCenter.certification.label.status'"
          color="green"
          size="small"
        >
          已认证
        </a-tag>
        <span v-else>{{ value }}</span>
      </template>
    </a-descriptions>
  </a-card>
</template>

<script lang="ts" setup>
  import { PropType, computed } from 'vue';
  import { EnterpriseCertificationModel } from '@/api/user-center';
  import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';

  const props = defineProps({
    enterpriseInfo: {
      type: Object as PropType<EnterpriseCertificationModel>,
      required: true,
    },
  });
  const renderData = computed(() => {
    const {
      accountType,
      status,
      time,
      legalPerson,
      certificateType,
      authenticationNumber,
      enterpriseName,
      enterpriseCertificateType,
      organizationCode,
    } = props.enterpriseInfo;
    return [
      {
        label: 'userCenter.certification.label.accountType',
        value: accountType,
      },
      {
        label: 'userCenter.certification.label.status',
        value: status,
      },
      {
        label: 'userCenter.certification.label.time',
        value: time,
      },
      {
        label: 'userCenter.certification.label.legalPerson',
        value: legalPerson,
      },
      {
        label: 'userCenter.certification.label.certificateType',
        value: certificateType,
      },
      {
        label: 'userCenter.certification.label.authenticationNumber',
        value: authenticationNumber,
      },
      {
        label: 'userCenter.certification.label.enterpriseName',
        value: enterpriseName,
      },
      {
        label: 'userCenter.certification.label.enterpriseCertificateType',
        value: enterpriseCertificateType,
      },
      {
        label: 'userCenter.certification.label.organizationCode',
        value: organizationCode,
      },
    ] as DescData[];
  });
</script>

<style scoped lang="less">
  .card-content {
    width: 100%;
    padding: 20px;
    background-color: rgb(var(--gray-1));
  }
  .item-label {
    min-width: 98px;
    text-align: right;
    color: var(--color-text-8);
    &:after {
      content: ':';
    }
  }
</style>
