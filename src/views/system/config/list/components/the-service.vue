<template>
  <div class="list-wrap">
    <a-typography-title class="block-title" :heading="6">
      {{ $t('cardList.tab.title.service') }}
    </a-typography-title>
    <a-row class="list-row" :gutter="24">
      <a-col
        v-for="item in renderData"
        :key="item.id"
        :xs="12"
        :sm="12"
        :md="12"
        :lg="6"
        :xl="6"
        :xxl="6"
        class="list-col"
        style="min-height: 162px"
      >
        <CardWrap
          :loading="loading"
          :title="item.title"
          :description="item.description"
          :default-value="item.enable"
          :action-type="item.actionType"
          :expires="item.expires"
          :open-txt="$t('cardList.service.open')"
          :close-txt="$t('cardList.service.cancel')"
          :expires-text="$t('cardList.service.renew')"
          :tag-text="$t('cardList.service.tag')"
          :expires-tag-text="$t('cardList.service.expiresTag')"
          :icon="item.icon"
        >
          <template #skeleton>
            <a-skeleton :animation="true">
              <a-skeleton-line :widths="['100%', '40%', '100%']" :rows="3" />
              <a-skeleton-line :widths="['40%']" :rows="1" />
            </a-skeleton>
          </template>
        </CardWrap>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import { ServiceRecord } from '@/api/list';
  import CardWrap from './card-wrap.vue';

  const renderData: ServiceRecord[] = [
    {
      id: 1,
      icon: 'code',
      title: '漏斗分析',
      description:
        '用户行为分析之漏斗分析模型是企业实现精细化运营、进行用户行为分析的重要数据分析模型。',
      enable: true,
      actionType: 'button',
    },
    {
      id: 2,
      icon: 'edit',
      title: '用户分布',
      description:
        '快速诊断用户人群，地域细分情况，了解数据分布的集中度，以及主要的数据分布的区间段是什么。',
      enable: true,
      actionType: 'button',
      expires: true,
    },
    {
      id: 3,
      icon: 'user',
      title: '资源分发',
      description:
        '移动端动态化资源分发解决方案。提供稳定大流量服务支持、灵活定制的分发圈选规则，通过离线化预加载。',
      enable: false,
      actionType: 'button',
    },
    {
      id: 4,
      icon: 'user',
      title: '用户画像分析',
      description:
        '用户画像就是将典型用户信息标签化，根据用户特征、业务场景和用户行为等信息，构建一个标签化的用户模型。',
      enable: true,
      actionType: 'button',
    },
  ];
</script>

<style scoped lang="less"></style>
