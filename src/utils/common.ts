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
