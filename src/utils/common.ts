import dayjs from 'dayjs';

const QUOTA_DEFAULT_UNIT = 1000000;

export function convQuota(quota: number, reverse: boolean = false) {
  return reverse 
    ? quota * QUOTA_DEFAULT_UNIT 
    : quota / QUOTA_DEFAULT_UNIT;
}

export function quotaConv(quota: number) {
  return parseFloat((quota / QUOTA_DEFAULT_UNIT).toFixed(6)).toLocaleString(
    undefined,
    {
      maximumFractionDigits: 6,
    }
  );
}

export function quotaConv4(quota: number) {
  return parseFloat((quota / QUOTA_DEFAULT_UNIT).toFixed(4)).toLocaleString(
    undefined,
    {
      maximumFractionDigits: 4,
    }
  );
}

export function parserPrice(price: string) {
  // 使用正则匹配最多6位小数
  const match = price.match(/^(-?\d*)(\.\d{0,6})?/);
  return match ? match[0] : price;
}

export function disabledDate(current: Date) {
  return dayjs(current).isBefore(dayjs().subtract(1, 'day'));
}
