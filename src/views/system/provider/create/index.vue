<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-settings />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.sys') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.provider.create') }}</a-breadcrumb-item>
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
              field="name"
              :label="$t('provider.label.name')"
              :rules="[
                {
                  required: true,
                  message: $t('provider.error.name.required'),
                },
                {
                  match: /^.{1,100}$/,
                  message: $t('provider.error.name.pattern'),
                },
              ]"
            >
              <a-input
                v-model="formData.name"
                :placeholder="$t('provider.placeholder.name')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="code"
              :label="$t('provider.label.code')"
              :rules="[
                {
                  required: true,
                  message: $t('provider.error.code.required'),
                },
                {
                  match: /^.{1,100}$/,
                  message: $t('provider.error.code.pattern'),
                },
              ]"
            >
              <a-input
                v-model="formData.code"
                :placeholder="$t('provider.placeholder.code')"
                allow-clear
              />
            </a-form-item>
            <a-form-item field="sort" :label="$t('provider.label.sort')">
              <a-input-number
                v-model="formData.sort"
                :placeholder="$t('provider.placeholder.sort')"
                :precision="0"
                :min="-10"
                :max="999"
              />
            </a-form-item>
            <a-form-item
              field="is_public"
              :label="$t('provider.label.is_public')"
            >
              <a-switch v-model="formData.is_public" />
            </a-form-item>
            <a-form-item field="remark" :label="$t('provider.label.remark')">
              <a-textarea
                v-model="formData.remark"
                :placeholder="$t('provider.placeholder.remark')"
              />
            </a-form-item>
            <a-space>
              <div class="submit-btn">
                <a-button
                  type="secondary"
                  @click="
                    $router.push({
                      name: 'ProviderList',
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
  import { submitProviderCreate, ProviderCreate } from '@/api/provider';
  import { FormInstance } from '@arco-design/web-vue/es';
  import { useRouter } from 'vue-router';

  const { proxy } = getCurrentInstance() as any;

  const router = useRouter();
  const formRef = ref<FormInstance>();
  const formData = ref<ProviderCreate>({
    name: '',
    code: '',
    sort: ref(),
    is_public: true,
    remark: '',
  });

  const { loading, setLoading } = useLoading(false);
  const submitForm = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      setLoading(true);
      try {
        await submitProviderCreate(formData.value).then(() => {
          proxy.$message.success('新建成功');
          router.push({
            name: 'ProviderList',
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
    name: 'ProviderCreate',
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
