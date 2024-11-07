<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-bug />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.agent') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.model.agent.update') }}</a-breadcrumb-item>
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
              $t('model.title.baseInfo')
            }}</a-divider>
            <a-form-item
              field="corp"
              :label="$t('model.agent.label.corp')"
              :rules="[
                {
                  required: true,
                  message: $t('model.agent.error.corp.required'),
                },
              ]"
            >
              <a-select
                v-model="formData.corp"
                :placeholder="$t('model.agent.placeholder.corp')"
                allow-search
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
            <a-form-item field="remark" :label="$t('model.agent.label.remark')">
              <a-textarea
                v-model="formData.remark"
                :placeholder="$t('model.agent.placeholder.remark')"
              />
            </a-form-item>
            <a-divider orientation="left">{{
              $t('model.title.advanced')
            }}</a-divider>
            <a-form-item
              field="lb_strategy"
              :label="$t('model.agent.label.lb_strategy')"
              :rules="[
                {
                  required: true,
                },
              ]"
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
            <a-form-item
              v-if="formData.lb_strategy === '2'"
              field="weight"
              :label="$t('model.agent.label.weight')"
              :rules="[
                {
                  required: formData.lb_strategy === '2',
                  message: $t('model.agent.error.weight.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.weight"
                :precision="0"
                :min="0"
                :max="999"
                :placeholder="$t('model.agent.placeholder.weight')"
              />
            </a-form-item>
            <a-form-item
              field="models"
              :label="$t('model.agent.label.models')"
              :rules="[
                {
                  required: false,
                },
              ]"
            >
              <a-tree-select
                v-model="formData.models"
                :allow-search="true"
                :allow-clear="true"
                :tree-checkable="true"
                tree-checked-strategy="child"
                :data="treeData"
                :placeholder="$t('model.agent.placeholder.models')"
                :max-tag-count="3"
              />
            </a-form-item>
            <a-form-item field="key" :label="$t('model.agent.label.key')">
              <a-textarea
                v-model="formData.key"
                :placeholder="$t('model.agent.placeholder.key')"
                :auto-size="{ minRows: 5, maxRows: 10 }"
              />
            </a-form-item>
            <a-form-item
              field="is_agents_only"
              :label="$t('model.agent.label.isAgentsOnly')"
            >
              <a-switch v-model="formData.is_agents_only" />
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
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { useRoute, useRouter } from 'vue-router';
  import {
    submitModelAgentUpdate,
    ModelAgentUpdate,
    queryModelAgentDetail,
    ModelAgentDetailParams,
  } from '@/api/agent';
  import { queryCorpList, CorpList } from '@/api/corp';
  import { queryModelTree, Tree } from '@/api/model';

  const { loading, setLoading } = useLoading(false);
  const { proxy } = getCurrentInstance() as any;
  const route = useRoute();
  const router = useRouter();

  const corps = ref<CorpList[]>([]);
  const getCorpList = async () => {
    setLoading(true);
    try {
      const { data } = await queryCorpList();
      corps.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getCorpList();

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
  const formData = ref<ModelAgentUpdate>({
    id: '',
    corp: '',
    name: '',
    base_url: '',
    path: '',
    lb_strategy: '',
    weight: ref(20),
    remark: '',
    status: 1,
    models: [],
    key: '',
    is_agents_only: true,
  });

  const submitForm = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      setLoading(true);
      try {
        await submitModelAgentUpdate(formData.value).then(() => {
          proxy.$message.success('更新成功');
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

  const getModelAgentDetail = async (
    params: ModelAgentDetailParams = { id: route.query.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryModelAgentDetail(params);
      formData.value.id = data.id;
      formData.value.corp = data.corp;
      formData.value.name = data.name;
      formData.value.base_url = data.base_url;
      formData.value.path = data.path;
      formData.value.lb_strategy = String(data.lb_strategy);
      formData.value.weight = data.weight;
      formData.value.remark = data.remark;
      formData.value.status = data.status;
      formData.value.models = data.models;
      formData.value.key = data.key;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getModelAgentDetail();
</script>

<script lang="ts">
  export default {
    name: 'ModelAgentUpdate',
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
