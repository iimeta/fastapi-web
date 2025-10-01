import dayjs from 'dayjs';

export function priceConv(ratio: number) {
  return parseFloat((1000 / (500000 / ratio)).toFixed(6)).toLocaleString(
    undefined,
    { maximumFractionDigits: 6 }
  );
}

export function quotaConv(quota: number) {
  return parseFloat((quota / 500000).toFixed(6)).toLocaleString(undefined, {
    maximumFractionDigits: 6,
  });
}

export function quotaConv4(quota: number) {
  return parseFloat((quota / 500000).toFixed(4)).toLocaleString(undefined, {
    maximumFractionDigits: 4,
  });
}

export function ratioConv(price: number) {
  return price * 500;
}

export function parserPrice(price: string) {
  // 使用正则匹配最多6位小数
  const match = price.match(/^(-?\d*)(\.\d{0,6})?/);
  return match ? match[0] : price;
}

export function disabledDate(current: Date) {
  return dayjs(current).isBefore(dayjs().subtract(1, 'day'));
}
