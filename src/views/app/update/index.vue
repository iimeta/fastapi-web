<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-apps />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.app') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.app.update') }}</a-breadcrumb-item>
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
            <!-- <a-divider orientation="left">{{
              $t('common.title.baseInfo')
            }}</a-divider> -->
            <a-form-item
              field="name"
              :label="$t('app.label.name')"
              :rules="[
                {
                  required: true,
                  message: $t('app.error.name.required'),
                },
                {
                  match: /^.{1,100}$/,
                  message: $t('app.error.name.pattern'),
                },
              ]"
            >
              <a-input
                v-model="formData.name"
                :placeholder="$t('app.placeholder.name')"
              />
            </a-form-item>
            <!-- <a-divider orientation="left">{{
              $t('common.title.advanced')
            }}</a-divider> -->
            <a-form-item field="models" :label="$t('app.label.models')">
              <a-tree-select
                v-model="formData.models"
                :placeholder="$t('app.placeholder.models')"
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
              field="is_limit_quota"
              :label="$t('app.label.isLimitQuota')"
            >
              <a-switch v-model="formData.is_limit_quota" />
            </a-form-item>
            <a-form-item
              v-if="formData.is_limit_quota"
              field="quota"
              :label="$t('app.label.quota')"
              :rules="[
                {
                  required: true,
                  message: $t('app.error.quota.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.quota"
                :placeholder="$t('app.placeholder.quota')"
                :precision="0"
                :min="0"
                :max="9999999999999"
                style="width: 492px; margin-right: 10px"
              />
              <div>
                ${{ formData.quota ? quotaConv(formData.quota) : '0' }}</div
              >
            </a-form-item>
            <a-form-item v-if="formData.is_limit_quota">
              <a-radio-group
                type="button"
                @change="handleQuotaQuickChange as any"
              >
                <a-radio :value="1"> $1 </a-radio>
                <a-radio :value="5"> $5 </a-radio>
                <a-radio :value="10"> $10 </a-radio>
                <a-radio :value="20"> $20 </a-radio>
                <a-radio :value="50"> $50 </a-radio>
                <a-radio :value="100"> $100 </a-radio>
                <a-radio :value="200"> $200 </a-radio>
                <a-radio :value="500"> $500 </a-radio>
                <a-radio :value="1000"> $1000 </a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item
              v-if="formData.is_limit_quota"
              field="quota_expires_at"
              :label="$t('app.label.quota_expires_at')"
            >
              <a-date-picker
                v-model="formData.quota_expires_at"
                :placeholder="$t('app.placeholder.quota_expires_at')"
                :time-picker-props="{ defaultValue: '23:59:59' }"
                :disabled-date="
                  (current) =>
                    dayjs(current).isBefore(dayjs().subtract(1, 'day'))
                "
                style="width: 100%"
                show-time
                :shortcuts="[
                  {
                    label: '1',
                    value: () =>
                      dayjs(
                        formData.quota_expires_at ||
                          new Date().setHours(23, 59, 59, 999)
                      ).add(1, 'day'),
                  },
                  {
                    label: '7',
                    value: () =>
                      dayjs(
                        formData.quota_expires_at ||
                          new Date().setHours(23, 59, 59, 999)
                      ).add(7, 'day'),
                  },
                  {
                    label: '15',
                    value: () =>
                      dayjs(
                        formData.quota_expires_at ||
                          new Date().setHours(23, 59, 59, 999)
                      ).add(15, 'day'),
                  },
                  {
                    label: '30',
                    value: () =>
                      dayjs(
                        formData.quota_expires_at ||
                          new Date().setHours(23, 59, 59, 999)
                      ).add(30, 'day'),
                  },
                  {
                    label: '90',
                    value: () =>
                      dayjs(
                        formData.quota_expires_at ||
                          new Date().setHours(23, 59, 59, 999)
                      ).add(90, 'day'),
                  },
                  {
                    label: '180',
                    value: () =>
                      dayjs(
                        formData.quota_expires_at ||
                          new Date().setHours(23, 59, 59, 999)
                      ).add(180, 'day'),
                  },
                  {
                    label: '365',
                    value: () =>
                      dayjs(
                        formData.quota_expires_at ||
                          new Date().setHours(23, 59, 59, 999)
                      ).add(365, 'day'),
                  },
                ]"
              />
            </a-form-item>
            <a-form-item
              field="is_bind_group"
              :label="$t('app.label.is_bind_group')"
            >
              <a-switch v-model="formData.is_bind_group" />
            </a-form-item>
            <a-form-item
              v-if="formData.is_bind_group"
              field="group"
              :label="$t('app.label.group')"
              :rules="[
                {
                  required: true,
                  message: $t('app.error.group.required'),
                },
              ]"
            >
              <a-select
                v-model="formData.group"
                :placeholder="$t('app.placeholder.group')"
                :scrollbar="false"
                allow-search
                allow-clear
              >
                <a-option
                  v-for="item in groups"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </a-select>
            </a-form-item>
            <a-form-item
              field="ip_whitelist"
              :label="$t('app.label.ip_whitelist')"
            >
              <a-textarea
                v-model="formData.ip_whitelist"
                :placeholder="$t('app.placeholder.ip_whitelist')"
                :auto-size="{ minRows: 5, maxRows: 5 }"
              />
            </a-form-item>
            <a-form-item
              field="ip_blacklist"
              :label="$t('app.label.ip_blacklist')"
            >
              <a-textarea
                v-model="formData.ip_blacklist"
                :placeholder="$t('app.placeholder.ip_blacklist')"
                :auto-size="{ minRows: 5, maxRows: 5 }"
              />
            </a-form-item>
            <a-form-item
              field="remark"
              :label="$t('app.label.remark')"
              :rules="[
                {
                  required: false,
                },
              ]"
            >
              <a-textarea
                v-model="formData.remark"
                :placeholder="$t('app.placeholder.remark')"
              />
            </a-form-item>
            <a-space>
              <div class="submit-btn">
                <a-button
                  type="secondary"
                  @click="
                    $router.push({
                      name: 'AppList',
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
  import dayjs from 'dayjs';
  import { quotaConv } from '@/utils/common';
  import {
    submitAppUpdate,
    AppUpdate,
    queryAppDetail,
    AppDetailParams,
  } from '@/api/app';
  import { queryModelTree, Tree } from '@/api/model';
  import { queryGroupList, GroupList } from '@/api/group';

  const { loading, setLoading } = useLoading(false);
  const { proxy } = getCurrentInstance() as any;
  const route = useRoute();
  const router = useRouter();

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

  const groups = ref<GroupList[]>([]);
  const getGroupList = async () => {
    setLoading(true);
    try {
      const { data } = await queryGroupList();
      groups.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getGroupList();

  const formRef = ref<FormInstance>();
  const formData = ref<AppUpdate>({
    id: '',
    name: '',
    remark: '',
    status: 1,
    models: [],
    is_limit_quota: false,
    quota: ref(),
    quota_expires_at: '',
    is_bind_group: false,
    group: '',
    ip_whitelist: '',
    ip_blacklist: '',
  });

  const submitForm = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      setLoading(true);
      try {
        await submitAppUpdate(formData.value).then(() => {
          proxy.$message.success('更新成功');
          router.push({
            name: 'AppList',
          });
        });
      } catch (err) {
        // you can report use errorHandler or other
      } finally {
        setLoading(false);
      }
    }
  };

  const getAppDetail = async (
    params: AppDetailParams = { id: route.query.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryAppDetail(params);
      formData.value.id = data.id;
      formData.value.name = data.name;
      formData.value.remark = data.remark;
      formData.value.status = data.status;
      formData.value.models = data.models;
      formData.value.is_limit_quota = data.is_limit_quota;
      formData.value.quota = data.quota;
      formData.value.quota_expires_at = data.quota_expires_at;
      formData.value.is_bind_group = data.is_bind_group;
      formData.value.group = data.group;
      formData.value.ip_whitelist = data?.ip_whitelist?.join('\n') || '';
      formData.value.ip_blacklist = data?.ip_blacklist?.join('\n') || '';
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getAppDetail();

  const handleQuotaQuickChange = (quota: number) => {
    formData.value.quota = quota * 500000;
  };
</script>

<script lang="ts">
  export default {
    name: 'AppUpdate',
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
