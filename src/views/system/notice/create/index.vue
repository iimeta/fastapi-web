<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-bar-chart />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.notice') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.notice.create') }}</a-breadcrumb-item>
    </a-breadcrumb>
    <a-spin :loading="loading" style="width: 100%">
      <a-card
        class="general-card"
        :body-style="{ padding: '0 20px 20px 20px' }"
        :bordered="false"
      >
        <div class="wrapper">
          <a-form
            ref="formRef"
            :model="formData"
            class="form"
            :label-col-props="{ span: 5 }"
            :wrapper-col-props="{ span: 18 }"
          >
            <a-form-item
              field="title"
              :label="$t('notice.label.title')"
              :rules="[
                {
                  required: true,
                  message: $t('notice.error.title.required'),
                },
              ]"
            >
              <a-input
                v-model="formData.title"
                :placeholder="$t('notice.placeholder.title')"
                allow-clear
              />
            </a-form-item>
            <div style="flex: 1">
              <AiEditor v-model="formData.content" />
            </div>
            <a-form-item field="remark" :label="$t('notice.label.remark')">
              <a-textarea
                v-model="formData.remark"
                :placeholder="$t('notice.placeholder.remark')"
              />
            </a-form-item>
            <a-space>
              <div class="submit-btn">
                <a-button
                  type="secondary"
                  @click="
                    $router.push({
                      name: 'NoticeList',
                    })
                  "
                >
                  {{ $t('button.cancel') }}
                </a-button>
                <a-button type="primary" @click="submitForm">
                  {{ $t('button.submit') }}
                </a-button>
              </div>
            </a-space>
          </a-form>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import { ref, getCurrentInstance } from 'vue';
  import useLoading from '@/hooks/loading';
  import { submitNoticeCreate, NoticeCreate } from '@/api/notice';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { useRouter } from 'vue-router';
  import AiEditor from './components/index.vue';

  const { proxy } = getCurrentInstance() as any;

  const router = useRouter();
  const formRef = ref<FormInstance>();
  const formData = ref<NoticeCreate>({
    title: '',
    content: '',
    category: ref(),
    scope: 1,
    users: [],
    resellers: [],
    methods: [],
    priority: ref(),
    expires_at: '',
    scheduled_time: '',
    remark: '',
    status: 1,
  });

  const { loading, setLoading } = useLoading(false);
  const submitForm = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      setLoading(true);
      try {
        await submitNoticeCreate(formData.value).then(() => {
          proxy.$message.success('新建成功');
          router.push({
            name: 'NoticeList',
          });
        });
      } catch (err) {
        // you can report use errorHandler or other
      } finally {
        setLoading(false);
      }
    }
  };
</script>

<script lang="ts">
  export default {
    name: 'NoticeCreate',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 10px 20px 10px;
  }

  .container-breadcrumb {
    margin: 6px 0;
    :deep(.arco-breadcrumb-item) {
      color: rgb(var(--gray-6));
      &:last-child {
        color: rgb(var(--gray-8));
      }
    }
  }

  .general-card {
    &:first-child {
      padding-top: 61px;
    }
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--color-bg-2);
    :deep(.arco-form) {
      .arco-form-item {
        width: 700px;
        &:first-child {
          margin-top: 20px;
        }
      }
    }
  }

  .form {
    align-items: center;
  }

  .submit-btn {
    width: 300px;
    display: flex;
    button {
      flex: 1;
      margin: 20px 30px;
    }
  }
</style>
