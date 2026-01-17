import React from 'react';
import { AnalysisResult } from '../types';

interface ResultsViewProps {
  result: AnalysisResult;
  onReset: () => void;
}

// Mapa de imágenes de productos (URLs con ?raw=true para asegurar que se vean)
const PRODUCT_IMAGES: Record<string, string> = {
  "Dermopure Clinic": "https://github.com/andremeiggss/henribarrett.site.io/blob/a6db4213329f2846e155d292ffac9a924940817c/images/logos/productos/dermopure_clinical.png?raw=true",
  "Dermopure Correcting Clear": "https://github.com/andremeiggss/henribarrett.site.io/blob/a6db4213329f2846e155d292ffac9a924940817c/images/logos/productos/dermopure_corretingclear.png?raw=true",
  "DermoPure Triple Acción": "https://github.com/andremeiggss/henribarrett.site.io/blob/a6db4213329f2846e155d292ffac9a924940817c/images/logos/productos/dermopure_tripleaccion.png?raw=true"
};

const DEFAULT_IMAGE = "https://github.com/andremeiggss/henribarrett.site.io/blob/a6db4213329f2846e155d292ffac9a924940817c/images/logos/productos/dermopure_tripleaccion.png?raw=true";

export const ResultsView: React.FC<ResultsViewProps> = ({ result, onReset }) => {
  // Obtener la imagen según el nombre del producto, o usar default si algo falla
  const productImageSrc = PRODUCT_IMAGES[result.productName] || DEFAULT_IMAGE;

  return (
    <div className="max-w-2xl mx-auto p-6 pb-20 bg-slate-50 min-h-full">
      
      {/* Disclaimer Banner */}
      <div className="bg-slate-100 border-l-4 border-[#283545] p-4 mb-6 rounded-r-lg shadow-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-[#283545]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-[#283545]">
              <span className="font-bold">Nota importante:</span> Para un diagnóstico clínico de acné, consulta a los especialistas en el evento.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mb-8">
        <p className="text-sm uppercase tracking-widest text-slate-500 mb-2">Diagnóstico de Imperfecciones</p>
        <h2 className="text-4xl font-light text-[#283545] mb-1">
          Piel <span className="font-bold">{result.skinType}</span>
        </h2>
        <div className="h-1 w-20 bg-[#9e1e22] mx-auto mb-6 rounded-full"></div>

        {/* Apuntes Marcados / Marked Notes */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm text-left max-w-sm mx-auto relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#9e1e22]"></div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Signos Detectados
          </h4>
          <ul className="space-y-3">
            {result.characteristics.map((char, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-700 text-sm">
                <span className="text-[#9e1e22] mt-0.5">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                   </svg>
                </span>
                <span className="font-medium">{char}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Hero Product Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden mb-8 transform transition-all hover:shadow-2xl">
        <div className="bg-[#9e1e22] text-white p-4 text-center">
          <h3 className="font-bold text-lg tracking-wide uppercase">Tu Aliado DermoPure®</h3>
        </div>
        <div className="p-6 text-center">
           
           {/* Product Image - Proportional to mobile screen */}
           <div className="mb-6 flex justify-center items-center h-48 sm:h-64">
              <img 
                src={productImageSrc} 
                alt={result.productName} 
                className="max-h-full max-w-full object-contain drop-shadow-xl"
              />
           </div>

           <h3 className="text-2xl font-bold text-[#283545] mb-2 leading-tight">{result.productName}</h3>
           <p className="text-slate-600 italic leading-relaxed text-sm px-2">"{result.productBenefit}"</p>
        </div>
        
        {/* Buy Button Section */}
        <div className="bg-slate-50 p-6 text-center border-t border-slate-100 flex flex-col gap-3">
           <button className="w-full bg-[#9e1e22] text-white font-bold py-3 px-4 rounded-full shadow-lg uppercase tracking-wide hover:bg-[#7a171a] transition-transform active:scale-95 flex items-center justify-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
             </svg>
             Comprar Ahora
           </button>
           
           <button className="text-slate-500 font-medium text-xs uppercase tracking-wide underline mt-2">
             Ver más detalles
           </button>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <h3 className="text-[#283545] font-bold text-lg mb-2 pl-1">Rutina Recomendada</h3>
        {result.routine.map((step, idx) => (
          <div key={idx} className="flex items-center bg-white p-4 rounded-lg shadow-sm border border-slate-100">
             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold mr-4 text-sm">
               {idx + 1}
             </div>
             <p className="text-slate-700 font-medium text-sm">{step}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onReset}
        className="w-full py-4 bg-white border-2 border-[#283545] text-[#283545] rounded-md font-bold text-lg hover:bg-slate-50 transition-colors uppercase tracking-wide"
      >
        Realizar Nuevo Análisis
      </button>
    </div>
  );
};