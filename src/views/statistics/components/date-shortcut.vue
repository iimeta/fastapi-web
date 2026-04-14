<template>
  <a-space :size="12">
    <a-radio-group
      v-model:model-value="active"
      type="button"
      @change="handleChange"
    >
      <a-radio value="1">{{ $t('common.date_range1') }}</a-radio>
      <a-radio value="7">{{ $t('common.date_range7') }}</a-radio>
      <a-radio value="15">{{ $t('common.date_range15') }}</a-radio>
      <a-radio value="30">{{ $t('common.date_range30') }}</a-radio>
      <a-radio v-if="props.showAll" value="0">{{ $t('common.all') }}</a-radio>
    </a-radio-group>
    <a-range-picker
      v-model="customRange"
      class="date-shortcut-range-picker"
      show-time
      :time-picker-props="{ defaultValue: ['00:00:00', '23:59:59'] }"
      :disabled-date="disabledDate"
      @change="handleCustomChange"
      @select="onSelect"
    />
  </a-space>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import dayjs, { Dayjs } from 'dayjs';

  const emit = defineEmits(['change']);

  const props = withDefaults(
    defineProps<{ defaultDays?: string; showAll?: boolean }>(),
    { showAll: true }
  );
  const active = ref(props.defaultDays || '15');

  function getDayRange(val: string): [Dayjs, Dayjs] | undefined {
    const days = Number(val);
    if (days === 0) return undefined;
    const end = dayjs().endOf('day');
    const start =
      days === 1
        ? dayjs().startOf('day')
        : dayjs()
            .subtract(days - 1, 'day')
            .startOf('day');
    return [start, end];
  }

  const customRange = ref<[Dayjs, Dayjs] | undefined>(
    getDayRange(active.value)
  );

  function getRange(val: string) {
    const days = Number(val);
    if (days === 0) {
      return { stat_start_time: 0, stat_end_time: 0 };
    }
    const range = getDayRange(val);
    if (!range) return { stat_start_time: 0, stat_end_time: 0 };
    return {
      stat_start_time: range[0].valueOf(),
      stat_end_time: range[1].valueOf(),
    };
  }

  function handleChange(val: string | number | boolean) {
    customRange.value = getDayRange(String(val));
    emit('change', getRange(String(val)));
  }

  const MAX_RANGE_MONTHS = 3;
  const selectedDate = ref<Dayjs | undefined>();

  function disabledDate(current: Date) {
    if (!selectedDate.value) return false;
    const d = dayjs(current);
    const minDate = selectedDate.value
      .subtract(MAX_RANGE_MONTHS, 'month')
      .add(1, 'day');
    const maxDate = selectedDate.value
      .add(MAX_RANGE_MONTHS, 'month')
      .subtract(1, 'day');
    return d.isBefore(minDate, 'day') || d.isAfter(maxDate, 'day');
  }

  function onSelect(
    dateString: (string | undefined)[],
    value: (Date | undefined)[]
  ) {
    if (value && value[0] && !value[1]) {
      selectedDate.value = dayjs(value[0]);
    } else {
      selectedDate.value = undefined;
    }
  }

  function handleCustomChange(dates: (Dayjs | string | Date)[] | undefined) {
    selectedDate.value = undefined;
    if (!dates || dates.length !== 2 || !dates[0] || !dates[1]) return;
    active.value = '';
    emit('change', {
      stat_start_time: dayjs(dates[0]).valueOf(),
      stat_end_time: dayjs(dates[1]).valueOf(),
    });
  }

  defineExpose({ getRange });
</script>

<script lang="ts">
  export default { name: 'DateShortcut' };
</script>

<style scoped lang="less">
  @import '../style/statistics-date-shared.less';
</style>
