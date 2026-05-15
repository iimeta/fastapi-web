<template>
  <a-form
    ref="formRef"
    :model="formModel"
    class="form"
    :class="{ 'form--two-line': hasTwoLine }"
    :label-col-props="{ span: 4 }"
    :wrapper-col-props="{
      span: props.layout !== 'two-line' && hasTwoLine ? 17 : 18,
    }"
  >
    <template v-for="(rule, index) in rules" :key="index">
      <a-form-item
        :field="`time_rules[${index}].name`"
        :label="`${index + 1}. ` + $t('time_rule.label.rule')"
        :rules="[
          {
            required: true,
            validator: createRuleValidator(rule),
          },
        ]"
      >
        <div class="time-rules-row">
          <div
            class="time-rules-content"
            :class="{
              'time-rules-content--two-line': isTwoLine(rule),
            }"
          >
            <div class="time-rules-line">
              <a-select
                v-model="rule.time_type"
                :placeholder="$t('time_rule.label.time_type')"
                class="time-rules-select--type time-rules-field--spaced"
                @change="handleTimeTypeChangeWrapper(index, $event)"
              >
                <a-option value="all">
                  {{ $t('time_rule.dict.time_type.all') }}
                </a-option>
                <a-option value="weekday">
                  {{ $t('time_rule.dict.time_type.weekday') }}
                </a-option>
                <a-option value="weekend">
                  {{ $t('time_rule.dict.time_type.weekend') }}
                </a-option>
                <a-option value="custom">
                  {{ $t('time_rule.dict.time_type.custom') }}
                </a-option>
              </a-select>
              <a-input
                v-model="rule.name"
                :placeholder="$t('time_rule.label.name')"
                allow-clear
                class="time-rules-input--name time-rules-field--spaced"
                @change="emitUpdate"
              />
              <a-time-picker
                :model-value="msToTimeStr(rule.start_time)"
                format="HH:mm"
                class="time-rules-picker"
                :placeholder="$t('common.start_time')"
                @change="handleStartTimeChange(rule, $event)"
              />
              <span class="time-rules-separator">~</span>
              <a-time-picker
                :model-value="msToTimeStr(rule.end_time)"
                :placeholder="$t('common.end_time')"
                format="HH:mm"
                :class="[
                  'time-rules-picker',
                  { 'time-rules-field--spaced': !isTwoLine(rule) },
                ]"
                @change="handleEndTimeChange(rule, $event)"
              />
            </div>
            <div class="time-rules-line">
              <a-input-number
                v-model="rule.discount"
                :placeholder="$t('common.discount')"
                :min="0.0001"
                :max="9999999999999"
                :parser="parseDiscount"
                hide-button
                allow-clear
                class="time-rules-input--discount time-rules-field--spaced"
                @change="emitUpdate"
              >
                <template #append> % </template>
              </a-input-number>
              <a-input-number
                v-model="rule.priority"
                :placeholder="$t('time_rule.label.priority')"
                :precision="0"
                :min="1"
                :max="99999"
                hide-button
                allow-clear
                class="time-rules-input--priority"
                @change="emitUpdate"
              />
              <a-select
                v-if="rule.time_type === 'custom'"
                v-model="rule.day_mode"
                :placeholder="$t('time_rule.label.day_mode')"
                class="time-rules-select--day-mode"
                @change="
                  () => {
                    rule.days = [];
                    emitUpdate();
                  }
                "
              >
                <a-option value="week">
                  {{ $t('time_rule.dict.day_mode.week') }}
                </a-option>
                <a-option value="month">
                  {{ $t('time_rule.dict.day_mode.month') }}
                </a-option>
              </a-select>
              <model-select
                v-if="props.layout === 'two-line'"
                v-model="rule.models"
                :placeholder="$t('time_rule.label.models')"
                :max-tag-count="1"
                class="time-rules-select--models"
                @update:model-value="emitUpdate"
              />
            </div>
          </div>
          <div class="time-rules-actions">
            <a-button type="primary" shape="circle" @click="addRule">
              <icon-plus />
            </a-button>
            <a-button
              type="secondary"
              shape="circle"
              :class="{
                'time-rules-field--spaced':
                  props.layout !== 'two-line' && isTwoLine(rule),
              }"
              @click="removeRule(index)"
            >
              <icon-minus />
            </a-button>
          </div>
        </div>
      </a-form-item>
      <a-form-item v-if="showWeekDays(rule)">
        <a-checkbox-group
          :model-value="weekGroupValue(rule)"
          @change="handleWeekGroupChange(index, rule, $event)"
        >
          <a-checkbox
            :value="ALL_SENTINEL"
            class="days"
            :class="{ 'check-all-indeterminate': isWeekIndeterminate(rule) }"
          >
            {{ $t('common.all') }}
          </a-checkbox>
          <a-checkbox
            v-for="item in weekDays"
            :key="item.value"
            :value="item.value"
            class="days"
          >
            {{ item.label }}
          </a-checkbox>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item
        v-if="
          rule.time_type === 'custom' &&
          rule.day_mode &&
          rule.day_mode !== 'week'
        "
      >
        <a-checkbox-group
          :model-value="monthGroupValue(rule)"
          @change="handleMonthGroupChange(index, rule, $event)"
        >
          <a-checkbox
            :value="ALL_SENTINEL"
            class="days"
            :class="{ 'check-all-indeterminate': isMonthIndeterminate(rule) }"
          >
            {{ $t('common.all') }}
          </a-checkbox>
          <a-checkbox v-for="d in 31" :key="d" :value="d" class="days">
            {{ d }}
            {{ $t('time_rule.label.day_suffix') }}
          </a-checkbox>
        </a-checkbox-group>
      </a-form-item>
    </template>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type { TimeRule } from '@/api/common';
  import ModelSelect from '@/components/model-select/index.vue';
  import { parseDiscount } from '@/utils/common';

  const { t } = useI18n();

  const props = defineProps<{
    modelValue?: TimeRule[];
    layout?: 'inline' | 'two-line';
  }>();

  function isTwoLine(rule: TimeRule) {
    return props.layout === 'two-line' || rule.time_type === 'custom';
  }

  const hasTwoLine = computed(
    () =>
      props.layout === 'two-line' ||
      rules.value.some((r) => r.time_type === 'custom')
  );

  const emit = defineEmits<{
    (e: 'update:modelValue', value: TimeRule[]): void;
  }>();

  const formRef = ref();

  const formModel = computed(() => ({
    time_rules: rules.value,
  }));

  defineExpose({
    validate: () => formRef.value?.validate(),
  });

  function createRuleValidator(rule: TimeRule) {
    return (value: string, callback: (error?: string) => void) => {
      if (
        rule.time_type &&
        value &&
        rule.discount !== undefined &&
        rule.discount !== null &&
        rule.priority !== undefined &&
        rule.priority !== null &&
        (rule.time_type !== 'custom' || rule.day_mode) &&
        (rule.time_type === 'all' || (rule.days && rule.days.length > 0))
      ) {
        callback();
      } else {
        callback(
          t(
            rule.time_type === 'custom'
              ? 'time_rule.error.required.all_custom'
              : 'time_rule.error.required.all'
          )
        );
      }
    };
  }

  const defaultRule = (): TimeRule =>
    ({
      time_type: 'all',
      name: t('time_rule.dict.time_type.all'),
      start_time: 0,
      end_time: 86399999,
      discount: props.layout === 'two-line' ? ref() : 100,
      days: [],
      day_mode: '',
      priority: 20,
      models: [],
    } as TimeRule);

  const rules = computed({
    get: () => props.modelValue || [],
    set: (val) => emit('update:modelValue', val),
  });

  watch(
    () => props.modelValue,
    (val) => {
      if (!val || val.length === 0) {
        emit('update:modelValue', [defaultRule()]);
      }
    },
    { immediate: true }
  );

  const weekDays = computed(() => [
    { value: 1, label: t('time_rule.dict.week.1') },
    { value: 2, label: t('time_rule.dict.week.2') },
    { value: 3, label: t('time_rule.dict.week.3') },
    { value: 4, label: t('time_rule.dict.week.4') },
    { value: 5, label: t('time_rule.dict.week.5') },
    { value: 6, label: t('time_rule.dict.week.6') },
    { value: 0, label: t('time_rule.dict.week.0') },
  ]);

  const ALL_SENTINEL = -999;
  const allWeekValues = [1, 2, 3, 4, 5, 6, 0];
  const allMonthValues = Array.from({ length: 31 }, (_, i) => i + 1);

  function showWeekDays(rule: TimeRule) {
    return (
      rule.time_type === 'weekday' ||
      rule.time_type === 'weekend' ||
      (rule.time_type === 'custom' && rule.day_mode && rule.day_mode === 'week')
    );
  }

  function isWeekIndeterminate(rule: TimeRule) {
    const days = rule.days || [];
    return days.length > 0 && !allWeekValues.every((v) => days.includes(v));
  }

  function isMonthIndeterminate(rule: TimeRule) {
    const days = rule.days || [];
    return days.length > 0 && !allMonthValues.every((v) => days.includes(v));
  }

  function weekGroupValue(rule: TimeRule): number[] {
    const days = rule.days || [];
    if (allWeekValues.every((v) => days.includes(v))) {
      return [ALL_SENTINEL, ...days];
    }
    return [...days];
  }

  function onWeekGroupChange(rule: TimeRule, val: number[]) {
    const hadSentinel =
      (rule.days || []).length > 0 &&
      allWeekValues.every((v) => rule.days?.includes(v));
    const hasSentinel = val.includes(ALL_SENTINEL);
    const realValues = val.filter((v) => v !== ALL_SENTINEL);

    if (hasSentinel && !hadSentinel) {
      rule.days = [...allWeekValues];
    } else if (!hasSentinel && hadSentinel) {
      rule.days = [];
    } else {
      rule.days = realValues;
    }
    emitUpdate();
  }

  function monthGroupValue(rule: TimeRule): number[] {
    const days = rule.days || [];
    if (allMonthValues.every((v) => days.includes(v))) {
      return [ALL_SENTINEL, ...days];
    }
    return [...days];
  }

  function onMonthGroupChange(rule: TimeRule, val: number[]) {
    const hadSentinel =
      (rule.days || []).length > 0 &&
      allMonthValues.every((v) => rule.days?.includes(v));
    const hasSentinel = val.includes(ALL_SENTINEL);
    const realValues = val.filter((v) => v !== ALL_SENTINEL);

    if (hasSentinel && !hadSentinel) {
      rule.days = [...allMonthValues];
    } else if (!hasSentinel && hadSentinel) {
      rule.days = [];
    } else {
      rule.days = realValues;
    }
    emitUpdate();
  }

  function emitUpdate() {
    emit('update:modelValue', [...rules.value]);
  }

  function addRule() {
    const newRules = [
      ...rules.value,
      {
        time_type: '',
        name: '',
        start_time: 0,
        end_time: 86399999,
        discount: ref(),
        days: [],
        day_mode: '',
        priority: ref(),
        models: [],
      } as TimeRule,
    ];
    emit('update:modelValue', newRules);
  }

  function removeRule(index: number) {
    const newRules = rules.value.filter(
      (_: TimeRule, i: number) => i !== index
    );
    emit('update:modelValue', newRules);
  }

  const typeNameMap: Record<string, string> = {
    all: 'time_rule.dict.time_type.all',
    weekday: 'time_rule.dict.time_type.weekday',
    weekend: 'time_rule.dict.time_type.weekend',
    custom: 'time_rule.dict.time_type.custom',
  };

  function isPresetName(name: string) {
    return !name || Object.values(typeNameMap).some((key) => t(key) === name);
  }

  function handleTimeTypeChange(index: number, val: string) {
    const rule = rules.value[index];
    if (!rule) return;
    if (isPresetName(rule.name)) {
      rule.name = val === 'custom' ? '' : t(typeNameMap[val]);
    }
    if (val === 'all') {
      rule.start_time = 0;
      rule.end_time = 86399999;
      rule.days = [];
    } else if (val === 'weekday') {
      rule.days = [1, 2, 3, 4, 5];
    } else if (val === 'weekend') {
      rule.days = [6, 0];
    } else if (val === 'custom') {
      rule.days = [];
    }
    emitUpdate();
  }

  function msToTimeStr(ms: number | undefined): string | undefined {
    if (ms === undefined || ms === null) return undefined;
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}`;
  }

  function timeStrToStartMs(val: string | undefined): number {
    if (!val) return 0;
    const [hours, minutes] = val.split(':').map(Number);
    return (hours * 3600 + minutes * 60) * 1000;
  }

  function timeStrToEndMs(val: string | undefined): number {
    if (!val) return 86399999;
    const [hours, minutes] = val.split(':').map(Number);
    return (hours * 3600 + minutes * 60 + 59) * 1000 + 999;
  }

  function handleTimeTypeChangeWrapper(
    index: number,
    val: string | number | Record<string, any> | undefined
  ) {
    handleTimeTypeChange(index, val as string);
  }

  function handleStartTimeChange(
    rule: TimeRule,
    val: string | string[] | undefined
  ) {
    rule.start_time = timeStrToStartMs(val as string | undefined);
    emitUpdate();
  }

  function handleEndTimeChange(
    rule: TimeRule,
    val: string | string[] | undefined
  ) {
    rule.end_time = timeStrToEndMs(val as string | undefined);
    emitUpdate();
  }

  function validateRuleField(index: number) {
    formRef.value?.validateField(`time_rules[${index}].name`);
  }

  function handleWeekGroupChange(
    index: number,
    rule: TimeRule,
    val: (string | number | boolean)[]
  ) {
    onWeekGroupChange(rule, val as number[]);
    validateRuleField(index);
  }

  function handleMonthGroupChange(
    index: number,
    rule: TimeRule,
    val: (string | number | boolean)[]
  ) {
    onMonthGroupChange(rule, val as number[]);
    validateRuleField(index);
  }
</script>

<script lang="ts">
  export default {
    name: 'TimeRules',
  };
</script>

<style scoped lang="less">
  .form {
    align-items: center;
  }

  .form--two-line {
    :deep(.arco-form-item-label-col) {
      display: flex;
      align-items: center;
      align-self: stretch;
    }
  }

  :deep(.time-rules-field--spaced) {
    margin-right: 5px;
  }

  .time-rules-separator {
    margin: 0 4px;
  }

  .time-rules-row {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .time-rules-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }

  .time-rules-content--two-line {
    flex: 1;
    flex-direction: column;
    align-items: stretch;
    gap: 5px;

    .time-rules-line {
      width: 100%;

      :deep(.time-rules-select--type),
      :deep(.time-rules-input--name),
      :deep(.time-rules-picker),
      :deep(.time-rules-input--discount),
      :deep(.time-rules-input--priority),
      :deep(.time-rules-select--day-mode),
      :deep(.time-rules-select--models) {
        flex: 1;
      }
    }
  }

  .time-rules-line {
    display: flex;
    align-items: center;
  }

  .time-rules-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: 10px;
    flex-shrink: 0;
  }

  :deep(.time-rules-select--type) {
    width: 110px;
  }

  :deep(.time-rules-input--name) {
    width: 132px;
  }

  :deep(.time-rules-picker) {
    width: 100px;
  }

  :deep(.time-rules-input--discount) {
    width: 120px;
  }

  :deep(.time-rules-input--priority) {
    width: 80px;
  }

  :deep(.time-rules-select--day-mode) {
    width: 95px;
    margin-left: 5px;
  }

  :deep(.time-rules-select--models) {
    width: 200px;
    margin-left: 5px;
  }

  :deep(.arco-picker input) {
    color: var(--color-text-1);
  }

  .days {
    width: 65px;
  }

  .check-all-indeterminate {
    :deep(.arco-checkbox-icon) {
      background-color: rgb(var(--primary-6));
      border-color: rgb(var(--primary-6));

      &::after {
        width: 8px;
        height: 2px;
        border: none;
        background-color: var(--color-white);
        transform: translate(-50%, -50%);
        top: 50%;
        left: 50%;
        position: absolute;
        border-radius: 1px;
      }
    }
  }
</style>
