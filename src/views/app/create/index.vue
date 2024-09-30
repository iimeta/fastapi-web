<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <icon-apps />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.app') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('menu.app.create') }}</a-breadcrumb-item>
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
              $t('model.title.baseInfo')
            }}</a-divider> -->
            <a-form-item
              v-permission="['admin']"
              field="user_id"
              :label="$t('app.label.user_id')"
              :rules="[
                {
                  required: userStore.role === 'admin',
                  message: $t('app.error.user_id.required'),
                },
              ]"
            >
              <a-input-number
                v-model="formData.user_id"
                :placeholder="$t('app.placeholder.user_id')"
                :min="1"
              />
            </a-form-item>
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
              $t('model.title.advanced')
            }}</a-divider> -->
            <a-form-item field="models" :label="$t('app.label.models')">
              <a-select
                v-model="formData.models"
                :placeholder="$t('app.placeholder.models')"
                :max-tag-count="3"
                multiple
                allow-search
                allow-clear
              >
                <a-option
                  v-for="item in models"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </a-select>
              <a-button
                :style="{ backgroundColor: buttonColor }"
                @click="toggleSelectAll"
                >✅</a-button
              >
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
                :disabled-date="(current:Date) => dayjs(current).isBefore(dayjs())"
                style="width: 100%"
                show-time
                :shortcuts="[
                  {
                    label: '1',
                    value: () => dayjs().add(1, 'day'),
                  },
                  {
                    label: '7',
                    value: () => dayjs().add(7, 'day'),
                  },
                  {
                    label: '15',
                    value: () => dayjs().add(15, 'day'),
                  },
                  {
                    label: '30',
                    value: () => dayjs().add(30, 'day'),
                  },
                  {
                    label: '90',
                    value: () => dayjs().add(90, 'day'),
                  },
                  {
                    label: '180',
                    value: () => dayjs().add(180, 'day'),
                  },
                  {
                    label: '365',
                    value: () => dayjs().add(365, 'day'),
                  },
                ]"
              />
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
              field="is_create_key"
              :label="$t('app.label.is_create_key')"
            >
              <a-switch v-model="formData.is_create_key" />
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
  import { useRouter } from 'vue-router';
  import dayjs from 'dayjs';
  import { Message } from '@arco-design/web-vue';
  import { quotaConv } from '@/utils/common';
  import { submitAppCreate, AppCreate } from '@/api/app';
  import { queryModelList, ModelList } from '@/api/model';
  import { useUserStore } from '@/store';

  const { loading, setLoading } = useLoading(false);
  const { proxy } = getCurrentInstance() as any;
  const router = useRouter();
  const userStore = useUserStore();

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

  const formRef = ref<FormInstance>();
  const formData = ref<AppCreate>({
    user_id: ref(),
    name: '',
    models: [],
    is_limit_quota: false,
    quota: ref(),
    quota_expires_at: '',
    ip_whitelist: '',
    ip_blacklist: '',
    is_create_key: true,
    remark: '',
  });

  const submitForm = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      setLoading(true);
      try {
        const { data } = await submitAppCreate(formData.value);
        if (data.key) {
          navigator.clipboard.writeText(data.key);
          Message.success('新建成功, 密钥已复制到剪贴板');
        } else {
          proxy.$message.success('新建成功');
        }
        router.push({
          name: 'AppList',
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
  const buttonColor = ref('');
  const isSelectAll = ref(false); // 维护全选状态
  const toggleSelectAll = () => {
    if (isSelectAll.value) {
      formData.value.models = []; // 取消全选
    } else {
      formData.value.models = models.value.map((item) => item.id); // 全选
    }
    isSelectAll.value = !isSelectAll.value; // 切换全选状态
    // 更新全选选项的背景颜色
    buttonColor.value = isSelectAll.value ? 'blue' : '';
  };
</script>

<script lang="ts">
  export default {
    name: 'AppCreate',
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
