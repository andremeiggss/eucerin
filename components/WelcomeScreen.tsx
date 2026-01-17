import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center max-w-md mx-auto">
      <div className="mb-8 p-4 rounded-full bg-slate-100 ring-4 ring-slate-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#283545]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <h1 className="text-3xl font-light text-[#283545] mb-4">
        Análisis de <span className="font-bold">Imperfecciones</span>
      </h1>
      
      <p className="text-slate-600 mb-8 leading-relaxed">
        Detecta acné, marcas y exceso de grasa con nuestra IA. 
        Recibe una recomendación personalizada de la línea <strong>DermoPure</strong>.
      </p>

      <div className="bg-slate-100 p-4 rounded-lg mb-8 text-sm text-[#283545] text-left w-full">
        <p className="font-semibold mb-2">Qué analizamos:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Poros visibles y puntos negros.</li>
          <li>Brillo en zona T.</li>
          <li>Marcas post-acné.</li>
        </ul>
      </div>

      <button
        onClick={onStart}
        className="w-full py-4 bg-[#9e1e22] text-white rounded-md font-bold text-lg shadow-lg hover:bg-[#7a171a] transition-colors active:scale-95 uppercase tracking-wide"
      >
        Analizar mi Rostro
      </button>
      
      <p className="mt-6 text-xs text-slate-400">
        Este análisis es una recomendación cosmética y no reemplaza el diagnóstico de un dermatólogo profesional.
      </p>
    </div>
  );
};