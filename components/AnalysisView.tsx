import React, { useEffect, useState } from 'react';

export const AnalysisView: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-[#9e1e22] rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#283545] font-bold text-xl">{progress}%</span>
        </div>
      </div>
      
      <h2 className="text-2xl font-light text-[#283545] mb-2 animate-pulse">Analizando tu piel...</h2>
      <p className="text-slate-500 text-center max-w-xs">
        Nuestra IA está examinando la textura, los poros y el brillo de tu rostro.
      </p>
    </div>
  );
};