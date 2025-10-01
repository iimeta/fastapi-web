<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-notification />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.notice') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{
        $t(route.query.action ? 'menu.notice.create' : 'menu.notice.update')
      }}</a-breadcrumb-item>
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
            :wrapper-col-props="{ span: 18 }"
          >
            <a-form-item :label="$t('notice.label.template')">
              <a-select
                v-model="formData.template"
                :placeholder="$t('notice.placeholder.template')"
                :scrollbar="false"
                allow-search
                @change="handleNoticeTemplateChange"
              >
                <a-option
                  v-for="item in noticeTemplates"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </a-select>
            </a-form-item>
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
            <a-form-item
              field="category"
              :label="$t('notice.label.category')"
              :rules="[
                {
                  required: true,
                  message: $t('notice.error.category.required'),
                },
              ]"
            >
              <a-select
                v-model="formData.category"
                :placeholder="$t('notice.placeholder.category')"
                :scrollbar="false"
                allow-search
              >
                <a-option value="service">
                  {{ $t('notice.dict.category.service') }}
                </a-option>
                <a-option value="activity">
                  {{ $t('notice.dict.category.activity') }}
                </a-option>
                <a-option value="safety">
                  {{ $t('notice.dict.category.safety') }}
                </a-option>
                <a-option value="maint">
                  {{ $t('notice.dict.category.maint') }}
                </a-option>
                <a-option value="product">
                  {{ $t('notice.dict.category.product') }}
                </a-option>
                <a-option value="fault">
                  {{ $t('notice.dict.category.fault') }}
                </a-option>
              </a-select>
            </a-form-item>
            <a-form-item
              field="scope"
              :label="$t('notice.label.scope')"
              :rules="[
                {
                  required: true,
                  message: $t('notice.error.scope.required'),
                },
              ]"
            >
              <a-space size="large">
                <a-radio v-model="formData.scope" value="1">
                  {{ $t('notice.dict.scope.1') }}
                </a-radio>
                <a-radio v-model="formData.scope" value="2">
                  {{ $t('notice.dict.scope.2') }}
                </a-radio>
                <a-radio v-model="formData.scope" value="3">
                  {{ $t('notice.dict.scope.3') }}
                </a-radio>
                <a-radio v-model="formData.scope" value="4">
                  {{ $t('notice.dict.scope.4') }}
                </a-radio>
                <a-radio v-model="formData.scope" value="5">
                  {{ $t('notice.dict.scope.5') }}
                </a-radio>
                <a-radio v-model="formData.scope" value="6">
                  {{ $t('notice.dict.scope.6') }}
                </a-radio>
              </a-space>
            </a-form-item>
            <a-form-item
              v-if="formData.scope === '4' || formData.scope === '6'"
              field="users"
              :label="$t('notice.label.users')"
              :rules="[
                {
                  required: true,
                  message: $t('notice.error.users.required'),
                },
              ]"
            >
              <a-select
                v-model="formData.users"
                :placeholder="$t('notice.placeholder.users')"
                :scrollbar="false"
                multiple
                allow-search
                allow-clear
              >
                <a-option
                  v-for="item in users"
                  :key="item.user_id"
                  :value="item.user_id"
                  :label="item.name"
                />
              </a-select>
            </a-form-item>
            <a-form-item
              v-if="formData.scope === '5' || formData.scope === '6'"
              field="resellers"
              :label="$t('notice.label.resellers')"
              :rules="[
                {
                  required: true,
                  message: $t('notice.error.resellers.required'),
                },
              ]"
            >
              <a-select
                v-model="formData.resellers"
                :placeholder="$t('notice.placeholder.resellers')"
                :scrollbar="false"
                multiple
                allow-search
                allow-clear
              >
                <a-option
                  v-for="item in resellers"
                  :key="item.user_id"
                  :value="item.user_id"
                  :label="item.name"
                />
              </a-select>
            </a-form-item>
            <!-- <a-form-item
              field="channels"
              :label="$t('notice.label.channels')"
              :rules="[
                {
                  required: true,
                  message: $t('notice.error.channels.required'),
                },
              ]"
            >
              <a-space size="large">
                <a-checkbox
                  v-model="formData.channels"
                  value="web"
                  :default-checked="true"
                >
                  {{ $t('notice.dict.channels.web') }}
                </a-checkbox>
                <a-checkbox v-model="formData.channels" value="email">
                  {{ $t('notice.dict.channels.email') }}
                </a-checkbox>
              </a-space>
            </a-form-item>
            <a-form-item
              v-if="formData.channels.includes('web')"
              field="is_popup"
              :label="$t('notice.label.is_popup')"
            >
              <a-switch v-model="formData.is_popup" />
            </a-form-item>
            <a-form-item field="priority" :label="$t('notice.label.priority')">
              <a-input-number
                v-model="formData.priority"
                :placeholder="$t('notice.placeholder.priority')"
                :precision="0"
                :min="-999"
                :max="99999"
              />
            </a-form-item>
            <a-form-item
              field="expires_at"
              :label="$t('notice.label.expires_at')"
            >
              <a-date-picker
                v-model="formData.expires_at"
                :placeholder="$t('notice.placeholder.expires_at')"
                :time-picker-props="{ defaultValue: '23:59:59' }"
                :disabled-date="
                  disabledDate
                "
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
            <a-form-item
              field="scheduled_time"
              :label="$t('notice.label.scheduled_time')"
            >
              <a-date-picker
                v-model="formData.scheduled_time"
                :placeholder="$t('notice.placeholder.scheduled_time')"
                :disabled-date="
                  disabledDate
                "
                style="width: 100%"
                show-time
              />
            </a-form-item> -->
            <a-form-item
              field="content"
              :label="$t('notice.label.content')"
              :rules="[
                {
                  required: true,
                  message: $t('notice.error.content.required'),
                },
              ]"
            >
              <Vditor v-model="formData.content" style="flex: 1" />
            </a-form-item>
            <a-form-item field="remark" :label="$t('notice.label.remark')">
              <a-textarea
                v-model="formData.remark"
                :placeholder="$t('notice.placeholder.remark')"
              />
            </a-form-item>
            <a-space>
              <div class="submit-btn">
                <a-button type="secondary" @click="submitForm(2)">
                  {{ $t('button.draft') }}
                </a-button>
                <a-button
                  v-if="!formData.scheduled_time"
                  type="primary"
                  @click="submitForm(1)"
                >
                  {{ $t('button.publish') }}
                </a-button>
                <a-button
                  v-if="formData.scheduled_time"
                  type="primary"
                  @click="submitForm(3)"
                >
                  {{ $t('button.scheduled') }}
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
  import { useRouter, useRoute } from 'vue-router';
  import { FormInstance } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import dayjs from 'dayjs';
  import {
    submitNoticeCreate,
    submitNoticeUpdate,
    Notice,
    queryNoticeDetail,
    NoticeDetailParams,
  } from '@/api/notice';
  import {
    queryNoticeTemplateList,
    NoticeTemplateList,
  } from '@/api/notice_template';
  import { UserList, queryUserList } from '@/api/admin_user';
  import { ResellerList, queryResellerList } from '@/api/admin_reseller';
  import Vditor from '@/views/common/vditor.vue';

  const { proxy } = getCurrentInstance() as any;
  const { loading, setLoading } = useLoading(false);

  const router = useRouter();
  const route = useRoute();
  const formRef = ref<FormInstance>();
  const formData = ref<Notice>({
    id: '',
    title: '',
    content: '',
    category: '',
    scope: ref(),
    users: [],
    resellers: [],
    channels: [],
    is_popup: false,
    priority: ref(),
    expires_at: '',
    scheduled_time: '',
    remark: '',
    status: 1,
  });

  const noticeTemplates = ref<NoticeTemplateList[]>([]);
  const noticeTemplateMap = new Map();
  const getNoticeTemplateList = async () => {
    setLoading(true);
    try {
      const { data } = await queryNoticeTemplateList({ scenes: ['notice'] });
      noticeTemplates.value = data.items;
      for (let i = 0; i < noticeTemplates.value.length; i += 1) {
        noticeTemplateMap.set(
          noticeTemplates.value[i].id,
          noticeTemplates.value[i]
        );
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getNoticeTemplateList();

  const handleNoticeTemplateChange = () => {
    const noticeTemplate = noticeTemplateMap.get(formData.value.template);
    if (noticeTemplate) {
      formData.value.title = noticeTemplate.title;
      formData.value.content = noticeTemplate.content;
      formData.value.channels = noticeTemplate.channels;
    }
  };

  const users = ref<UserList[]>([]);

  const getUserList = async () => {
    setLoading(true);
    try {
      const { data } = await queryUserList();
      users.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getUserList();

  const resellers = ref<ResellerList[]>([]);

  const getResellerList = async () => {
    setLoading(true);
    try {
      const { data } = await queryResellerList();
      resellers.value = data.items;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getResellerList();

  const getNoticeDetail = async (
    params: NoticeDetailParams = { id: route.query.id }
  ) => {
    setLoading(true);
    try {
      const { data } = await queryNoticeDetail(params);
      formData.value.id = data.id;
      formData.value.title = data.title;
      formData.value.content = data.content;
      formData.value.category = data.category;
      formData.value.scope = String(data.scope);
      formData.value.users = data.users;
      formData.value.resellers = data.resellers;
      formData.value.channels = data.channels;
      formData.value.is_popup = data.is_popup;
      formData.value.priority = data.priority;
      formData.value.expires_at = data.expires_at;
      formData.value.scheduled_time = data.scheduled_time;
      formData.value.remark = data.remark;
      formData.value.status = data.status;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  getNoticeDetail();

  const submitForm = async (status: number) => {
    const res = await formRef.value?.validate();
    if (!res) {
      setLoading(true);
      try {
        formData.value.status = status;
        if (route.query.action) {
          await submitNoticeCreate(formData.value).then(() => {
            let alertContent = '操作成功';
            if (status === 1) {
              alertContent = '发布成功';
            } else if (status === 2) {
              alertContent = '保存成功';
            }
            proxy.$message.success(alertContent);
            router.push({
              name: 'NoticeList',
            });
          });
        } else {
          await submitNoticeUpdate(formData.value).then(() => {
            let alertContent = '更新成功';
            if (status === 1) {
              alertContent = '发布成功';
            } else if (status === 2) {
              alertContent = '保存成功';
            }
            proxy.$message.success(alertContent);
            router.push({
              name: 'NoticeList',
            });
          });
        }
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
    name: 'NoticeUpdate',
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
        width: 100%;
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
