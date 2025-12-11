<template>
  <div class="list-wrap" style="margin-top: 10px">
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
            :header-style="{ padding: '16px' }"
            :body-style="{
              padding: '0px 16px',
            }"
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
      :width="568"
      :body-style="{
        padding: '20px 20px 0 20px',
        maxHeight: '520px',
      }"
      @cancel="handleCancel"
      @before-ok="handleBeforeOk"
    >
      <a-form ref="configForm" :model="configFormData" auto-label-width>
        <a-form-item
          v-if="configFormData.action === 'quota_task'"
          field="quota_task.cron"
          :label="$t('sys.config.label.quota_task.cron')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.quota_task.cron.required'),
            },
          ]"
        >
          <a-input
            v-model="configFormData.quota_task.cron"
            :placeholder="$t('sys.config.placeholder.quota_task.cron')"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'quota_task'"
          field="quota_task.lock_minutes"
          :label="$t('sys.config.label.quota_task.lock_minutes')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.quota_task.lock_minutes.required'),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.quota_task.lock_minutes"
            :placeholder="$t('sys.config.placeholder.quota_task.lock_minutes')"
            :precision="0"
            :min="1"
            allow-clear
          >
            <template #append> 分钟 </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'statistics'"
          field="statistics.cron"
          :label="$t('sys.config.label.statistics.cron')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.statistics.cron.required'),
            },
          ]"
        >
          <a-input
            v-model="configFormData.statistics.cron"
            :placeholder="$t('sys.config.placeholder.statistics.cron')"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'statistics'"
          field="statistics.limit"
          :label="$t('sys.config.label.statistics.limit')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.statistics.limit.required'),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.statistics.limit"
            :placeholder="$t('sys.config.placeholder.statistics.limit')"
            :min="10"
            allow-clear
          >
            <template #append> 条 </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'statistics'"
          field="statistics.lock_minutes"
          :label="$t('sys.config.label.statistics.lock_minutes')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.statistics.lock_minutes.required'),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.statistics.lock_minutes"
            :placeholder="$t('sys.config.placeholder.statistics.lock_minutes')"
            :precision="0"
            :min="1"
            allow-clear
          >
            <template #append> 分钟 </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'video_task'"
          field="video_task.cron"
          :label="$t('sys.config.label.video_task.cron')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.video_task.cron.required'),
            },
          ]"
        >
          <a-input
            v-model="configFormData.video_task.cron"
            :placeholder="$t('sys.config.placeholder.video_task.cron')"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'video_task'"
          field="video_task.lock_minutes"
          :label="$t('sys.config.label.video_task.lock_minutes')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.video_task.lock_minutes.required'),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.video_task.lock_minutes"
            :placeholder="$t('sys.config.placeholder.video_task.lock_minutes')"
            :precision="0"
            :min="1"
            allow-clear
          >
            <template #append> 分钟 </template>
          </a-input-number>
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'video_task'"
          field="video_task.is_enable_storage"
          :label="$t('sys.config.label.video_task.is_enable_storage')"
        >
          <a-switch v-model="configFormData.video_task.is_enable_storage" />
        </a-form-item>
        <a-form-item
          v-if="
            configFormData.action === 'video_task' &&
            configFormData.video_task.is_enable_storage
          "
          field="video_task.storage_dir"
          :label="$t('sys.config.label.video_task.storage_dir')"
        >
          <a-input
            v-model="configFormData.video_task.storage_dir"
            :placeholder="$t('sys.config.placeholder.video_task.storage_dir')"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          v-if="
            configFormData.action === 'video_task' &&
            configFormData.video_task.is_enable_storage
          "
          field="video_task.storage_base_url"
          :label="$t('sys.config.label.video_task.storage_base_url')"
        >
          <a-input
            v-model="configFormData.video_task.storage_base_url"
            :placeholder="
              $t('sys.config.placeholder.video_task.storage_base_url')
            "
            allow-clear
          />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'notice'"
          field="notice.cron"
          :label="$t('sys.config.label.notice.cron')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.notice.cron.required'),
            },
          ]"
        >
          <a-input
            v-model="configFormData.notice.cron"
            :placeholder="$t('sys.config.placeholder.notice.cron')"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          v-if="configFormData.action === 'notice'"
          field="notice.lock_minutes"
          :label="$t('sys.config.label.notice.lock_minutes')"
          :rules="[
            {
              required: true,
              message: $t('sys.config.error.notice.lock_minutes.required'),
            },
          ]"
        >
          <a-input-number
            v-model="configFormData.notice.lock_minutes"
            :placeholder="$t('sys.config.placeholder.notice.lock_minutes')"
            :precision="0"
            :min="1"
            allow-clear
          >
            <template #append> 分钟 </template>
          </a-input-number>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, getCurrentInstance } from 'vue';
  import useLoading from '@/hooks/loading';
  import { FormInstance } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import {
    SysConfigItem,
    querySysConfigDetail,
    SysConfigUpdate,
    submitSysConfigUpdate,
    submitSysConfigReset,
    submitSysConfigChangeStatus,
  } from '@/api/sys_config';

  const { proxy } = getCurrentInstance() as any;
  const { setLoading } = useLoading(true);
  const { t } = useI18n();

  const configVisible = ref(false);
  const configTitle = ref('');
  const configForm = ref<FormInstance>();
  const configFormData = ref<SysConfigUpdate>({
    statistics: {},
    notice: {},
    quota_task: {},
  } as SysConfigUpdate);

  const configHandle = async (sysConfigItem: SysConfigItem) => {
    configTitle.value = t(`sys.config.item.title.${sysConfigItem.action}`);
    configFormData.value.action = sysConfigItem.action;
    configVisible.value = true;
  };

  const resetHandle = async (sysConfigItem: SysConfigItem) => {
    proxy.$modal.warning({
      title: '警告',
      titleAlign: 'center',
      content: `是否确定重置${t(
        `sys.config.item.title.${sysConfigItem.action}`
      )}?`,
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
      proxy.$message.success('操作成功');
      getSysConfigDetail();
    } catch (err) {
      done(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    configVisible.value = false;
  };

  const sysConfigReset = async (sysConfigItem: SysConfigItem) => {
    setLoading(true);
    try {
      await submitSysConfigReset({
        action: sysConfigItem.action,
      });
      proxy.$message.success('操作成功');
      getSysConfigDetail();
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
      proxy.$message.success('操作成功');
      getSysConfigDetail();
    } finally {
      setLoading(false);
    }
  };

  const sysConfigItems = ref<SysConfigItem[]>({} as SysConfigItem[]);

  const getSysConfigDetail = async () => {
    const { data } = await querySysConfigDetail();
    configFormData.value.quota_task = data.quota_task;
    configFormData.value.statistics = data.statistics;
    configFormData.value.video_task = data.video_task;
    configFormData.value.notice = data.notice;
    sysConfigItems.value = [
      {
        action: 'quota_task',
        title: t('sys.config.item.title.quota_task'),
        desc: '定时检查各类额度配置以及发送相关通知, 单次任务超时时间可根据实际情况配置, 建议不要低于10分钟',
        open: configFormData.value.quota_task.open,
        config: true,
        reset: true,
      },
      {
        action: 'statistics',
        title: t('sys.config.item.title.statistics'),
        desc: '仪表盘上各类数据以及账单明细的统计任务, 统计间隔时间建议控制在30分钟以内, 单次循环统计查询条数建议控制在10000以内, 单次统计任务超时时间可根据实际情况配置, 建议不要低于10分钟',
        open: configFormData.value.statistics.open,
        config: true,
        reset: true,
      },
      {
        action: 'video_task',
        title: t('sys.config.item.title.video_task'),
        desc: '定时检查各视频任务的状态并更新, 可选择是否开启存储视频, 单次视频任务超时时间可根据实际情况配置, 建议不要低于10分钟',
        open: configFormData.value.video_task.open,
        config: true,
        reset: true,
      },
      {
        action: 'notice',
        title: t('sys.config.item.title.notice'),
        desc: '定时检查各类通知配置是否需要发送通知, 单次通知任务超时时间可根据实际情况配置, 建议不要低于10分钟',
        open: configFormData.value.notice.open,
        config: true,
        reset: true,
      },
    ];
  };
  getSysConfigDetail();
</script>

<script lang="ts">
  export default {
    name: 'Task',
  };
</script>

<style scoped lang="less">
  .card-wrap {
    height: 100%;
    transition: all 0.3s;
    border: 1px solid var(--color-neutral-3);
    border-radius: 5px;
    &:hover {
      transform: translateY(-5px);
      box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.1);
    }
    :deep(.arco-card) {
      height: 100%;
      border-radius: 5px;
      .arco-card-body {
        height: 130px;
        .arco-card-meta {
          height: 100%;
          display: flex;
          flex-flow: column;
          .arco-card-meta-content {
            flex: 1;
            .arco-card-meta-description {
              color: rgb(var(--gray-6));
              line-height: 18px;
              font-size: 12px;
              .arco-descriptions-item-label-inline {
                font-weight: normal;
                font-size: 13px;
                color: rgb(var(--gray-8));
              }
            }
          }
        }
      }
      .arco-card-meta-footer:last-child {
        margin-top: 2px;
        margin-bottom: 12px;
      }
    }
    :deep(.arco-card-meta-title) {
      display: flex;
      align-items: center;
      line-height: 28px;
    }
    :deep(.arco-card-header) {
      border: none;
    }
    :deep(.arco-skeleton-line) {
      &:last-child {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
      }
    }
  }
</style>
