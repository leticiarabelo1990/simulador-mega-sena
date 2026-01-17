
export const formatBRL = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value);
};

export const formatCompactBRL = (value: number): string => {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} Mi`;
  }
  if (value >= 1000) {
    return `R$ ${(value / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}k`;
  }
  return formatBRL(value);
};

export const parseCurrencyString = (str: string): number => {
  const digits = str.replace(/\D/g, '');
  if (!digits) return 0;
  return parseInt(digits) / 100;
};
