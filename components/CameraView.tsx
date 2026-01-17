import React, { useRef, useEffect, useState, useCallback } from 'react';

interface CameraViewProps {
  onCapture: (imageSrc: string) => void;
  onCancel: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showFlash, setShowFlash] = useState(false);
  
  // 0: Loading, 1: Scanning Face, 2: Analyzing Imperfections, 3: Hold Still, 4: Countdown
  const [scanStep, setScanStep] = useState(0);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
           videoRef.current?.play();
           setIsCameraReady(true);
           // We do not start countdown here anymore, we wait for the effect sequence
        };
      }
      setHasPermission(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setHasPermission(false);
    }
  }, []);

  useEffect(() => {
    startCamera();
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  // Scanning Sequence Logic
  useEffect(() => {
    if (!isCameraReady) return;

    // Sequence of messages/states
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Step 1: Start "Scanning Face" immediately after camera is ready
    setScanStep(1);

    // Step 2: "Analyzing Imperfections" after 2.5 seconds
    timers.push(setTimeout(() => {
      setScanStep(2);
    }, 2500));

    // Step 3: "Don't Move" after another 2 seconds
    timers.push(setTimeout(() => {
      setScanStep(3);
    }, 4500));

    // Step 4: Start Countdown after another 1.5 seconds
    timers.push(setTimeout(() => {
      setScanStep(4);
      setCountdown(3);
    }, 6000));

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [isCameraReady]);

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      // Trigger Flash Effect
      setShowFlash(true);

      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageSrc = canvas.toDataURL('image/jpeg', 0.85);
        
        // Short delay to let the flash animation play before changing state
        setTimeout(() => {
          onCapture(imageSrc);
        }, 300);
      }
    }
  }, [onCapture]);

  // Countdown Logic
  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      captureImage();
    }
  }, [countdown, captureImage]);

  if (hasPermission === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Acceso a cámara denegado</h2>
        <button onClick={onCancel} className="text-[#283545] underline">Volver al inicio</button>
      </div>
    );
  }

  // Helper to render text based on step
  const getStatusMessage = () => {
    switch(scanStep) {
      case 1: return "Escaneando rostro...";
      case 2: return "Analizando imperfecciones...";
      case 3: return "¡No te muevas!";
      default: return "";
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-80px)] bg-black overflow-hidden flex flex-col items-center justify-center">
      {/* Flash Effect Overlay */}
      <div className={`absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-300 ${showFlash ? 'opacity-100' : 'opacity-0'}`} />

      {/* Video Stream */}
      <video 
        ref={videoRef} 
        className="absolute min-w-full min-h-full object-cover transform -scale-x-100 opacity-100" 
        playsInline 
        muted 
      />
      
      <canvas ref={canvasRef} className="hidden" />

      {/* Overlay UI */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center">
        
        {/* Face Guide Circle with Scanning Animation */}
        <div className="relative w-72 h-96">
            <div className={`absolute inset-0 border-2 rounded-[50%] box-border shadow-[0_0_100px_rgba(0,0,0,0.5)_inset] transition-colors duration-500
              ${scanStep === 3 ? 'border-[#9e1e22]' : 'border-white/30'}
            `}></div>
            
            {/* Scanning Line Animation */}
            {(scanStep === 1 || scanStep === 2) && (
              <div className="absolute w-full h-1 bg-[#9e1e22]/80 shadow-[0_0_15px_rgba(158,30,34,0.8)] animate-[scan_3s_ease-in-out_infinite] top-0 left-0 rounded-full"></div>
            )}
        </div>

        {/* Status Messages */}
        <div className="absolute top-[65%] w-full text-center px-4">
            {/* Loading Spinner for Step 0 */}
            {!isCameraReady && (
              <div className="flex flex-col items-center justify-center mb-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white mb-4"></div>
                <p className="text-white font-medium text-lg">Iniciando cámara...</p>
                <p className="text-white/80 text-sm mt-2">Por favor permite el acceso</p>
              </div>
            )}

            {/* Step Messages */}
            {isCameraReady && scanStep > 0 && scanStep < 4 && (
              <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-xl inline-block animate-fade-in-up">
                 <p className="text-white font-bold text-xl tracking-wide uppercase">
                    {getStatusMessage()}
                 </p>
                 {scanStep === 2 && (
                   <p className="text-white/70 text-sm mt-1">Detectando zonas grasas...</p>
                 )}
              </div>
            )}
        </div>

        {/* Countdown Display */}
        {countdown !== null && countdown > 0 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 animate-bounce">
            <span className="text-9xl font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
              {countdown}
            </span>
          </div>
        )}
      </div>

      {/* Cancel Button */}
      <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center">
        <button 
          onClick={onCancel}
          className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full hover:bg-white/30 transition-colors text-sm font-medium"
        >
          Cancelar
        </button>
      </div>

      {/* Global Styles for Scanner Animation */}
      <style>{`
        @keyframes scan {
          0% { top: 10%; opacity: 0; }
          10% { opacity: 1; }
          50% { top: 90%; opacity: 1; }
          90% { opacity: 1; }
          100% { top: 10%; opacity: 0; }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};