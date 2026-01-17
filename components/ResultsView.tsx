

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { formatBRL, formatCompactBRL } from '../utils/formatters';
import { fetchCurrentRates, MarketRates } from '../utils/api';

interface ResultsViewProps {
  amount: number;
  onReset: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ amount, onReset }) => {
  // Initialize with fallback values for instant display, then update with real data
  const [rates, setRates] = useState<MarketRates>({
    selic: 12.25,
    cdi: 12.15,
    poupanca: 0.5,
    fiiYield: 0.88,
  });
  const [scrollY, setScrollY] = useState(0);

  // Dynamic font-size calculation for header to prevent overflow
  const headerStyle = useMemo(() => {
    const formattedValue = formatBRL(amount);
    const len = formattedValue.length;
    // Much more aggressive scaling for very large numbers
    // For reference: 
    // - R$ 100.000,00 = 14 chars -> ~9.3vw
    // - R$ 100.000.000,00 = 18 chars -> ~6.2vw
    // - R$ 1.000.000.000,00 = 20 chars -> ~5.5vw
    const calculatedSize = Math.min(13, Math.max(3, 110 / (len * 0.9)));
    return {
      fontSize: `${calculatedSize}vw`
    };
  }, [amount]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadRates = async () => {
      const currentRates = await fetchCurrentRates();
      setRates(currentRates);
    };
    loadRates();

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const calculateYield = (id: string) => {
    // IR for long-term investments (>720 days): 15%
    // For "living off income" simulations, we assume long-term holdings
    const taxFactor = 0.85;

    switch (id) {
      case 'poupanca':
        // rates.poupanca is already in % per month (e.g., 0.5)
        return amount * (rates.poupanca / 100);
      case 'selic':
        // rates.selic is in % per year (e.g., 11.25)
        // Convert annual to monthly: (1 + i_a)^(1/12) - 1
        const monthlySelic = Math.pow(1 + rates.selic / 100, 1 / 12) - 1;
        return (amount * monthlySelic) * taxFactor;
      case 'nubank':
        // rates.cdi is in % per year (e.g., 11.15)
        // Convert annual to monthly: (1 + i_a)^(1/12) - 1
        const monthlyCDI = Math.pow(1 + rates.cdi / 100, 1 / 12) - 1;
        return (amount * monthlyCDI) * taxFactor;
      case 'fiis':
        // rates.fiiYield is already in % per month (e.g., 0.88)
        // FIIs are tax-exempt for individuals
        return amount * (rates.fiiYield / 100);
      default: return 0;
    }
  };

  const investments = [
    {
      id: 'poupanca',
      name: 'Poupança',
      icon: 'savings',
      color: '#005295',
      desc: 'Isenta de Imposto de Renda. Liquidez imediata, mas o menor rendimento da lista.',
      rate: `${rates.poupanca}% am`
    },
    {
      id: 'selic',
      name: 'Tesouro Selic',
      icon: 'account_balance_wallet',
      color: '#004279',
      desc: 'O investimento mais seguro do Brasil. Emprestado diretamente para o Governo Federal.',
      rate: `${rates.selic.toFixed(2)}% aa`
    },
    {
      id: 'nubank',
      name: 'Caixinha / Porquinho',
      icon: 'payments',
      color: '#00315c',
      desc: '100% do CDI (Nubank, Inter, Itaú). Praticidade com rendimento diário superior à poupança.',
      rate: `${rates.cdi.toFixed(2)}% aa`
    },
    {
      id: 'fiis',
      name: 'Fundos Imobiliários',
      icon: 'apartment',
      color: '#00213f',
      desc: 'Receba "aluguéis" mensais isentos de IR. Viver de renda com imóveis sem burocracia.',
      rate: `${rates.fiiYield}% am`
    },
  ];

  return (
    <div className="relative bg-[#020617]">
      {/* GLOBAL PARALLAX DECORATIONS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute text-white/[0.03] text-[40rem] font-black leading-none select-none italic"
          style={{ top: '10%', left: '-10%', transform: `translateY(${scrollY * -0.15}px) rotate(-10deg)` }}
        >
          R$
        </div>
        <div
          className="absolute text-[#f39200]/[0.06] select-none"
          style={{ top: '60%', right: '5%', transform: `translateY(${scrollY * -0.6}px)` }}
        >
          <span className="material-icons-outlined text-[30rem]">monetization_on</span>
        </div>
        <div
          className="absolute w-[80vw] h-[80vw] bg-blue-500/5 rounded-full blur-[200px]"
          style={{ top: '30%', left: '50%', transform: `translate(-50%, ${scrollY * -0.3}px)` }}
        ></div>
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center relative bg-transparent px-6 text-center z-10">
        <div className="animate-in fade-in slide-in-from-top-20 duration-1000">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-black text-blue-200/50 mb-6 tracking-[0.5em] uppercase">Simulação de Renda</h1>
          <div
            className="font-black text-white mb-10 tracking-tighter leading-none drop-shadow-2xl"
            style={headerStyle}
          >
            {formatBRL(amount).split(',')[0]}<span className="text-[#f39200] text-glow">,00</span>
          </div>
          <p className="text-xl sm:text-3xl md:text-5xl text-blue-100/60 max-w-5xl mx-auto font-light leading-tight">
            Descubra quanto esse prêmio depositaria na sua conta todos os meses.
          </p>
          <div className="mt-32 animate-bounce">
            <span className="material-icons-outlined text-6xl text-white/20">expand_more</span>
          </div>
        </div>
      </section>

      {/* Investment Sections */}
      {investments.map((inv, idx) => (
        <section
          key={inv.id}
          style={{ backgroundColor: inv.color }}
          className="min-h-screen flex flex-col items-center justify-center sticky top-0 border-t border-white/5 px-6 py-20 z-20 shadow-[0_-50px_100px_rgba(0,0,0,0.5)] transition-all duration-700 ease-in-out overflow-hidden"
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-[50vw] font-black select-none"
            style={{ transform: `translateY(${(scrollY - (idx + 1) * window.innerHeight) * 0.1}px)` }}>
            {idx + 1}
          </div>

          <div className="max-w-7xl w-full grid md:grid-cols-2 gap-16 items-center relative z-10">
            <div className={`space-y-12 transition-all duration-1000 delay-200 transform ${idx % 2 !== 0 ? 'md:order-2' : ''}`}>
              <div className="flex items-center space-x-10 group">
                <div className="w-32 h-32 rounded-[2.5rem] bg-white/10 flex items-center justify-center backdrop-blur-3xl border border-white/20 shadow-2xl transition-transform duration-500 group-hover:scale-110">
                  <span className="material-icons-outlined text-8xl text-white">{inv.icon}</span>
                </div>
                <div>
                  <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none mb-2">{inv.name}</h2>
                  <div className="inline-block bg-[#f39200] text-[#020617] font-black text-xl px-6 py-2 rounded-2xl shadow-xl">
                    {inv.rate}
                  </div>
                </div>
              </div>
              <p className="text-blue-50/70 text-2xl md:text-4xl leading-relaxed font-light">
                {inv.desc}
              </p>
            </div>

            <div className={`text-center md:text-right ${idx % 2 !== 0 ? 'md:text-left md:order-1' : ''}`}>
              <span className="block text-white/30 text-xl md:text-3xl mb-4 font-black uppercase tracking-[0.5em]">Rendimento Mensal</span>
              <span className="block text-7xl sm:text-8xl md:text-[11vw] font-black text-[#f39200] tracking-tighter text-glow drop-shadow-2xl leading-none">
                {formatCompactBRL(calculateYield(inv.id))}
              </span>
              <p className="text-white/20 mt-14 text-lg italic">Fonte: Banco Central do Brasil (SGS)</p>
            </div>
          </div>
        </section>
      ))}

      {/* FINAL SECTION */}
      <footer className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-white px-6 border-t border-white/10 z-30 relative shadow-[0_-100px_100px_rgba(0,0,0,0.8)]">
        <div className="max-w-6xl w-full text-center space-y-24">
          <div className="space-y-6">
            <h3 className="text-7xl sm:text-8xl md:text-[13vw] font-black tracking-tighter leading-[0.8] italic uppercase">
              VIVA DE <br /> <span className="text-[#f39200]">RENDA</span>.
            </h3>
            <p className="text-2xl md:text-5xl text-white/30 font-thin tracking-tight leading-tight">
              Sua liberdade financeira começa com um clique. <br />
              Em FIIs, você receberia cerca de <strong className="text-white font-black">{formatBRL(calculateYield('fiis'))}</strong> extra todo mês.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-10">
            <button
              onClick={onReset}
              className="group flex items-center justify-center space-x-6 bg-[#f39200] text-white px-20 md:px-32 py-10 md:py-14 rounded-full font-black text-3xl md:text-5xl transition-all transform hover:scale-105 hover:bg-white hover:text-[#020617] active:scale-95 shadow-[0_50px_120px_-30px_rgba(243,146,0,0.6)] cursor-pointer"
            >
              <span className="material-icons-outlined text-4xl md:text-6xl group-hover:rotate-180 transition-transform duration-1000">refresh</span>
              <span>NOVA SIMULAÇÃO</span>
            </button>
          </div>

          <div className="pt-32 opacity-10 text-xs md:text-sm font-black tracking-[1.5em] uppercase">
            Dados financeiros atualizados via BCB • 2024
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ResultsView;
