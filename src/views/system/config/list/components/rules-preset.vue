<template>
  <div class="list-wrap">
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
        style="min-height: 140px"
      >
        <CardWrap
          :loading="loading"
          :title="item.title"
          :description="item.description"
          :default-value="item.enable"
          :action="item.action"
          :action-type="item.actionType"
          :tag-text="$t('cardList.preset.tag')"
        >
          <template #skeleton>
            <a-skeleton :animation="true">
              <a-skeleton-line :widths="['100%', '40%']" :rows="2" />
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
      title: '内容屏蔽规则',
      description:
        '用户在执行特定的内容分发任务时，可使用内容屏蔽规则根据特定标签，过滤内容集合。',
      enable: true,
      action: 'http1',
      actionType: 'switch',
    },
    {
      id: 2,
      title: '内容置顶规则',
      description:
        '该规则支持用户在执行特定内容分发任务时，对固定的几条内容置顶。',
      enable: true,
      action: 'http2',
      actionType: 'switch',
    },
    {
      id: 3,
      title: '内容加权规则',
      description: '选定内容加权规则后可自定义从不同内容集合获取内容的概率。',
      enable: false,
      action: 'http3',
      actionType: 'switch',
    },
    {
      id: 4,
      title: '内容分发规则',
      description: '内容分发时，对某些内容需要固定在C端展示的位置。',
      enable: true,
      action: 'http4',
      actionType: 'switch',
    },
    {
      id: 5,
      title: '违禁内容识别',
      description: '精准识别赌博、刀枪、毒品、造假、贩假等违规物品和违规行为。',
      enable: false,
      action: 'http5',
      actionType: 'switch',
    },
    {
      id: 6,
      title: '多语言文字符号识别',
      description:
        '精准识别英语、维语、藏语、蒙古语、朝鲜语等多种语言以及emoji表情形态的语义识别。',
      enable: false,
      action: 'http6',
      actionType: 'switch',
    },
  ];
</script>

<style scoped lang="less"></style>
