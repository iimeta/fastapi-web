<template>
  <a-input
    :model-value="modelValue"
    :placeholder="placeholder"
    allow-clear
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #suffix>
      <a-tooltip :content="$t('button.generate_password')">
        <span class="password-generate-btn" @click="handleGenerate">
          <lucide-dices class="password-generate-icon" />
        </span>
      </a-tooltip>
    </template>
  </a-input>
</template>

<script lang="ts" setup>
  import { generatePassword } from '@/utils/common';

  defineProps<{
    modelValue?: string;
    placeholder?: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
  }>();

  const handleGenerate = () => {
    emit('update:modelValue', generatePassword());
  };
</script>

<script lang="ts">
  export default {
    name: 'PasswordInput',
  };
</script>

<style scoped lang="less">
  .password-generate-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin-right: -4px;
    color: var(--color-text-2);
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: rgb(var(--primary-6));
    }
  }

  .password-generate-icon {
    width: 14px;
    height: 14px;
  }
</style>
