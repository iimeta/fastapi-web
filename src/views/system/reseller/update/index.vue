<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-settings />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.sys') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.reseller.update') }}</a-breadcrumb-item>
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
            :label-col-props="{ span: 4 }"
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
                  match: /^.{6,}$/,
                  message: $t('reseller.error.password.pattern'),
                },
              ]"
            >
              <a-input
                v-model="formData.password"
                :placeholder="$t('reseller.update.placeholder.password')"
                allow-clear
              />
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
                :placeholder="$t('reseller.placeholder.groups')"
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
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import dayjs from 'dayjs';
  import { FormInstance, Message } from '@arco-design/web-vue';
  import { useRouter, useRoute } from 'vue-router';
  import { disabledDate } from '@/utils/common';
  import {
    submitResellerUpdate,
    ResellerUpdate,
    ResellerDetailParams,
    queryResellerDetail,
  } from '@/api/admin_reseller';
  import { queryGroupList, GroupList } from '@/api/group';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(false);
  const route = useRoute();
  const router = useRouter();

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
  const formData = ref<ResellerUpdate>({
    id: '',
    name: '',
    email: '',
    account: '',
    password: '',
    quota_expires_at: '',
    groups: [],
    remark: '',
    status: 1,
  });

  const getResellerDetail = async (
    params: ResellerDetailParams = { id: route.query.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryResellerDetail(params);
      formData.value.id = data.id;
      formData.value.name = data.name;
      formData.value.email = data.email;
      formData.value.account = data.account;
      formData.value.quota_expires_at = data.quota_expires_at;
      formData.value.groups = data.groups;
      formData.value.remark = data.remark;
      formData.value.status = data.status;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getResellerDetail();

  const submitForm = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      setLoading(true);
      try {
        await submitResellerUpdate(formData.value).then(() => {
          Message.success(t('success.update'));
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
</script>

<script lang="ts">
  export default {
    name: 'ResellerUpdate',
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
        width: 888px;
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
