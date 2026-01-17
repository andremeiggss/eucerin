import React, { useState } from 'react';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { CameraView } from './components/CameraView';
import { AnalysisView } from './components/AnalysisView';
import { ResultsView } from './components/ResultsView';
import { analyzeSkinFromImage } from './services/geminiService';
import { AppState, AnalysisResult } from './types';

function App() {
  const [currentState, setCurrentState] = useState<AppState>(AppState.WELCOME);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStart = () => {
    setCurrentState(AppState.CAMERA);
    setErrorMsg(null);
  };

  const handleCapture = async (imageSrc: string) => {
    setCurrentState(AppState.ANALYZING);
    try {
      const minTimePromise = new Promise(resolve => setTimeout(resolve, 2000));
      const analysisPromise = analyzeSkinFromImage(imageSrc);
      
      const [_, result] = await Promise.all([minTimePromise, analysisPromise]);
      
      setAnalysisResult(result);
      setCurrentState(AppState.RESULTS);
    } catch (error) {
      console.error("Analysis failed:", error);
      setErrorMsg("No pudimos analizar la imagen. Por favor, intenta de nuevo.");
      setCurrentState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setCurrentState(AppState.WELCOME);
  };

  const handleRetake = () => {
    setErrorMsg(null);
    setCurrentState(AppState.CAMERA);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {currentState === AppState.WELCOME && (
          <WelcomeScreen onStart={handleStart} />
        )}

        {currentState === AppState.CAMERA && (
          <CameraView onCapture={handleCapture} onCancel={handleReset} />
        )}

        {currentState === AppState.ANALYZING && (
          <AnalysisView />
        )}

        {currentState === AppState.RESULTS && analysisResult && (
          <ResultsView result={analysisResult} onReset={handleReset} />
        )}

        {currentState === AppState.ERROR && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
             <div className="text-[#9e1e22] mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
             </div>
             <h2 className="text-xl font-bold text-slate-800 mb-2">Hubo un problema</h2>
             <p className="text-slate-600 mb-8">{errorMsg || "Ocurrió un error inesperado."}</p>
             <button 
                onClick={handleRetake}
                className="w-full py-3 bg-[#9e1e22] text-white rounded-md font-bold hover:bg-[#7a171a]"
              >
                Intentar de nuevo
              </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;