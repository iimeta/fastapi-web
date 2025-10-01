<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-settings />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.sys') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.reseller.create') }}</a-breadcrumb-item>
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
              :label="$t('reseller.label.name')"
              :rules="[
                {
                  required: true,
                  message: $t('reseller.error.name.required'),
                },
                {
                  match: /^.{1,30}$/,
                  message: $t('reseller.error.name.pattern'),
                },
              ]"
            >
              <a-input
                v-model="formData.name"
                :placeholder="$t('reseller.placeholder.name')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="email"
              :label="$t('reseller.label.email')"
              :rules="[
                {
                  required: true,
                  message: $t('reseller.error.email.required'),
                },
              ]"
            >
              <a-input
                v-model="formData.email"
                :placeholder="$t('reseller.placeholder.email')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="account"
              :label="$t('reseller.label.account')"
              :rules="[
                {
                  required: true,
                  message: $t('reseller.error.account.required'),
                },
              ]"
            >
              <a-input
                v-model="formData.account"
                :placeholder="$t('reseller.placeholder.account')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="password"
              :label="$t('reseller.label.password')"
              :rules="[
                {
                  required: true,
                  message: $t('reseller.error.password.required'),
                },
                {
                  match: /^.{6,}$/,
                  message: $t('reseller.error.password.pattern'),
                },
              ]"
            >
              <a-input
                v-model="formData.password"
                :placeholder="$t('reseller.placeholder.password')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="quota"
              :label="$t('reseller.label.quota')"
              :rules="[
                {
                  required: true,
                  message: $t('reseller.error.quota.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.quota"
                :placeholder="$t('reseller.placeholder.quota')"
                :precision="0"
                :min="1"
                :max="9999999999999"
              />
              <div style="margin-left: 10px">
                ${{ formData.quota ? quotaConv(formData.quota) : '0' }}</div
              >
            </a-form-item>
            <a-form-item>
              <a-radio-group
                type="button"
                @change="handleQuotaQuickChange as any"
              >
                <a-radio :value="1"> $1 </a-radio>
                <a-radio :value="2"> $2 </a-radio>
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
              field="quota_type"
              :label="$t('reseller.label.quota_type')"
              :rules="[
                {
                  required: true,
                  message: $t('reseller.error.quota_type.required'),
                },
              ]"
            >
              <a-space size="large">
                <a-radio
                  v-model="formData.quota_type"
                  value="1"
                  :default-checked="true"
                >
                  充值
                </a-radio>
                <a-radio v-model="formData.quota_type" value="3">
                  赠送
                </a-radio>
              </a-space>
            </a-form-item>
            <a-form-item
              field="quota_expires_at"
              :label="$t('reseller.label.quota_expires_at')"
            >
              <a-date-picker
                v-model="formData.quota_expires_at"
                :placeholder="$t('reseller.placeholder.quota_expires_at')"
                :time-picker-props="{ defaultValue: '23:59:59' }"
                :disabled-date="disabledDate"
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
              field="groups"
              :label="$t('reseller.label.groups')"
              style="align-items: center"
            >
              <a-select
                v-model="formData.groups"
                :placeholder="$t('reseller.placeholder.create.groups')"
                :scrollbar="false"
                multiple
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
            <a-form-item field="models" :label="$t('reseller.label.models')">
              <a-tree-select
                v-model="formData.models"
                :placeholder="$t('reseller.placeholder.create.models')"
                :allow-search="true"
                :allow-clear="true"
                :tree-checkable="true"
                :data="treeData"
                :max-tag-count="3"
                :scrollbar="false"
                tree-checked-strategy="child"
              />
            </a-form-item>
            <a-form-item field="remark" :label="$t('reseller.label.remark')">
              <a-textarea
                v-model="formData.remark"
                :placeholder="$t('reseller.placeholder.remark')"
              />
            </a-form-item>
            <a-space>
              <div class="submit-btn">
                <a-button
                  type="secondary"
                  @click="
                    $router.push({
                      name: 'ResellerList',
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
  import { useRouter } from 'vue-router';
  import { quotaConv, disabledDate } from '@/utils/common';
  import { submitResellerCreate, ResellerCreate } from '@/api/admin_reseller';
  import { queryModelTree, Tree } from '@/api/model';
  import { queryGroupList, GroupList } from '@/api/group';

  const { proxy } = getCurrentInstance() as any;
  const { loading, setLoading } = useLoading(false);
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
    try {
      const { data } = await queryGroupList();
      groups.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    }
  };
  getGroupList();

  const formRef = ref<FormInstance>();
  const formData = ref<ResellerCreate>({
    name: '',
    email: '',
    account: '',
    password: '',
    quota: ref(),
    quota_type: '1',
    quota_expires_at: '',
    models: [],
    groups: [],
    remark: '',
  });

  const submitForm = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      setLoading(true);
      try {
        await submitResellerCreate(formData.value).then(() => {
          proxy.$message.success('新建成功');
          router.push({
            name: 'ResellerList',
          });
        });
      } catch (err) {
        // you can report use errorHandler or other
      } finally {
        setLoading(false);
      }
    }
  };
  const handleQuotaQuickChange = (quota: number) => {
    formData.value.quota = quota * 500000;
  };
</script>

<script lang="ts">
  export default {
    name: 'ResellerCreate',
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
