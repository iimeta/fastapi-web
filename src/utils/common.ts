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

export function parseDiscount(discount: string) {
  // 使用正则匹配最多2位小数
  const match = discount.match(/^(-?\d*)(\.\d{0,2})?/);
  return match ? match[0] : discount;
}

export function parsePrice(price: string) {
  // 使用正则匹配最多6位小数
  const match = price.match(/^(-?\d*)(\.\d{0,6})?/);
  return match ? match[0] : price;
}

export function parsePixelSize(value: any): number {
  if (value === undefined || value === null || value === '') {
    return 0;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? Math.round(value) : 0;
  }
  const s = String(value).trim().replace(/[×X*]/g, 'x');
  if (!s) {
    return 0;
  }
  const parts = s
    .split('x')
    .map((item) => item.trim())
    .filter((item) => item !== '');
  if (parts.length >= 2) {
    const w = Number(parts[0]);
    const h = Number(parts[1]);
    if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0) {
      return Math.round(w * h);
    }
  }
  const n = Number(s);
  return Number.isFinite(n) ? Math.round(n) : 0;
}

export function formatImageGenerationSize(pricing: {
  mode?: string;
  width?: any;
  height?: any;
  pixel_gte?: string;
  pixel_lte?: string;
}): string {
  if (pricing?.mode === 'pixel') {
    return `${pricing.pixel_gte || '-'} ~ ${pricing.pixel_lte || '-'}`;
  }
  return `${pricing?.width || '-'} × ${pricing?.height || '-'}`;
}

export function disabledDate(current: Date) {
  return dayjs(current).isBefore(dayjs().subtract(1, 'day'));
}

export function formatBytes(bytes: any, decimals?: number) {
  if (!bytes) {
    return '';
  }

  const k = 1024;
  const dm = !decimals || decimals < 0 ? 2 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

export function fmtTokens(v: number): string {
  const n = v || 0;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e4) return `${(n / 1e4).toFixed(2)}w`;
  if (n >= 100) return n.toFixed(2);
  return n.toFixed(6);
}

// 计数类数值：带千位符的整数，如 1,010,000
export function fmtCount(v: number): string {
  return Number(v || 0).toLocaleString('en-US');
}

// 货币类数值：整数部分带千位符，保留 6 位小数，如 1,010,000.123456
export function fmtMoney(v: number): string {
  return Number(v || 0).toLocaleString('en-US', {
    minimumFractionDigits: 6,
    maximumFractionDigits: 6,
  });
}
