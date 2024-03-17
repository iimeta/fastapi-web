<template>
  <a-card
    class="general-card"
    :title="$t('userCenter.certification.title.record')"
    :header-style="{ border: 'none' }"
    :bordered="false"
  >
    <a-table v-if="renderData.length" :data="renderData">
      <template #columns>
        <a-table-column
          :title="$t('userCenter.certification.columns.certificationType')"
        >
          <template #cell>
            {{ $t('userCenter.certification.cell.certificationType') }}
          </template>
        </a-table-column>
        <a-table-column
          :title="$t('userCenter.certification.columns.certificationContent')"
          data-index="certificationContent"
        />
        <a-table-column :title="$t('userCenter.certification.columns.status')">
          <template #cell="{ record }">
            <p v-if="record.status === 0">
              <span class="circle"></span>
              <span>{{ $t('userCenter.certification.cell.auditing') }}</span>
            </p>
            <p v-if="record.status === 1">
              <span class="circle pass"></span>
              <span>{{ $t('userCenter.certification.cell.pass') }}</span>
            </p>
          </template>
        </a-table-column>
        <a-table-column
          :title="$t('userCenter.certification.columns.time')"
          data-index="time"
        />
        <a-table-column
          :title="$t('userCenter.certification.columns.operation')"
        >
          <template #cell="{ record }">
            <a-space>
              <a-button type="text">
                {{ $t('userCenter.certification.button.check') }}
              </a-button>
              <a-button v-if="record.status === 0" type="text">
                {{ $t('userCenter.certification.button.withdraw') }}
              </a-button>
            </a-space>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </a-card>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import { CertificationRecord } from '@/api/user-center';

  defineProps({
    renderData: {
      type: Array as PropType<CertificationRecord>,
      default() {
        return [];
      },
    },
  });
</script>

<style scoped lang="less">
  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }
</style>
