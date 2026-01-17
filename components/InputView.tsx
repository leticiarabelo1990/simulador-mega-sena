
import React, { useState, useMemo } from 'react';
import { parseCurrencyString } from '../utils/formatters';

interface InputViewProps {
  onSimulate: (amount: number) => void;
}

const InputView: React.FC<InputViewProps> = ({ onSimulate }) => {
  const [inputValue, setInputValue] = useState('');

  const formatDisplay = (val: string) => {
    let digits = val.replace(/\D/g, '');
    if (!digits) return '';
    let num = parseInt(digits) / 100;
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(formatDisplay(e.target.value));
  };

  const handleSubmit = () => {
    const amount = parseCurrencyString(inputValue);
    if (amount > 0) {
      onSimulate(amount);
    }
  };

  // Improved dynamic font-size calculation to use 100% of screen width effectively
  const inputStyle = useMemo(() => {
    const len = inputValue.length || 4; // minimum width for '0,00'
    // Formula: (available vw / char count) * scaling factor
    // As characters increase, we reduce the font size to keep everything on one line.
    const calculatedSize = Math.min(20, 100 / (len * 0.7));
    return {
      fontSize: `${calculatedSize}vw`,
      maxWidth: '100vw'
    };
  }, [inputValue]);

  return (
    <div className="relative min-h-screen w-full bg-[#003a6e] overflow-hidden flex flex-col items-center justify-center p-0 m-0">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#005ca9] via-[#003a6e] to-[#020617] opacity-100"></div>

      <div className="w-full flex flex-col items-center text-center space-y-8 z-10 animate-in fade-in duration-500">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tighter drop-shadow-lg px-4">
          Se você ganhasse na <br />
          <span className="text-[#f39200] italic">Mega-Sena...</span>
        </h1>

        <div className="w-full flex flex-col items-center px-0">
          <div className="flex items-center justify-center w-full max-w-full overflow-hidden px-4">
            <span className="text-2xl sm:text-4xl md:text-6xl font-black text-[#f39200] mr-2 flex-shrink-0">R$</span>
            <input
              autoFocus
              className="bg-transparent border-none p-0 font-black text-white placeholder-white/10 focus:ring-0 focus:outline-none text-center selection:bg-[#f39200]/30 transition-all duration-150 leading-none whitespace-nowrap overflow-visible w-full"
              style={inputStyle}
              id="prizeValue"
              placeholder="0,00"
              type="text"
              value={inputValue}
              onChange={handleChange}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-10 bg-[#f39200] hover:bg-white hover:text-[#004279] active:scale-95 text-white font-black text-xl sm:text-2xl md:text-5xl px-12 sm:px-20 md:px-32 py-6 md:py-10 rounded-full transition-all duration-300 shadow-[0_40px_100px_-20px_rgba(243,146,0,0.6)] uppercase tracking-widest disabled:opacity-5 cursor-pointer"
          disabled={!inputValue || inputValue === '0,00'}
        >
          SIMULAR RENDA
        </button>
      </div>

      {/* Decorative Blur Spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-white/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#f39200]/5 rounded-full blur-[100px]"></div>
    </div>
  );
};

export default InputView;
