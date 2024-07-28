const priceConv = (ratio: number) => {
  return parseFloat((1000 / (500000 / ratio)).toFixed(6));
};

const quotaConv = (quota: number) => {
  return parseFloat((quota / 500000).toFixed(6));
};

const quotaConv4 = (quota: number) => {
  return parseFloat((quota / 500000).toFixed(4));
};

export { priceConv, quotaConv, quotaConv4 };
