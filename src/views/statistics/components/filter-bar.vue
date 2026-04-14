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
            <a-col v-if="userStore.role === 'admin'" :span="6">
              <a-form-item :label="$t('common.reseller_id')">
                <a-input-number
                  v-model="formData.rid"
                  class="filter-bar-full-width"
                  allow-clear
                  hide-button
                />
              </a-form-item>
            </a-col>
            <a-col v-if="userStore.role !== 'user'" :span="6">
              <a-form-item :label="$t('common.user_id')">
                <a-input-number
                  v-model="formData.user_id"
                  class="filter-bar-full-width"
                  allow-clear
                  hide-button
                />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="$t('common.app_id')">
                <a-input-number
                  v-model="formData.app_id"
                  class="filter-bar-full-width"
                  allow-clear
                  hide-button
                />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="$t('common.app_key')">
                <a-input
                  v-model="formData.app_key"
                  class="filter-bar-full-width"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item :label="$t('common.model')">
                <a-select
                  v-model="formData.models"
                  class="filter-bar-full-width"
                  multiple
                  allow-clear
                  allow-search
                  :max-tag-count="1"
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
            <a-col :span="6">
              <a-form-item :label="$t('common.provider')">
                <a-select
                  v-model="formData.provider"
                  class="filter-bar-full-width"
                  allow-clear
                  allow-search
                >
                  <a-option
                    v-for="p in providerOptions"
                    :key="p.name"
                    :value="p.name"
                    :label="p.name"
                  />
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-col>
      <a-divider class="filter-bar-divider" direction="vertical" />
      <a-col :flex="'86px'" class="filter-bar-actions">
        <a-space direction="vertical" :size="12">
          <a-button type="primary" @click="handleSearch">
            <template #icon><icon-search /></template>
            {{ $t('button.search') }}
          </a-button>
          <a-button @click="handleReset">
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
  import { queryModelList, ModelList } from '@/api/model';
  import { queryProviderList, ProviderList } from '@/api/provider';

  const emit = defineEmits(['filterChange']);
  const userStore = useUserStore();

  const formData = reactive({
    rid: undefined as number | undefined,
    user_id: undefined as number | undefined,
    app_id: undefined as number | undefined,
    app_key: '' as string,
    models: [] as string[],
    provider: '' as string,
  });

  const modelOptions = ref<ModelList[]>([]);
  const providerOptions = ref<ProviderList[]>([]);

  function getParams() {
    return {
      rid: formData.rid || 0,
      user_id: formData.user_id || 0,
      app_id: formData.app_id || 0,
      app_key: formData.app_key || '',
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
    try {
      const { data } = await queryModelList();
      modelOptions.value = data.items || [];
    } catch {
      /* empty */
    }
    if (userStore.role === 'admin') {
      try {
        const { data } = await queryProviderList();
        providerOptions.value = data.items || [];
      } catch {
        /* empty */
      }
    }
  });
</script>

<script lang="ts">
  export default { name: 'FilterBar' };
</script>

<style scoped lang="less">
  @import '../style/statistics-filter-shared.less';
</style>
