<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-safe />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.key') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.key.create') }}</a-breadcrumb-item>
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
            :label-col-props="{ span: 3 }"
            :wrapper-col-props="{ span: 21 }"
          >
            <a-divider orientation="left">
              {{ $t('common.title.baseInfo') }}
            </a-divider>
            <a-form-item
              field="provider_id"
              :label="$t('key.label.provider')"
              :rules="[
                {
                  required: true,
                  message: $t('key.error.provider.required'),
                },
              ]"
            >
              <a-select
                v-model="formData.provider_id"
                :placeholder="$t('key.placeholder.provider')"
                :scrollbar="false"
                allow-search
                @change="getKeyPlaceholder"
              >
                <a-option
                  v-for="item in providers"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </a-select>
            </a-form-item>
            <a-form-item
              field="key"
              :label="$t('key.label.key')"
              :rules="[
                {
                  required: true,
                  message: $t('key.error.key.required'),
                },
              ]"
            >
              <a-textarea
                v-model="formData.key"
                :placeholder="keyPlaceholder"
                :auto-size="{ minRows: 5, maxRows: 10 }"
              />
            </a-form-item>
            <a-form-item field="weight" :label="$t('model.agent.label.weight')">
              <a-input-number
                v-model="formData.weight"
                :precision="0"
                :min="1"
                :max="100"
                :placeholder="$t('model.agent.placeholder.weight')"
              />
            </a-form-item>
            <a-form-item field="remark" :label="$t('key.label.remark')">
              <a-textarea
                v-model="formData.remark"
                :placeholder="$t('key.placeholder.remark')"
              />
            </a-form-item>

            <a-divider orientation="left">
              {{ $t('common.title.advanced') }}
            </a-divider>

            <a-form-item field="models" :label="$t('key.label.models')">
              <a-tree-select
                v-model="formData.models"
                :placeholder="$t('key.placeholder.models')"
                :allow-search="true"
                :allow-clear="true"
                :tree-checkable="true"
                :data="treeData"
                :max-tag-count="3"
                :scrollbar="false"
                tree-checked-strategy="child"
              />
            </a-form-item>
            <a-form-item
              field="model_agents"
              :label="$t('key.label.modelAgents')"
            >
              <a-select
                v-model="formData.model_agents"
                :placeholder="$t('key.placeholder.modelAgents')"
                :max-tag-count="3"
                :scrollbar="false"
                multiple
                allow-search
                allow-clear
              >
                <a-option
                  v-for="item in modelAgents"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </a-select>
            </a-form-item>
            <a-form-item
              field="is_agents_only"
              :label="$t('key.label.isAgentsOnly')"
            >
              <a-switch v-model="formData.is_agents_only" />
            </a-form-item>
            <a-form-item
              field="is_never_disable"
              :label="$t('key.label.is_never_disable')"
            >
              <a-switch v-model="formData.is_never_disable" />
            </a-form-item>
            <a-space>
              <div class="submit-btn">
                <a-button
                  type="secondary"
                  @click="
                    $router.push({
                      name: 'ModelKeyList',
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
  import { FormInstance } from '@arco-design/web-vue';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { submitKeyCreate, KeyCreate } from '@/api/key';
  import { queryProviderList, ProviderList } from '@/api/provider';
  import { queryModelTree, Tree } from '@/api/model';
  import { queryModelAgentList, ModelAgentList } from '@/api/agent';

  const { loading, setLoading } = useLoading(false);
  const { proxy } = getCurrentInstance() as any;
  const router = useRouter();
  const { t } = useI18n();

  const providers = ref<ProviderList[]>([]);
  const providerMap = new Map();
  const getProviderList = async () => {
    setLoading(true);
    try {
      const { data } = await queryProviderList();
      providers.value = data.items;
      for (let i = 0; i < providers.value.length; i += 1) {
        providerMap.set(providers.value[i].id, providers.value[i]);
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getProviderList();

  const keyPlaceholder = ref(t('key.placeholder.key'));
  const getKeyPlaceholder = async () => {
    switch (providerMap.get(formData.value.provider_id).code) {
      case 'Baidu':
        keyPlaceholder.value = t('key.placeholder.key.baidu');
        break;
      case 'Xfyun':
        keyPlaceholder.value = t('key.placeholder.key.xfyun');
        break;
      case 'DeepSeek-Baidu':
        keyPlaceholder.value = t('key.placeholder.key.deepseek.baidu');
        break;
      case 'VolcEngine':
        keyPlaceholder.value = t('key.placeholder.key.volcengine');
        break;
      default:
        keyPlaceholder.value = t('key.placeholder.key');
    }
  };

  const treeData = ref<Tree[]>([]);
  const getModelTree = async () => {
    setLoading(true);
    try {
      const { data } = await queryModelTree();
      treeData.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getModelTree();

  const modelAgents = ref<ModelAgentList[]>([]);
  const getModelAgentList = async () => {
    setLoading(true);
    try {
      const { data } = await queryModelAgentList();
      modelAgents.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getModelAgentList();

  const formRef = ref<FormInstance>();
  const formData = ref<KeyCreate>({
    provider_id: '',
    key: '',
    weight: ref(20),
    remark: '',
    models: [],
    model_agents: [],
    is_agents_only: false,
    is_never_disable: false,
  });

  const submitForm = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      setLoading(true);
      try {
        await submitKeyCreate(formData.value).then(() => {
          proxy.$message.success('操作成功, 任务已提交');
          router.push({
            name: 'ModelKeyList',
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
    name: 'KeyCreate',
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
      padding-top: 20px;
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

  .arco-divider-horizontal.arco-divider-with-text {
    margin: 20px 0 30px 0;
  }

  .arco-divider-horizontal {
    min-width: 97%;
    max-width: 97%;
    margin-bottom: 30px;
    &:first-child {
      margin-top: 20px;
      margin-bottom: 40px;
    }
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
