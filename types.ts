
export interface InvestmentOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  rateLabel: string;
  calcYield: (amount: number) => number;
  footerLabel: string;
  color: string;
}
