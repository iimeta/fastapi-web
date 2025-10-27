import dayjs from 'dayjs';

export function parseQuota(quota: any, n?: number) {
  if (!quota) {
    return quota;
  }

  if (n === undefined) {
    n = 6;
  }

  return parseFloat(quota).toLocaleString(undefined, {
    maximumFractionDigits: n,
  });
}

export function parsePrice(price: string) {
  // 使用正则匹配最多6位小数
  const match = price.match(/^(-?\d*)(\.\d{0,6})?/);
  return match ? match[0] : price;
}

export function disabledDate(current: Date) {
  return dayjs(current).isBefore(dayjs().subtract(1, 'day'));
}
