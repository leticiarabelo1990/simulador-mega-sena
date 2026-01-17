
import React, { useState } from 'react';
import InputView from './components/InputView';
import ResultsView from './components/ResultsView';

const App: React.FC = () => {
  const [amount, setAmount] = useState<number | null>(null);

  const handleSimulate = (value: number) => {
    setAmount(value);
  };

  const handleReset = () => {
    setAmount(null);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden">
      {amount === null ? (
        <InputView onSimulate={handleSimulate} />
      ) : (
        <ResultsView amount={amount} onReset={handleReset} />
      )}
    </div>
  );
};

export default App;
