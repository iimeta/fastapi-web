<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-bug />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.agent') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.model.agent.create') }}</a-breadcrumb-item>
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
            <a-divider orientation="left">{{
              $t('common.title.baseInfo')
            }}</a-divider>
            <a-form-item
              field="provider_id"
              :label="$t('model.agent.label.provider')"
              :rules="[
                {
                  required: true,
                  message: $t('model.agent.error.provider.required'),
                },
              ]"
            >
              <a-select
                v-model="formData.provider_id"
                :placeholder="$t('model.agent.placeholder.provider')"
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
              field="name"
              :label="$t('model.agent.label.name')"
              :rules="[
                {
                  required: true,
                  message: $t('model.agent.error.name.required'),
                },
                {
                  match: /^.{1,100}$/,
                  message: $t('model.agent.error.name.pattern'),
                },
              ]"
            >
              <a-input
                v-model="formData.name"
                :placeholder="$t('model.agent.placeholder.name')"
              />
            </a-form-item>
            <a-form-item
              field="base_url"
              :label="$t('model.agent.label.baseUrl')"
              :rules="[
                {
                  required: true,
                  message: $t('model.agent.error.baseUrl.required'),
                },
              ]"
            >
              <a-input
                v-model="formData.base_url"
                :placeholder="$t('model.agent.placeholder.baseUrl')"
              />
            </a-form-item>
            <a-form-item field="path" :label="$t('model.agent.label.path')">
              <a-input
                v-model="formData.path"
                :placeholder="$t('model.agent.placeholder.path')"
              />
            </a-form-item>
            <a-form-item field="weight" :label="$t('model.agent.label.weight')">
              <a-input-number
                v-model="formData.weight"
                :placeholder="$t('model.agent.placeholder.weight')"
                :precision="0"
                :min="1"
                :max="100"
              />
            </a-form-item>
            <a-form-item field="remark" :label="$t('model.agent.label.remark')">
              <a-textarea
                v-model="formData.remark"
                :placeholder="$t('model.agent.placeholder.remark')"
              />
            </a-form-item>
            <a-divider orientation="left">
              {{ $t('common.title.advanced') }}
            </a-divider>
            <a-form-item field="models" :label="$t('model.agent.label.models')">
              <a-tree-select
                v-model="formData.models"
                :placeholder="$t('model.agent.placeholder.models')"
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
              field="is_enable_model_replace"
              :label="$t('model.agent.label.is_enable_model_replace')"
            >
              <a-switch
                v-model="formData.is_enable_model_replace"
                @change="handleIsEnableModelReplaceChange"
              />
            </a-form-item>
            <a-form-item
              v-for="(models, index) of formData.replace_models"
              v-show="formData.is_enable_model_replace"
              :key="index"
              :field="`replace_models[${index}]` && `target_models[${index}]`"
              :label="`${index + 1}. ` + $t('model.agent.label.replace_models')"
              :rules="[
                {
                  required: true,
                  message: $t('model.agent.error.replace_models.required'),
                },
              ]"
            >
              <a-input
                v-model="formData.replace_models[index]"
                :placeholder="$t('model.agent.placeholder.replace_models')"
                style="width: 218px; margin-right: 5px"
              />
              <a-input
                v-model="formData.target_models[index]"
                :placeholder="$t('model.agent.placeholder.target_models')"
                style="width: 218px"
              />
              <a-button
                type="primary"
                shape="circle"
                style="margin: 0 10px 0 10px"
                @click="handleModelReplaceAdd"
              >
                <icon-plus />
              </a-button>
              <a-button
                type="secondary"
                shape="circle"
                @click="handleModelReplaceDel(index)"
              >
                <icon-minus />
              </a-button>
            </a-form-item>
            <a-form-item
              field="is_never_disable"
              :label="$t('model.agent.label.is_never_disable')"
            >
              <a-switch v-model="formData.is_never_disable" />
            </a-form-item>
            <a-form-item
              field="lb_strategy"
              :label="$t('model.agent.label.lb_strategy')"
            >
              <a-space size="large">
                <a-radio
                  v-model="formData.lb_strategy"
                  value="1"
                  :default-checked="true"
                >
                  轮询
                </a-radio>
                <a-radio v-model="formData.lb_strategy" value="2">权重</a-radio>
              </a-space>
            </a-form-item>
            <a-form-item field="key" :label="$t('model.agent.label.key')">
              <a-textarea
                v-model="formData.key"
                :placeholder="keyPlaceholder"
                :auto-size="{ minRows: 5, maxRows: 10 }"
              />
            </a-form-item>
            <a-form-item
              field="is_agents_only"
              :label="$t('model.agent.label.isAgentsOnly')"
            >
              <a-switch v-model="formData.is_agents_only" />
            </a-form-item>
            <a-form-item
              field="is_never_disable_key"
              :label="$t('model.agent.label.is_never_disable_key')"
            >
              <a-switch v-model="formData.is_never_disable_key" />
            </a-form-item>
            <a-space>
              <div class="submit-btn">
                <a-button
                  type="secondary"
                  @click="
                    $router.push({
                      name: 'ModelAgentList',
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
  import { FormInstance } from '@arco-design/web-vue/es';
  import { useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import { submitModelAgentCreate, ModelAgentCreate } from '@/api/agent';
  import { queryProviderList, ProviderList } from '@/api/provider';
  import { queryModelTree, Tree } from '@/api/model';

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

  const formRef = ref<FormInstance>();
  const formData = ref<ModelAgentCreate>({
    provider_id: '',
    name: '',
    base_url: '',
    path: '',
    weight: ref(20),
    remark: '',
    models: [],
    is_enable_model_replace: false,
    replace_models: [],
    target_models: [],
    is_never_disable: false,
    lb_strategy: '1',
    key: '',
    is_agents_only: true,
    is_never_disable_key: false,
  });

  const submitForm = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      setLoading(true);
      try {
        await submitModelAgentCreate(formData.value).then(() => {
          proxy.$message.success('新建成功');
          router.push({
            name: 'ModelAgentList',
          });
        });
      } catch (err) {
        // you can report use errorHandler or other
      } finally {
        setLoading(false);
      }
    }
  };

  const handleIsEnableModelReplaceChange = () => {
    if (!formData.value.is_enable_model_replace) {
      formData.value.replace_models = [];
      formData.value.target_models = [];
    } else {
      handleModelReplaceAdd();
    }
  };

  const handleModelReplaceAdd = () => {
    formData.value.replace_models.push('');
    formData.value.target_models.push('');
  };

  const handleModelReplaceDel = (index: number) => {
    if (formData.value.replace_models.length > 1) {
      formData.value.replace_models.splice(index, 1);
      formData.value.target_models.splice(index, 1);
    }
  };
</script>

<script lang="ts">
  export default {
    name: 'ModelAgentCreate',
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
