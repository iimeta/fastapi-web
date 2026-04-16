<template>
  <div class="filter-bar">
    <a-row>
      <a-col :flex="1">
        <a-form
          :model="formData"
          :label-col-props="{ span: 6 }"
          :wrapper-col-props="{ span: 18 }"
          label-align="left"
          size="medium"
        >
          <a-row :gutter="16">
            <a-col v-if="userStore.role === 'admin'" :span="8">
              <a-form-item :label="$t('common.reseller')">
                <a-input-number
                  v-model="formData.rid"
                  :placeholder="$t('placeholder.reseller_id')"
                  class="filter-bar-full-width"
                  allow-clear
                  hide-button
                />
              </a-form-item>
            </a-col>
            <a-col v-if="userStore.role !== 'user'" :span="8">
              <a-form-item :label="$t('common.user_id')">
                <a-input-number
                  v-model="formData.user_id"
                  :placeholder="$t('placeholder.user_id')"
                  class="filter-bar-full-width"
                  allow-clear
                  hide-button
                />
              </a-form-item>
            </a-col>
            <a-col v-if="userStore.role === 'user'" :span="6">
              <a-form-item field="app_id" :label="$t('log.form.app_id')">
                <a-select
                  v-model="formData.app_id"
                  :placeholder="$t('common.all')"
                  :scrollbar="false"
                  class="filter-bar-full-width"
                  allow-search
                  allow-clear
                >
                  <a-option
                    v-for="item in appOptions"
                    :key="item.app_id"
                    :value="item.app_id"
                    :label="item.name"
                  />
                </a-select>
              </a-form-item>
            </a-col>
            <a-col v-if="userStore.role !== 'user'" :span="8">
              <a-form-item :label="$t('common.app_id')">
                <a-input-number
                  v-model="formData.app_id"
                  :placeholder="$t('placeholder.app_id')"
                  class="filter-bar-full-width"
                  allow-clear
                  hide-button
                />
              </a-form-item>
            </a-col>
            <a-col
              v-if="userStore.role !== 'admin'"
              :span="userStore.role === 'user' ? 6 : 8"
            >
              <a-form-item field="key" :label="$t('common.key')">
                <a-input
                  v-model="formData.app_key"
                  :placeholder="$t('placeholder.app_key')"
                  class="filter-bar-full-width"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col v-if="userStore.role === 'admin'" :span="8">
              <a-form-item :label="$t('common.key')">
                <a-input
                  v-model="formData.key"
                  :placeholder="$t('placeholder.key')"
                  class="filter-bar-full-width"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :span="userStore.role === 'user' ? 6 : 8">
              <a-form-item :label="$t('common.model')">
                <a-select
                  v-model="formData.models"
                  :placeholder="$t('common.all')"
                  :scrollbar="false"
                  :max-tag-count="1"
                  class="filter-bar-full-width"
                  multiple
                  allow-clear
                  allow-search
                >
                  <a-option
                    v-for="m in modelOptions"
                    :key="m.model"
                    :value="m.model"
                    :label="m.name"
                  />
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="userStore.role === 'user' ? 6 : 8">
              <a-form-item :label="$t('common.provider')">
                <a-select
                  v-model="formData.provider"
                  :placeholder="$t('common.all')"
                  :scrollbar="false"
                  class="filter-bar-full-width"
                  allow-clear
                  allow-search
                >
                  <a-option
                    v-for="p in providerOptions"
                    :key="p.id"
                    :value="p.id"
                    :label="p.name"
                  />
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-col>
      <a-divider
        :class="
          userStore.role !== 'user'
            ? 'filter-bar-divider'
            : 'filter-bar-divider-user'
        "
        direction="vertical"
      />
      <a-col :flex="'86px'" class="filter-bar-actions">
        <a-space direction="vertical" :size="12">
          <a-button type="primary" @click="handleSearch">
            <template #icon><icon-search /></template>
            {{ $t('button.search') }}
          </a-button>
          <a-button v-if="userStore.role !== 'user'" @click="handleReset">
            <template #icon><icon-refresh /></template>
            {{ $t('button.reset') }}
          </a-button>
        </a-space>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue';
  import { useUserStore } from '@/store';
  import { queryAppList, AppList } from '@/api/app';
  import { queryModelList, ModelList } from '@/api/model';
  import { queryProviderList, ProviderList } from '@/api/provider';

  const emit = defineEmits(['filterChange']);
  const userStore = useUserStore();

  const formData = reactive({
    rid: undefined as number | undefined,
    user_id: undefined as number | undefined,
    app_id: undefined as number | undefined,
    app_key: '' as string,
    key: '' as string,
    models: [] as string[],
    provider: '' as string,
  });

  const appOptions = ref<AppList[]>([]);
  const modelOptions = ref<ModelList[]>([]);
  const providerOptions = ref<ProviderList[]>([]);

  function getParams() {
    return {
      rid: formData.rid || 0,
      user_id: formData.user_id || 0,
      app_id: formData.app_id || 0,
      app_key: formData.app_key || '',
      key: formData.key || '',
      provider: formData.provider || '',
      models: formData.models.length > 0 ? formData.models : undefined,
    };
  }

  function handleSearch() {
    emit('filterChange', getParams());
  }

  function handleReset() {
    formData.rid = undefined;
    formData.user_id = undefined;
    formData.app_id = undefined;
    formData.app_key = '';
    formData.models = [];
    formData.provider = '';
    emit('filterChange', getParams());
  }

  onMounted(async () => {
    emit('filterChange', getParams());

    if (userStore.role === 'user') {
      try {
        const { data } = await queryAppList();
        appOptions.value = data.items;
      } catch (err) {
        // you can report use errorHandler or other
      }
    }

    try {
      const { data } = await queryModelList();
      modelOptions.value = data.items || [];
    } catch {
      // you can report use errorHandler or other
    }

    try {
      const { data } = await queryProviderList();
      providerOptions.value = data.items || [];
    } catch {
      // you can report use errorHandler or other
    }
  });
</script>

<script lang="ts">
  export default { name: 'FilterBar' };
</script>

<style scoped lang="less">
  @import '../style/statistics-filter-shared.less';
</style>
