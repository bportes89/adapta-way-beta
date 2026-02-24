export const formatCurrency = (value: number | string): string => {
  const num = Number(value);
  if (isNaN(num)) return 'R$ 0,00';
  const parts = num.toFixed(2).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `R$ ${parts.join(',')}`;
};

export const formatNumber = (value: number | string): string => {
  const num = Number(value);
  if (isNaN(num)) return '0,00';
  const parts = num.toFixed(2).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return parts.join(',');
};
