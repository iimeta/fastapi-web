<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-safe />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.key') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.key.update') }}</a-breadcrumb-item>
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
              field="corp"
              :label="$t('key.label.corp')"
              :rules="[
                {
                  required: true,
                  message: $t('key.error.corp.required'),
                },
              ]"
            >
              <a-select
                v-model="formData.corp"
                :placeholder="$t('key.placeholder.corp')"
                allow-search
                @change="getKeyPlaceholder"
              >
                <a-option
                  v-for="item in corps"
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
              <a-input
                v-model="formData.key"
                :placeholder="keyPlaceholder"
                :auto-size="{ minRows: 5, maxRows: 10 }"
                allow-clear
              />
            </a-form-item>
            <a-form-item field="weight" :label="$t('model.agent.label.weight')">
              <a-input-number
                v-model="formData.weight"
                :precision="0"
                :min="0"
                :max="999"
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
                :allow-search="true"
                :allow-clear="true"
                :tree-checkable="true"
                tree-checked-strategy="child"
                :data="treeData"
                :placeholder="$t('key.placeholder.models')"
                :max-tag-count="3"
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
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { useRoute, useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import {
    submitKeyUpdate,
    KeyUpdate,
    queryKeyDetail,
    KeyDetailParams,
  } from '@/api/key';
  import { queryCorpList, CorpList } from '@/api/corp';
  import { queryModelTree, Tree } from '@/api/model';
  import { queryModelAgentList, ModelAgentList } from '@/api/agent';

  const { loading, setLoading } = useLoading(false);
  const { proxy } = getCurrentInstance() as any;
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();

  const corps = ref<CorpList[]>([]);
  const corpMap = new Map();
  const getCorpList = async () => {
    setLoading(true);
    try {
      const { data } = await queryCorpList();
      corps.value = data.items;
      for (let i = 0; i < corps.value.length; i += 1) {
        corpMap.set(corps.value[i].id, corps.value[i]);
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getCorpList();

  const keyPlaceholder = ref(t('key.placeholder.update.key'));
  const getKeyPlaceholder = async () => {
    switch (corpMap.get(formData.value.corp).code) {
      case 'Baidu':
        keyPlaceholder.value = t('key.placeholder.update.key.baidu');
        break;
      case 'Xfyun':
        keyPlaceholder.value = t('key.placeholder.update.key.xfyun');
        break;
      default:
        keyPlaceholder.value = t('key.placeholder.update.key');
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
  const formData = ref<KeyUpdate>({
    id: '',
    corp: '',
    key: '',
    weight: ref(20),
    remark: '',
    status: 1,
    models: [],
    model_agents: [],
    is_agents_only: false,
  });

  const submitForm = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      setLoading(true);
      try {
        await submitKeyUpdate(formData.value).then(() => {
          proxy.$message.success('更新成功');
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

  const getKeyDetail = async (
    params: KeyDetailParams = { id: route.query.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryKeyDetail(params);
      formData.value.id = data.id;
      formData.value.corp = data.corp;
      formData.value.key = data.key;
      formData.value.weight = data.weight;
      formData.value.remark = data.remark;
      formData.value.status = data.status;
      formData.value.models = data.models;
      formData.value.model_agents = data.model_agents;
      formData.value.is_agents_only = data.is_agents_only;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getKeyDetail();
</script>

<script lang="ts">
  export default {
    name: 'KeyUpdate',
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
