
export interface MarketRates {
  selic: number;
  cdi: number;
  poupanca: number;
  fiiYield: number;
}

export const fetchCurrentRates = async (): Promise<MarketRates> => {
  // Conservative fallbacks based on current 2026 context
  // Return format:
  // - selic: % ao ano (e.g., 11.25 means 11.25% per year)
  // - cdi: % ao ano (e.g., 11.15 means 11.15% per year)
  // - poupanca: % ao mês (e.g., 0.5 means 0.5% per month)
  // - fiiYield: % ao mês (e.g., 0.88 means 0.88% per month)
  const fallback: MarketRates = {
    selic: 12.25,
    cdi: 12.15,
    poupanca: 0.5,
    fiiYield: 0.88,
  };

  try {
    // Series 432: Selic Meta (Taxa básica - % ao ano)
    // Note: Series 4391 (CDI acumulado no mês) returns partial monthly accumulation,
    // which is unreliable at the beginning of the month. We'll estimate CDI from Selic instead.
    const selicRes = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json');

    let currentSelic = fallback.selic;
    let currentCDI = fallback.cdi;

    if (selicRes.ok) {
      const data = await selicRes.json();
      if (data?.[0]?.valor) {
        currentSelic = parseFloat(data[0].valor.replace(',', '.'));
        // CDI typically tracks Selic very closely, usually 0.10% below
        currentCDI = currentSelic - 0.10;
      }
    }

    // TR (Taxa Referencial) is usually very low but exists. 
    // Poupança = 0.5% am + TR when Selic > 8.5%
    const monthlyPoupanca = 0.5;

    return {
      selic: currentSelic,
      cdi: currentCDI,
      poupanca: monthlyPoupanca,
      fiiYield: 0.88, // Realistic average for high-quality FIIs
    };
  } catch (error) {
    console.warn("Error fetching real-time BCB rates, using fallbacks.", error);
    return fallback;
  }
};
