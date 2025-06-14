import React, { useState, useEffect, useCallback } from 'react';

const EnterFullscreenIcon: React.FC = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 20 20" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="w-5 h-5"
  >
    <path d="M3 3h5M12 3h5M3 17h5M12 17h5M3 3v5M3 12v5M17 3v5M17 12v5" />
  </svg>
);

const ExitFullscreenIcon: React.FC = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 20 20" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="w-5 h-5"
  >
    <path d="M8 3H3v5M12 3H17v5M8 17H3v-5M12 17H17v-5" />
  </svg>
);

const FullscreenButton: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreenChange = useCallback(() => {
    setIsFullscreen(!!document.fullscreenElement);
  }, []);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [handleFullscreenChange]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
        .catch(err => console.error(`Error al intentar habilitar pantalla completa: ${err.message} (${err.name})`));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <button
      onClick={toggleFullscreen}
      className="fixed top-4 right-4 z-50 p-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-full shadow-lg transition-colors"
      title={isFullscreen ? 'Salir de pantalla completa' : 'Ver en pantalla completa'}
      aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Ver en pantalla completa'}
      aria-pressed={isFullscreen}
    >
      {isFullscreen ? <ExitFullscreenIcon /> : <EnterFullscreenIcon />}
    </button>
  );
};

export default FullscreenButton;