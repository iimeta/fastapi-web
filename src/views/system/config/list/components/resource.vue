<template>
  <div class="list-wrap config-list-wrap">
    <a-row class="list-row" :gutter="24">
      <a-col
        v-for="item in sysConfigItems"
        :key="item.action"
        :xs="12"
        :sm="12"
        :md="12"
        :lg="8"
        :xl="8"
        :xxl="6"
        class="list-col"
      >
        <div class="card-wrap">
          <a-card
            :title="item.title"
            :bordered="false"
            :header-style="configCardHeaderStyle"
            :body-style="configCardBodyStyle"
          >
            <template #extra>
              <a-switch
                v-if="item.open !== undefined"
                v-model="item.open"
                @change="sysConfigChangeStatus(item)"
              />
            </template>
            <a-card-meta>
              <template #description>
                {{ item.desc }}
                <a-descriptions
                  :data="item.data"
                  layout="inline-horizontal"
                  :column="2"
                />
              </template>
            </a-card-meta>
            <template #actions>
              <a-button v-if="item.reset" @click="resetHandle(item)">
                {{ $t('button.reset') }}
              </a-button>
              <a-button
                v-if="item.config"
                type="primary"
                @click="configHandle(item)"
              >
                {{ $t('button.config') }}
              </a-button>
            </template>
            <template #skeleton>
              <a-skeleton :animation="true">
                <a-skeleton-line
                  :widths="['50%', '50%', '100%', '40%']"
                  :rows="4"
                />
                <a-skeleton-line :widths="['40%']" :rows="1" />
              </a-skeleton>
            </template>
          </a-card>
        </div>
      </a-col>
    </a-row>

    <a-modal
      v-model:visible="configVisible"
      :title="$t(configTitle)"
      :width="828"
      :body-style="configModalBodyStyle"
      @cancel="handleCancel"
      @before-ok="handleBeforeOk"
    >
      <a-form ref="configForm" :model="configFormData" auto-label-width>
        <a-form-item
          v-for="(item, index) of configFormData.image_url.urls"
          v-show="configFormData.action === 'image_url'"
          :key="index"
          :field="
            `image_url.urls[${index}].replace_url` &&
            `image_url.urls[${index}].target_url`
          "
          :label="`${index + 1}. `"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.required.image_url'),
            },
          ]"
          :label-col-style="fieldLabelColStyle"
        >
          <a-input
            v-model="configFormData.image_url.urls[index].replace_url"
            :placeholder="$t('sys.config.placeholder.image_url.replace_url')"
            allow-clear
            class="field-input field-input-replace-url"
          />
          <a-input
            v-model="configFormData.image_url.urls[index].target_url"
            :placeholder="$t('sys.config.placeholder.image_url.target_url')"
            allow-clear
            class="field-input field-input-target-url"
          />
          <a-button
            type="primary"
            shape="circle"
            class="field-action-button"
            @click="handleImageUrlAdd()"
          >
            <icon-plus />
          </a-button>
          <a-button
            type="secondary"
            shape="circle"
            @click="handleImageUrlDel(index)"
          >
            <icon-minus />
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import useLoading from '@/hooks/loading';
  import { FormInstance, Message, Modal } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import {
    SysConfigItem,
    SysConfigUpdate,
    submitSysConfigUpdate,
    submitSysConfigReset,
    submitSysConfigChangeStatus,
    ImageUrlItem,
  } from '@/api/sys_config';
  import { useSysConfig } from '../composables/use-sys-config';

  const { setLoading } = useLoading(true);
  const { t } = useI18n();
  const { data: sysConfigData, refresh: refreshSysConfig } = useSysConfig();

  const configCardHeaderStyle = {
    padding: '16px',
  };
  const configCardBodyStyle = {
    padding: '0px 16px',
  };
  const configModalBodyStyle = {
    padding: '20px 20px 0 20px',
    maxHeight: '520px',
  };
  const fieldLabelColStyle = {
    padding: '0 16px 2px 0',
  };

  const configVisible = ref(false);
  const configTitle = ref('');
  const configForm = ref<FormInstance>();
  const configFormData = ref<SysConfigUpdate>({
    image_url: {},
  } as SysConfigUpdate);

  const configHandle = async (sysConfigItem: SysConfigItem) => {
    if (
      sysConfigItem.action === 'image_url' &&
      (!configFormData.value.image_url.urls ||
        configFormData.value.image_url.urls.length === 0)
    ) {
      handleImageUrlAdd();
    }
    configTitle.value = t(`sys.config.item.title.${sysConfigItem.action}`);
    configFormData.value.action = sysConfigItem.action;
    configVisible.value = true;
  };

  const resetHandle = async (sysConfigItem: SysConfigItem) => {
    Modal.warning({
      title: t('modal.warning.title'),
      titleAlign: 'center',
      content: `${t('sys.config.placeholder.are_you_sure')}${t(
        'button.reset'
      )}${t(`sys.config.item.title.${sysConfigItem.action}`)}?`,
      okText: t('button.ok'),
      cancelText: t('button.cancel'),
      hideCancel: false,
      onOk: () => {
        sysConfigReset(sysConfigItem);
      },
    });
  };

  const handleBeforeOk = async (done: any) => {
    const res = await configForm.value?.validate();
    if (res) {
      configVisible.value = true;
      done(false);
      return;
    }

    setLoading(true);
    try {
      await submitSysConfigUpdate(configFormData.value);
      done();
      Message.success(t('success.operate'));
      refreshSysConfig();
    } catch (err) {
      done(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    configVisible.value = false;
    if (
      configFormData.value.image_url.urls.length > 0 &&
      !configFormData.value.image_url.urls[
        configFormData.value.image_url.urls.length - 1
      ].replace_url
    ) {
      handleImageUrlDel(configFormData.value.image_url.urls.length - 1);
    }
  };

  const sysConfigReset = async (sysConfigItem: SysConfigItem) => {
    setLoading(true);
    try {
      await submitSysConfigReset({
        action: sysConfigItem.action,
      });
      Message.success(t('success.operate'));
      refreshSysConfig();
    } finally {
      setLoading(false);
    }
  };

  const sysConfigChangeStatus = async (sysConfigItem: SysConfigItem) => {
    setLoading(true);
    try {
      await submitSysConfigChangeStatus({
        action: sysConfigItem.action,
        open: sysConfigItem.open || false,
      });
      Message.success(t('success.operate'));
      refreshSysConfig();
    } finally {
      setLoading(false);
    }
  };

  const sysConfigItems = ref<SysConfigItem[]>({} as SysConfigItem[]);

  watch(
    sysConfigData,
    (data) => {
      if (!data) return;
      configFormData.value.image_url = data.image_url;
      sysConfigItems.value = [
        {
          action: 'image_url',
          title: t('sys.config.item.title.image_url'),
          desc: t('sys.config.item.desc.image_url'),
          open: configFormData.value.image_url.open,
          config: true,
          reset: true,
        },
      ];
    },
    { immediate: true }
  );

  const handleImageUrlAdd = () => {
    configFormData.value.image_url.urls.push({
      replace_url: '',
      target_url: '',
    } as ImageUrlItem);
  };

  const handleImageUrlDel = (index: number) => {
    configFormData.value.image_url.urls.splice(index, 1);
  };
</script>

<script lang="ts">
  export default {
    name: 'Resource',
  };
</script>

<style scoped lang="less">
  @import '../style/config-card-shared.less';

  .config-list-wrap {
    margin-top: 10px;
  }

  .field-input {
    margin-right: 5px;
  }

  .field-input-replace-url {
    width: 44%;
  }

  .field-input-target-url {
    width: 44%;
  }

  .field-action-button {
    margin-right: 5px;
  }
</style>
