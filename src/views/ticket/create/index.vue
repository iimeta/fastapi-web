<template>
  <div class="container">
    <a-breadcrumb class="container-breadcrumb">
      <a-breadcrumb-item>
        <lucide-headset />
      </a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('ticket.menu') }}</a-breadcrumb-item>
      <a-breadcrumb-item>{{ $t('ticket.menu.create') }}</a-breadcrumb-item>
    </a-breadcrumb>
    <a-spin :loading="loading" style="width: 100%">
      <a-card
        class="general-card"
        :body-style="cardBodyStyle"
        :bordered="false"
      >
        <div class="wrapper">
          <a-form
            ref="formRef"
            :model="formData"
            class="form"
            :label-col-props="{ span: 3 }"
            :wrapper-col-props="{ span: 20 }"
          >
            <a-form-item
              field="title"
              :label="$t('ticket.label.title')"
              :rules="[
                {
                  required: true,
                  message: $t('ticket.placeholder.title'),
                },
              ]"
            >
              <a-input
                v-model="formData.title"
                :placeholder="$t('ticket.placeholder.title')"
                allow-clear
              />
            </a-form-item>
            <a-form-item
              field="category"
              :label="$t('ticket.label.category')"
              :rules="[
                {
                  required: true,
                  message: $t('ticket.placeholder.category'),
                },
              ]"
            >
              <a-select
                v-model="formData.category"
                :placeholder="$t('ticket.placeholder.category')"
                :scrollbar="false"
              >
                <a-option value="account">{{
                  $t('ticket.dict.category.account')
                }}</a-option>
                <a-option value="billing">{{
                  $t('ticket.dict.category.billing')
                }}</a-option>
                <a-option value="technical">{{
                  $t('ticket.dict.category.technical')
                }}</a-option>
                <a-option value="feature">{{
                  $t('ticket.dict.category.feature')
                }}</a-option>
                <a-option value="other">{{
                  $t('ticket.dict.category.other')
                }}</a-option>
              </a-select>
            </a-form-item>
            <a-form-item
              field="priority"
              :label="$t('ticket.label.priority')"
              :rules="[
                {
                  required: true,
                },
              ]"
            >
              <a-radio-group v-model="formData.priority">
                <a-radio :value="1">{{ $t('ticket.dict.priority.1') }}</a-radio>
                <a-radio :value="2">{{ $t('ticket.dict.priority.2') }}</a-radio>
                <a-radio :value="3">{{ $t('ticket.dict.priority.3') }}</a-radio>
                <a-radio :value="4">{{ $t('ticket.dict.priority.4') }}</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item
              field="content"
              :label="$t('ticket.label.content')"
              :rules="[
                {
                  required: true,
                  message: $t('ticket.placeholder.content'),
                },
              ]"
            >
              <Vditor
                ref="contentEditorRef"
                v-model="formData.content"
                :show-variables="false"
                style="width: 100%"
              />
            </a-form-item>
            <a-space>
              <div class="submit-btn">
                <a-button
                  type="secondary"
                  @click="$router.push({ name: 'TicketMyList' })"
                >
                  {{ $t('button.cancel') }}
                </a-button>
                <a-button
                  type="primary"
                  :loading="loading"
                  @click="handleSubmit"
                >
                  {{ $t('ticket.button.create') }}
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
  import { ref, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import { Message, FormInstance } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import { submitTicketCreate } from '@/api/ticket';
  import Vditor from '@/views/common/vditor.vue';

  const { t } = useI18n();
  const router = useRouter();
  const { loading, setLoading } = useLoading(false);
  const formRef = ref<FormInstance>();
  const contentEditorRef = ref<{ getValue: () => string }>();
  const cardBodyStyle = {
    padding: '0 20px 20px 20px',
  };

  const formData = reactive({
    title: '',
    category: '',
    priority: 2,
    content: '',
  });

  const handleSubmit = async () => {
    // Sync Vditor content before validation (input callback may be debounced)
    if (contentEditorRef.value) {
      formData.content = contentEditorRef.value.getValue();
    }

    const errors = await formRef.value?.validate();
    if (errors) return;

    setLoading(true);
    try {
      await submitTicketCreate(formData);
      Message.success(t('ticket.message.create.success'));
      router.push({ name: 'TicketMyList' });
    } finally {
      setLoading(false);
    }
  };
</script>

<script lang="ts">
  export default {
    name: 'TicketCreate',
  };
</script>

<style scoped lang="less">
  @import '@/assets/style/page-form.less';

  .general-card {
    &:first-child {
      padding-top: 61px;
    }
  }
</style>
