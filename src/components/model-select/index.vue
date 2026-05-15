<template>
  <div class="model-select" @click="handleTriggerClick">
    <a-input-tag
      :model-value="displayValues"
      :input-value="''"
      :max-tag-count="maxTagCount"
      :placeholder="placeholder"
      @remove="handleTagRemove"
    >
      <template #suffix>
        <span
          v-if="modelValue.length > 0"
          class="model-select__clear"
          @click.stop="handleClearAll"
        >
          <icon-close />
        </span>
        <icon-down class="model-select__arrow" />
      </template>
    </a-input-tag>

    <a-modal
      v-model:visible="visible"
      :width="888"
      :ok-text="$t('button.ok')"
      :cancel-text="$t('button.cancel')"
      unmount-on-close
      hide-title
      simple
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div class="model-select-modal">
        <div class="model-select-modal__header">
          <a-input-search
            v-model="searchText"
            :placeholder="$t('modelSelect.search')"
            allow-clear
            class="model-select-modal__search"
          />
          <div class="model-select-modal__stats">
            <span
              >{{ $t('modelSelect.selected') }}: {{ tempSelected.length }}</span
            >
            <a-button
              v-if="tempSelected.length > 0"
              type="text"
              size="mini"
              status="danger"
              @click="tempSelected = []"
            >
              {{ $t('modelSelect.clear') }}
            </a-button>
          </div>
        </div>
        <div class="model-select-modal__content">
          <div class="model-select-modal__tree">
            <template v-if="filteredTree.length > 0">
              <div
                v-for="provider in filteredTree"
                :key="provider.key"
                class="provider-group"
              >
                <div class="provider-group__header">
                  <a-checkbox
                    :model-value="isAllSelected(provider)"
                    :indeterminate="isIndeterminate(provider)"
                    @change="toggleGroup(provider, $event)"
                  />
                  <span
                    class="provider-group__name"
                    @click="toggleCollapse(provider.key)"
                  >
                    {{ provider.title }}
                    <span class="provider-group__count">
                      ({{ selectedCount(provider) }}/{{ totalCount(provider) }})
                    </span>
                    <icon-down
                      class="provider-group__arrow"
                      :class="{
                        'provider-group__arrow--collapsed': collapsed.has(
                          provider.key
                        ),
                      }"
                    />
                  </span>
                </div>
                <div
                  v-show="!collapsed.has(provider.key)"
                  class="provider-group__body"
                >
                  <div
                    v-for="typeNode in provider.children"
                    :key="typeNode.key"
                    class="type-group"
                  >
                    <div class="type-group__header">
                      <a-checkbox
                        :model-value="isAllSelected(typeNode)"
                        :indeterminate="isIndeterminate(typeNode)"
                        @change="toggleGroup(typeNode, $event)"
                      />
                      <span
                        class="type-group__name"
                        @click="toggleGroup(typeNode, !isAllSelected(typeNode))"
                      >
                        {{ typeNode.title }}
                        <span class="type-group__count">
                          ({{ selectedCount(typeNode) }}/{{
                            totalCount(typeNode)
                          }})
                        </span>
                      </span>
                    </div>
                    <div class="type-group__models">
                      <div
                        v-for="model in typeNode.children"
                        :key="model.key"
                        class="model-item"
                        :class="{
                          'model-item--selected': tempSelectedSet.has(
                            model.value
                          ),
                        }"
                        @click="
                          toggleModel(
                            model.value,
                            !tempSelectedSet.has(model.value)
                          )
                        "
                      >
                        <a-checkbox
                          :model-value="tempSelectedSet.has(model.value)"
                          @change="toggleModel(model.value, $event)"
                        />
                        <span class="model-item__name">{{ model.title }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <a-empty v-else :description="$t('modelSelect.no_match')" />
          </div>

          <div class="model-select-modal__selected">
            <div class="model-select-modal__selected-header">
              {{ $t('modelSelect.selected_models') }} ({{
                tempSelected.length
              }})
            </div>
            <div class="model-select-modal__selected-list">
              <template v-if="tempSelected.length > 0">
                <div
                  v-for="value in tempSelected"
                  :key="value"
                  class="selected-item"
                >
                  <span
                    class="selected-item__name"
                    :title="getModelTitle(value)"
                  >
                    {{ getModelTitle(value) }}
                  </span>
                  <span
                    class="selected-item__remove"
                    @click="removeFromTemp(value)"
                  >
                    <icon-close />
                  </span>
                </div>
              </template>
              <a-empty v-else :description="$t('modelSelect.empty')" />
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { queryModelTree, Tree } from '@/api/model';

  interface Props {
    modelValue?: string[];
    placeholder?: string;
    maxTagCount?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [],
    placeholder: '',
    maxTagCount: 3,
  });

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string[]): void;
  }>();

  const visible = ref(false);
  const searchText = ref('');
  const tempSelected = ref<string[]>([]);
  const treeData = ref<Tree[]>([]);
  const collapsed = ref<Set<string>>(new Set());

  const getModelTree = async () => {
    try {
      const { data } = await queryModelTree();
      treeData.value = data.items;
    } catch (err) {
      // ignored
    }
  };
  getModelTree();

  const modelInfoMap = computed(() => {
    const map = new Map<string, string>();
    const walk = (nodes: Tree[]) => {
      nodes.forEach((node) => {
        if (node.children?.length) {
          walk(node.children);
        } else {
          map.set(node.value, node.title);
        }
      });
    };
    walk(treeData.value);
    return map;
  });

  const getModelTitle = (value: string): string => {
    return modelInfoMap.value.get(value) || value;
  };

  const displayValues = computed(() =>
    props.modelValue.map((id) => ({
      value: id,
      label: getModelTitle(id),
      closable: true,
    }))
  );

  const skipOpen = ref(false);

  const tempSelectedSet = computed(() => new Set(tempSelected.value));

  const filterTree = (tree: Tree[], query: string): Tree[] => {
    return tree.reduce<Tree[]>((result, node) => {
      if (node.children?.length) {
        const filteredChildren = filterTree(node.children, query);
        if (filteredChildren.length > 0) {
          result.push({ ...node, children: filteredChildren });
        }
      } else if (node.title.toLowerCase().includes(query)) {
        result.push(node);
      }
      return result;
    }, []);
  };

  const filteredTree = computed(() => {
    if (!searchText.value) return treeData.value;
    const q = searchText.value.toLowerCase();
    return filterTree(treeData.value, q);
  });

  function getLeafValues(node: Tree): string[] {
    if (!node.children?.length) return [node.value];
    return node.children.flatMap(getLeafValues);
  }

  function isAllSelected(node: Tree): boolean {
    const leaves = getLeafValues(node);
    return (
      leaves.length > 0 && leaves.every((v) => tempSelectedSet.value.has(v))
    );
  }

  function isIndeterminate(node: Tree): boolean {
    const leaves = getLeafValues(node);
    const count = leaves.filter((v) => tempSelectedSet.value.has(v)).length;
    return count > 0 && count < leaves.length;
  }

  function selectedCount(node: Tree): number {
    return getLeafValues(node).filter((v) => tempSelectedSet.value.has(v))
      .length;
  }

  function totalCount(node: Tree): number {
    return getLeafValues(node).length;
  }

  function toggleModel(value: string, checked: unknown) {
    if (checked) {
      if (!tempSelectedSet.value.has(value)) {
        tempSelected.value.push(value);
      }
    } else {
      tempSelected.value = tempSelected.value.filter((v) => v !== value);
    }
  }

  function toggleGroup(node: Tree, checked: unknown) {
    const leaves = getLeafValues(node);
    if (checked) {
      const toAdd = leaves.filter((v) => !tempSelectedSet.value.has(v));
      tempSelected.value.push(...toAdd);
    } else {
      const toRemove = new Set(leaves);
      tempSelected.value = tempSelected.value.filter((v) => !toRemove.has(v));
    }
  }

  function toggleCollapse(key: string) {
    const next = new Set(collapsed.value);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    collapsed.value = next;
  }

  function removeFromTemp(value: string) {
    tempSelected.value = tempSelected.value.filter((v) => v !== value);
  }

  function openModal() {
    tempSelected.value = [...props.modelValue];
    searchText.value = '';
    collapsed.value = new Set();
    visible.value = true;
  }

  function handleOk() {
    emit('update:modelValue', [...tempSelected.value]);
  }

  function handleCancel() {
    visible.value = false;
  }

  function handleTagRemove(removed: string | number) {
    skipOpen.value = true;
    emit(
      'update:modelValue',
      props.modelValue.filter((v) => v !== String(removed))
    );
    setTimeout(() => {
      skipOpen.value = false;
    }, 100);
  }

  function handleClearAll() {
    skipOpen.value = true;
    emit('update:modelValue', []);
    setTimeout(() => {
      skipOpen.value = false;
    }, 100);
  }

  function handleTriggerClick() {
    if (!skipOpen.value) {
      openModal();
    }
  }

  defineExpose({ refresh: getModelTree });
