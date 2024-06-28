<template>
  <a-card
    class="general-card"
    :title="$t('workplace.docs')"
    :header-style="{ padding: '20px 20px 0 20px' }"
    :body-style="{ padding: '10px 20px' }"
    style="height: 124px"
    :bordered="false"
  >
    <template #extra>
      <a-link href="https://4707373.fastapi.ai" target="_blank">{{
        $t('workplace.viewMore')
      }}</a-link>
    </template>
    <a-row>
      <a-col :span="12">
        <a-link href="https://4707373.fastapi.ai" target="_blank">
          {{ $t('workplace.docs.productOverview') }}
        </a-link>
      </a-col>
      <a-col :span="12">
        <a-link href="https://4707373.fastapi.ai" target="_blank">
          {{ $t('workplace.docs.userGuide') }}
        </a-link>
      </a-col>
      <a-col :span="12">
        <a-link href="https://4707373.fastapi.ai" target="_blank">
          {{ $t('workplace.docs.workflow') }}
        </a-link>
      </a-col>
      <a-col :span="12">
        <a-link href="https://4707373.fastapi.ai" target="_blank">
          {{ $t('workplace.docs.interfaceDocs') }}
        </a-link>
      </a-col>
    </a-row>
  </a-card>
</template>

<style lang="less" scoped>
  .arco-card-body .arco-link {
    margin: 2px 0;
    color: rgb(var(--gray-8));
  }
</style>
