import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if user is on iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         (window.navigator as any).standalone === true;

    if (isIosDevice && !isStandalone) {
      setIsIOS(true);
      // Show iOS prompt after a short delay
      setTimeout(() => setShowPrompt(true), 3000);
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      // It's iOS, just dismiss the custom tooltip as they have to do it manually
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:w-80 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-[100] border border-gray-100 p-3 pr-8 animate-in slide-in-from-bottom-5">
      <button 
        onClick={() => setShowPrompt(false)}
        className="absolute top-3 right-2 text-gray-400 hover:text-gray-600 p-1"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="flex items-center">
        <div className="w-10 h-10 bg-blue-50/50 rounded-lg flex items-center justify-center shrink-0 mr-3 border border-blue-100">
          <Download className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-sm">Install JambPrep</h3>
          <p className="text-gray-500 text-xs mt-0.5 leading-snug mr-2">
            {isIOS 
              ? "Tap Share, then 'Add to Home Screen' to practice offline." 
              : "Install for offline practice."}
          </p>
        </div>
        {!isIOS && (
          <button 
            onClick={handleInstallClick}
            className="bg-blue-600 shrink-0 text-white font-bold py-1.5 px-3 rounded-lg text-xs shadow-sm hover:bg-blue-700 transition"
          >
            Install
          </button>
        )}
      </div>
    </div>
  );
}