</script>

<script lang="ts">
  export default {
    name: 'ModelSelect',
  };
</script>

<style scoped lang="less">
  .model-select {
    flex: 1;
    cursor: pointer;

    :deep(.arco-input-tag) {
      cursor: pointer;
    }

    .arco-input-tag .arco-input-tag-suffix > svg {
      font-size: 12px;
    }

    :deep(.arco-input-tag-input) {
      caret-color: transparent !important;
    }

    &__clear {
      position: relative;
      display: none;
      font-size: 12px;
      color: var(--color-text-2);
      cursor: pointer;

      &::before {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        transform: translate(-50%, -50%);
        background-color: transparent;
        border-radius: var(--border-radius-circle);
        transition: background-color 0.1s cubic-bezier(0, 0, 1, 1);
        content: '';
      }

      &:hover::before {
        background-color: var(--color-fill-2);
      }

      > svg {
        position: relative;
      }
    }

    &:hover &__clear {
      display: inline-block;
    }

    &:hover &__clear ~ &__arrow {
      display: none;
    }
  }

  .model-select-modal {
    display: flex;
    flex-direction: column;
    height: 520px;

    &__header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      flex-shrink: 0;
    }

    &__search {
      flex: 1;
    }

    &__stats {
      display: flex;
      align-items: center;
      gap: 4px;
      white-space: nowrap;
      font-size: 13px;
      color: var(--color-text-2);
    }

    &__content {
      display: flex;
      gap: 12px;
      flex: 1;
      overflow: hidden;
    }

    &__tree {
      flex: 1;
      overflow-y: auto;
      border: 1px solid var(--color-border-2);
      border-radius: var(--border-radius-small);
      padding: 8px 10px;
    }

    &__selected {
      width: 200px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--color-border-2);
      border-radius: var(--border-radius-small);
      overflow: hidden;
    }

    &__selected-header {
      padding: 8px 12px;
      font-size: 13px;
      font-weight: 500;
      color: var(--color-text-2);
      background-color: var(--color-fill-1);
      border-bottom: 1px solid var(--color-border-2);
      flex-shrink: 0;
    }

    &__selected-list {
      flex: 1;
      overflow-y: auto;
      padding: 4px;
    }
  }

  // --- Provider group ---
  .provider-group {
    &:not(:last-child) {
      margin-bottom: 8px;
    }

    &__header {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 8px;
      border-radius: var(--border-radius-small);
      background-color: var(--color-fill-2);

      :deep(.arco-checkbox) {
        padding: 0;
      }
    }

    &__name {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 4px;
      font-weight: 600;
      font-size: 13px;
      color: var(--color-text-1);
      cursor: pointer;
      user-select: none;
    }

    &__count {
      font-weight: 400;
      font-size: 12px;
      color: var(--color-text-3);
    }

    &__arrow {
      font-size: 12px;
      color: var(--color-text-3);
      transition: transform 0.2s;
      margin-left: auto;

      &--collapsed {
        transform: rotate(-90deg);
      }
    }

    &__body {
      padding: 4px 0 0 8px;
      border-left: 2px solid var(--color-border-2);
      margin-left: 14px;
    }
  }

  // --- Type group ---
  .type-group {
    &:not(:last-child) {
      margin-bottom: 6px;
    }

    &__header {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 6px;

      :deep(.arco-checkbox) {
        padding: 0;
      }
    }

    &__name {
      font-size: 12px;
      font-weight: 500;
      color: var(--color-text-2);
      cursor: pointer;
      user-select: none;
    }

    &__count {
      font-size: 12px;
      color: var(--color-text-4);
    }

    &__models {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2px 8px;
      padding: 2px 0 2px 6px;
    }
  }

  // --- Model item (grid cell) ---
  .model-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-radius: var(--border-radius-small);
    cursor: pointer;
    transition: background-color 0.1s;
    overflow: hidden;

    &:hover {
      background-color: var(--color-fill-2);
    }

    &--selected {
      background-color: var(--color-primary-light-1);
    }

    :deep(.arco-checkbox) {
      padding: 0;
      flex-shrink: 0;
    }

    &__name {
      font-size: 13px;
      color: var(--color-text-1);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  // --- Right panel selected items ---
  .selected-item {
    display: flex;
    align-items: center;
    padding: 5px 8px;
    border-radius: var(--border-radius-small);
    transition: background-color 0.1s;

    &:hover {
      background-color: var(--color-fill-2);

      .selected-item__remove {
        opacity: 1;
      }
    }

    &__name {
      flex: 1;
      font-size: 12px;
      color: var(--color-text-1);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__remove {
      position: relative;
      display: inline-block;
      flex-shrink: 0;
      font-size: 12px;
      color: var(--color-text-2);
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.1s;
      line-height: 12px;

      &::before {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        transform: translate(-50%, -50%);
        background-color: transparent;
        border-radius: var(--border-radius-circle);
        transition: background-color 0.1s cubic-bezier(0, 0, 1, 1);
        content: '';
      }

      &:hover::before {
        background-color: var(--color-fill-3);
      }

      > svg {
        position: relative;
      }
    }
  }
</style>
