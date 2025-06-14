import React, { useState, useEffect, useCallback } from 'react';

const FullscreenEnterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
  </svg>
);

const FullscreenExitIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
  </svg>
);

const FullscreenButton: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(!!document.fullscreenElement);

  const handleFullscreenChange = useCallback(() => {
    setIsFullscreen(!!document.fullscreenElement);
  }, []);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [handleFullscreenChange]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
      } catch (err) {
        // @ts-ignore
        console.error(`Error al intentar activar pantalla completa: ${err.message} (${err.name})`);
      }
    } else {
      if (document.exitFullscreen) {
        try {
          await document.exitFullscreen();
        } catch (err) {
          // @ts-ignore
          console.error(`Error al intentar salir de pantalla completa: ${err.message} (${err.name})`);
        }
      }
    }
  };

  return (
    <button
      onClick={toggleFullscreen}
      className="fixed top-4 right-4 z-50 p-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg shadow-lg transition-colors duration-150"
      aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Entrar a pantalla completa'}
      title={isFullscreen ? 'Salir de pantalla completa' : 'Entrar a pantalla completa'}
    >
      {isFullscreen ? 
        <FullscreenExitIcon className="w-5 h-5 md:w-6 md:h-6" /> : 
        <FullscreenEnterIcon className="w-5 h-5 md:w-6 md:h-6" />}
    </button>
  );
};

export default FullscreenButton;
