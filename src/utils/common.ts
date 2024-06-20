const priceConv = (ratio: number) => {
  return parseFloat((1000 / (500000 / ratio)).toFixed(6));
};

const quotaConv = (quota: number) => {
  return parseFloat((quota / 500000).toFixed(6));
};

export { priceConv, quotaConv };
