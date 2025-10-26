<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-user-group />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.group') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.group.update') }}</a-breadcrumb-item>
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
              field="name"
              :label="$t('group.label.name')"
              :rules="[
                {
                  required: true,
                  message: $t('group.error.name.required'),
                },
              ]"
            >
              <a-input
                v-model="formData.name"
                :placeholder="$t('group.placeholder.name')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="discount"
              :label="$t('group.label.discount')"
              :rules="[
                {
                  required: true,
                  message: $t('group.error.discount.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.discount"
                :placeholder="$t('group.placeholder.discount')"
                :min="0.01"
                :max="9999999999999"
                allow-clear
              >
                <template #append> %</template>
              </a-input-number>
            </a-form-item>
            <a-form-item
              v-if="!formData.is_default"
              field="weight"
              :label="$t('group.label.weight')"
              :rules="[
                {
                  required: true,
                  message: $t('group.error.weight.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.weight"
                :placeholder="$t('group.placeholder.weight')"
                :precision="0"
                :min="1"
                :max="99999"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="models"
              :label="$t('group.label.models')"
              :rules="[
                {
                  required: true,
                  message: $t('group.error.models.required'),
                },
              ]"
            >
              <a-tree-select
                v-model="formData.models"
                :placeholder="$t('group.placeholder.models')"
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
              field="is_public"
              :label="$t('group.label.is_public')"
              :rules="[
                {
                  required: true,
                },
              ]"
            >
              <a-switch v-model="formData.is_public" />
            </a-form-item>
            <a-form-item
              field="is_default"
              :label="$t('group.label.is_default')"
            >
              <a-switch v-model="formData.is_default" />
            </a-form-item>
            <a-form-item
              field="remark"
              :label="$t('group.label.remark')"
              :rules="[
                {
                  required: false,
                },
              ]"
            >
              <a-textarea
                v-model="formData.remark"
                :placeholder="$t('group.placeholder.remark')"
              />
            </a-form-item>

            <a-divider orientation="left">
              {{ $t('common.title.advanced') }}
            </a-divider>

            <a-form-item
              field="is_enable_model_agent"
              :label="$t('group.label.is_enable_model_agent')"
            >
              <a-switch v-model="formData.is_enable_model_agent" />
            </a-form-item>
            <a-form-item
              v-if="formData.is_enable_model_agent"
              field="lb_strategy"
              :label="$t('model.label.lb_strategy')"
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
              v-if="formData.is_enable_model_agent"
              field="model_agents"
              :label="$t('group.label.model_agents')"
              :rules="[
                {
                  required: true,
                  message: $t('group.error.model_agents.required'),
                },
              ]"
            >
              <a-select
                v-model="formData.model_agents"
                :placeholder="$t('group.placeholder.model_agents')"
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
              field="is_limit_quota"
              :label="$t('group.label.is_limit_quota')"
            >
              <a-switch v-model="formData.is_limit_quota" />
            </a-form-item>
            <a-form-item
              v-if="formData.is_limit_quota"
              field="quota"
              :label="$t('group.label.quota')"
              :rules="[
                {
                  required: true,
                  message: $t('group.error.quota.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.quota"
                :placeholder="$t('group.placeholder.quota')"
                :min="0.000001"
                :max="9999999999999"
                :parser="parserPrice"
              >
                <template #prefix> $ </template>
              </a-input-number>
            </a-form-item>
            <a-form-item v-if="formData.is_limit_quota">
              <a-radio-group type="button" @change="handleQuotaQuickChange">
                <a-radio :value="100"> $100 </a-radio>
                <a-radio :value="500"> $500 </a-radio>
                <a-radio :value="1000"> $1,000 </a-radio>
                <a-radio :value="5000"> $5,000 </a-radio>
                <a-radio :value="10000"> $10,000 </a-radio>
                <a-radio :value="50000"> $50,000 </a-radio>
                <a-radio :value="100000"> $100,000 </a-radio>
                <a-radio :value="1000000"> $1,000,000 </a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item
              field="model_forward"
              :label="$t('group.label.is_enable_forward')"
            >
              <a-switch
                v-model="formData.is_enable_forward"
                @change="handleForwardRuleChange"
              />
            </a-form-item>
            <a-form-item
              v-if="formData.is_enable_forward"
              field="forward_config.forward_rule"
              :label="$t('group.label.forward_rule')"
              :rules="[
                {
                  required: true,
                  message: $t('group.error.forward_rule.required'),
                },
              ]"
            >
              <a-select
                v-model="formData.forward_config.forward_rule"
                :placeholder="$t('group.placeholder.forward_rule')"
                :scrollbar="false"
                @change="handleForwardRuleChange"
              >
                <a-option value="1">全部转发</a-option>
                <a-option value="2">按关键字</a-option>
                <a-option value="3">内容长度</a-option>
                <a-option value="4">已用额度</a-option>
              </a-select>
            </a-form-item>
            <a-form-item
              v-if="
                formData.is_enable_forward &&
                formData.forward_config.forward_rule === '3'
              "
              field="forward_config.content_length"
              :label="$t('group.label.content_length')"
              :rules="[
                {
                  required: true,
                  message: $t('group.error.content_length.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.forward_config.content_length"
                :placeholder="$t('group.placeholder.content_length')"
                :precision="0"
                :min="1"
                :max="9999999999999"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              v-if="
                formData.is_enable_forward &&
                formData.forward_config.forward_rule === '4'
              "
              field="forward_config.used_quota"
              :label="$t('group.label.used_quota')"
              :rules="[
                {
                  required: true,
                  message: $t('group.error.used_quota.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.forward_config.used_quota"
                :placeholder="$t('group.placeholder.used_quota')"
                :min="0.000001"
                :max="9999999999999"
                :parser="parserPrice"
              >
                <template #prefix> $ </template>
              </a-input-number>
            </a-form-item>
            <a-form-item
              v-if="
                formData.is_enable_forward &&
                formData.forward_config.forward_rule === '4'
              "
            >
              <a-radio-group type="button" @change="handleUsedQuotaQuickChange">
                <a-radio :value="100"> $100 </a-radio>
                <a-radio :value="500"> $500 </a-radio>
                <a-radio :value="1000"> $1,000 </a-radio>
                <a-radio :value="5000"> $5,000 </a-radio>
                <a-radio :value="10000"> $10,000 </a-radio>
                <a-radio :value="50000"> $50,000 </a-radio>
                <a-radio :value="100000"> $100,000 </a-radio>
                <a-radio :value="1000000"> $1,000,000 </a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item
              v-if="
                formData.is_enable_forward &&
                (formData.forward_config.forward_rule === '1' ||
                  formData.forward_config.forward_rule === '3' ||
                  formData.forward_config.forward_rule === '4')
              "
              field="forward_config.target_model"
              :label="$t('group.label.target_model')"
              :rules="[
                {
                  required: true,
                  message: $t('group.error.target_model.required'),
                },
              ]"
            >
              <a-select
                v-model="formData.forward_config.target_model"
                :placeholder="$t('group.placeholder.target_model')"
                :scrollbar="false"
                allow-search
              >
                <a-option
                  v-for="item in models"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </a-select>
            </a-form-item>
            <a-form-item
              v-if="
                formData.is_enable_forward &&
                formData.forward_config.forward_rule === '2'
              "
              field="forward_config.match_rule"
              :label="$t('group.label.match_rule')"
              :rules="[
                {
                  required: true,
                  message: $t('group.error.match_rule.required'),
                },
              ]"
            >
              <a-space size="large">
                <a-checkbox
                  v-model="formData.forward_config.match_rule"
                  value="1"
                  :default-checked="true"
                  >智能匹配</a-checkbox
                >
                <a-checkbox
                  v-model="formData.forward_config.match_rule"
                  value="2"
                  >正则匹配</a-checkbox
                >
              </a-space>
            </a-form-item>
            <a-form-item
              v-if="
                formData.is_enable_forward &&
                formData.forward_config.forward_rule === '2' &&
                formData.forward_config.match_rule.includes('1')
              "
              field="forward_config.decision_model"
              :label="$t('group.label.decision_model')"
              :rules="[
                {
                  required: true,
                  message: $t('group.error.decision_model.required'),
                },
              ]"
            >
              <a-select
                v-model="formData.forward_config.decision_model"
                :placeholder="$t('group.placeholder.decision_model')"
                :scrollbar="false"
                allow-search
              >
                <a-option
                  v-for="item in models"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </a-select>
            </a-form-item>
            <a-form-item
              v-for="(keywords, index) of formData.forward_config.keywords"
              v-show="
                formData.is_enable_forward &&
                formData.forward_config.forward_rule === '2'
              "
              :key="index"
              :field="
                `forward_config.keywords[${index}]` &&
                `forward_config.target_models[${index}]`
              "
              :label="`${index + 1}. ` + $t('group.label.keywords')"
              :rules="[
                {
                  required: true,
                  message: $t('group.error.keywords_target_model.required'),
                },
              ]"
            >
              <a-input
                v-model="formData.forward_config.keywords[index]"
                :placeholder="$t('group.placeholder.keywords')"
                style="width: 45%; margin-right: 5px"
              />
              <a-select
                v-model="formData.forward_config.target_models[index]"
                :placeholder="$t('group.placeholder.target_model')"
                :scrollbar="false"
                style="width: 40%"
                allow-search
              >
                <a-option
                  v-for="item in models"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </a-select>
              <a-button
                type="primary"
                shape="circle"
                style="margin: 0 10px 0 10px"
                @click="handleKeywordsAdd"
              >
                <icon-plus />
              </a-button>
              <a-button
                type="secondary"
                shape="circle"
                @click="handleKeywordsDel(index)"
              >
                <icon-minus />
              </a-button>
            </a-form-item>
            <a-form-item
              field="expires_at"
              :label="$t('group.label.expires_at')"
            >
              <a-date-picker
                v-model="formData.expires_at"
                :placeholder="$t('group.placeholder.expires_at')"
                :time-picker-props="{ defaultValue: '23:59:59' }"
                :disabled-date="disabledDate"
                allow-clear
                style="width: 100%"
                show-time
                :shortcuts="[
                  {
                    label: '1',
                    value: () =>
                      dayjs(
                        formData.expires_at ||
                          new Date().setHours(23, 59, 59, 999)
                      ).add(1, 'day'),
                  },
                  {
                    label: '7',
                    value: () =>
                      dayjs(
                        formData.expires_at ||
                          new Date().setHours(23, 59, 59, 999)
                      ).add(7, 'day'),
                  },
                  {
                    label: '15',
                    value: () =>
                      dayjs(
                        formData.expires_at ||
                          new Date().setHours(23, 59, 59, 999)
                      ).add(15, 'day'),
                  },
                  {
                    label: '30',
                    value: () =>
                      dayjs(
                        formData.expires_at ||
                          new Date().setHours(23, 59, 59, 999)
                      ).add(30, 'day'),
                  },
                  {
                    label: '90',
                    value: () =>
                      dayjs(
                        formData.expires_at ||
                          new Date().setHours(23, 59, 59, 999)
                      ).add(90, 'day'),
                  },
                  {
                    label: '180',
                    value: () =>
                      dayjs(
                        formData.expires_at ||
                          new Date().setHours(23, 59, 59, 999)
                      ).add(180, 'day'),
                  },
                  {
                    label: '365',
                    value: () =>
                      dayjs(
                        formData.expires_at ||
                          new Date().setHours(23, 59, 59, 999)
                      ).add(365, 'day'),
                  },
                ]"
              />
            </a-form-item>
            <a-space>
              <div class="submit-btn">
                <a-button
                  type="secondary"
                  @click="
                    $router.push({
                      name: 'GroupList',
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
  import dayjs from 'dayjs';
  import { FormInstance } from '@arco-design/web-vue';
  import { useRoute, useRouter } from 'vue-router';
  import { disabledDate, parserPrice, convQuota } from '@/utils/common';
  import {
    submitGroupUpdate,
    GroupUpdate,
    GroupDetailParams,
    queryGroupDetail,
  } from '@/api/group';
  import { queryModelList, ModelList, queryModelTree, Tree } from '@/api/model';
  import { queryModelAgentList, ModelAgentList } from '@/api/agent';

  const { loading, setLoading } = useLoading(false);
  const { proxy } = getCurrentInstance() as any;
  const route = useRoute();
  const router = useRouter();

  const models = ref<ModelList[]>([]);
  const getModelList = async () => {
    setLoading(true);
    try {
      const { data } = await queryModelList();
      models.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getModelList();

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
  const formData = ref<GroupUpdate>({
    name: '',
    discount: ref(),
    models: [],
    is_default: false,
    is_public: true,
    weight: ref(),
    expires_at: '',
    remark: '',
    status: 1,
    is_enable_model_agent: false,
    lb_strategy: '1',
    model_agents: [],
    is_limit_quota: false,
    quota: ref(),
    is_enable_forward: false,
    forward_config: {
      forward_rule: '1',
      match_rule: ['2'],
      target_model: '',
      decision_model: '',
      keywords: [],
      target_models: [],
      content_length: ref(),
      used_quota: ref(),
    },
  });

  const submitForm = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      setLoading(true);
      try {
        await submitGroupUpdate(formData.value).then(() => {
          proxy.$message.success('更新成功');
          router.push({
            name: 'GroupList',
          });
        });
      } catch (err) {
        // you can report use errorHandler or other
      } finally {
        setLoading(false);
      }
    }
  };

  const getGroupDetail = async (
    params: GroupDetailParams = { id: route.query.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryGroupDetail(params);
      formData.value.id = data.id;
      formData.value.name = data.name;
      formData.value.discount = Number((data.discount * 100).toFixed(2));
      formData.value.models = data.models;
      formData.value.is_default = data.is_default || false;
      formData.value.is_public = data.is_public || false;
      formData.value.weight = data.weight;
      formData.value.expires_at = data.expires_at;
      formData.value.remark = data.remark;
      formData.value.status = data.status;
      formData.value.is_enable_model_agent = data.is_enable_model_agent;
      formData.value.lb_strategy = String(data.lb_strategy);
      formData.value.model_agents = data.model_agents;
      formData.value.is_limit_quota = data.is_limit_quota;
      formData.value.quota = convQuota(data.quota);
      formData.value.is_enable_forward = data.is_enable_forward;
      formData.value.forward_config = data.forward_config;
      if (data.forward_config) {
        if (data.forward_config.forward_rule) {
          formData.value.forward_config.forward_rule = String(
            data.forward_config.forward_rule
          );
        }
        if (data.forward_config.match_rule) {
          formData.value.forward_config.match_rule =
            data.forward_config.match_rule.map(String);
        }
        formData.value.forward_config.content_length =
          data.forward_config?.content_length;
        formData.value.forward_config.target_model =
          data.forward_config?.target_model;
        formData.value.forward_config.decision_model =
          data.forward_config?.decision_model;
        formData.value.forward_config.keywords = data.forward_config?.keywords;
        formData.value.forward_config.target_models =
          data.forward_config?.target_models;
        formData.value.forward_config.used_quota = convQuota(
          data.forward_config?.used_quota
        );
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getGroupDetail();

  const handleQuotaQuickChange = (quota: number) => {
    formData.value.quota = quota;
  };

  const handleUsedQuotaQuickChange = (quota: number) => {
    formData.value.forward_config.used_quota = quota;
  };

  const handleForwardRuleChange = () => {
    if (
      !formData.value.is_enable_forward &&
      formData.value.forward_config.keywords &&
      (formData.value.forward_config.keywords[0] === '' ||
        formData.value.forward_config.target_models[0] === '')
    ) {
      formData.value.forward_config.keywords = [];
      formData.value.forward_config.target_models = [];
    } else if (
      formData.value.forward_config.forward_rule === '2' &&
      (!formData.value.forward_config.keywords ||
        formData.value.forward_config.keywords.length === 0)
    ) {
      formData.value.forward_config.keywords = [''];
      formData.value.forward_config.target_models = [''];
    } else if (
      formData.value.forward_config.forward_rule === '1' ||
      formData.value.forward_config.forward_rule === '3' ||
      formData.value.forward_config.forward_rule === '4'
    ) {
      if (
        formData.value.forward_config.keywords &&
        (formData.value.forward_config.keywords[0] === '' ||
          formData.value.forward_config.target_models[0] === '')
      ) {
        formData.value.forward_config.keywords = [];
        formData.value.forward_config.target_models = [];
      }
    }
  };

  const handleKeywordsAdd = () => {
    formData.value.forward_config.keywords.push('');
    formData.value.forward_config.target_models.push('');
  };

  const handleKeywordsDel = (index: number) => {
    if (formData.value.forward_config.keywords.length > 1) {
      formData.value.forward_config.keywords.splice(index, 1);
      formData.value.forward_config.target_models.splice(index, 1);
    }
  };
</script>

<script lang="ts">
  export default {
    name: 'GroupUpdate',
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
