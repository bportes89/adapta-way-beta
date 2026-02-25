export const formatCurrency = (value: number | string): string => {
  const num = Number(value);
  if (isNaN(num)) return 'R$ 0,00';
  const parts = num.toFixed(2).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `R$ ${parts.join(',')}`;
};

export const formatCurrencyInput = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  if (!digits) return '';
  const amount = Number(digits) / 100;
  return formatCurrency(amount);
};

export const parseCurrencyToNumber = (value: string): number => {
  if (!value) return 0;
  const digits = value.replace(/\D/g, "");
  return Number(digits) / 100;
};

export const formatNumber = (value: number | string): string => {
  const num = Number(value);
  if (isNaN(num)) return '0,00';
  const parts = num.toFixed(2).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return parts.join(',');
};

export const formatNumberInput = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  if (!digits) return '';
  const amount = Number(digits) / 100;
  return formatNumber(amount);
};
