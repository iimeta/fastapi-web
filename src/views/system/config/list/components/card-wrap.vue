<template>
  <div class="card-wrap">
    <a-card v-if="loading" :bordered="false" hoverable>
      <slot name="skeleton"></slot>
    </a-card>
    <a-card v-else :bordered="false" hoverable>
      <a-space align="start">
        <a-card-meta>
          <template #title>
            <a-typography-text style="margin-right: 130px">
              {{ title }}
            </a-typography-text>
            <span v-if="actionType">
              <a-switch v-if="actionType === 'switch'" v-model="open" />
              <a-space v-else-if="actionType === 'button'">
                <template v-if="isExpires">
                  <a-button type="outline" @click="renew">
                    {{ expiresText }}
                  </a-button>
                </template>
                <template v-else>
                  <a-button v-if="open" @click="handleToggle">
                    {{ closeTxt }}
                  </a-button>
                  <a-button
                    v-else-if="!open"
                    type="outline"
                    @click="handleToggle"
                  >
                    {{ openTxt }}
                  </a-button>
                </template>
              </a-space>
              <div v-else>
                <a-space>
                  <a-button @click="toggle(false)">
                    {{ closeTxt }}
                  </a-button>
                  <a-button type="primary" @click="toggle(true)">
                    {{ openTxt }}
                  </a-button>
                </a-space>
              </div>
            </span>
          </template>
          <template #description>
            {{ description }}
            <slot></slot>
          </template>
        </a-card-meta>
      </a-space>
      <template #actions>
        <a-switch
          v-if="actionType === 'switch'"
          v-model="open"
          @change="configChangeStatus()"
        />
        <a-space v-else-if="actionType === 'button'">
          <template v-if="isExpires">
            <a-button type="outline" @click="renew">
              {{ expiresText }}
            </a-button>
          </template>
          <template v-else>
            <a-button v-if="open" @click="handleToggle">
              {{ closeTxt }}
            </a-button>
            <a-button v-else-if="!open" type="primary" @click="handleToggle">
              {{ openTxt }}
            </a-button>
          </template>
        </a-space>
        <div v-else>
          <a-space>
            <a-button @click="toggle(false)">
              {{ closeTxt }}
            </a-button>
            <a-button type="primary" @click="toggle(true)">
              {{ openTxt }}
            </a-button>
          </a-space>
        </div>
      </template>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, getCurrentInstance } from 'vue';
  import useLoading from '@/hooks/loading';
  import { useToggle } from '@vueuse/core';
  import {
    SysConfigChangeStatus,
    submitSysConfigChangeStatus,
  } from '@/api/sys_config';

  const { proxy } = getCurrentInstance() as any;
  const { setLoading } = useLoading(true);

  const props = defineProps({
    loading: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    action: {
      type: String,
      default: '',
    },
    actionType: {
      type: String,
      default: '',
    },
    defaultValue: {
      type: Boolean,
      default: false,
    },
    openTxt: {
      type: String,
      default: '',
    },
    closeTxt: {
      type: String,
      default: '',
    },
    expiresText: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    showTag: {
      type: Boolean,
      default: true,
    },
    tagText: {
      type: String,
      default: '',
    },
    expires: {
      type: Boolean,
      default: false,
    },
    expiresTagText: {
      type: String,
      default: '',
    },
  });
  const [open, toggle] = useToggle(props.defaultValue);
  const handleToggle = () => {
    toggle();
  };
  const isExpires = ref(props.expires);
  const renew = () => {
    isExpires.value = false;
  };

  const configChangeStatus = async (
    params: SysConfigChangeStatus = {
      action: props.action,
      open: open.value,
    }
  ) => {
    setLoading(true);
    try {
      await submitSysConfigChangeStatus(params);
      proxy.$message.success('操作成功');
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
</script>

<script lang="ts">
  export default {
    name: 'CardWrap',
  };
</script>

<style scoped lang="less">
  .card-wrap {
    height: 100%;
    transition: all 0.3s;
    border: 1px solid var(--color-neutral-3);
    border-radius: 4px;
    &:hover {
      transform: translateY(-4px);
      // box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
    }
    :deep(.arco-card) {
      height: 100%;
      border-radius: 4px;
      .arco-card-body {
        height: 100%;
        .arco-space {
          width: 100%;
          height: 100%;
          .arco-space-item {
            height: 100%;
            &:last-child {
              flex: 1;
            }
            .arco-card-meta {
              height: 100%;
              display: flex;
              flex-flow: column;
              .arco-card-meta-content {
                flex: 1;
                .arco-card-meta-description {
                  margin-top: 8px;
                  color: rgb(var(--gray-6));
                  line-height: 20px;
                  font-size: 12px;
                }
              }
              .arco-card-meta-footer {
                margin-top: 0;
              }
            }
          }
        }
      }
    }
    :deep(.arco-card-meta-title) {
      display: flex;
      align-items: center;

      // To prevent the shaking
      line-height: 28px;
    }
    :deep(.arco-skeleton-line) {
      &:last-child {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
      }
    }
  }
</style>
