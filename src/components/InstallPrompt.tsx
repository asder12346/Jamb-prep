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
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-96 bg-white rounded-2xl shadow-2xl z-[100] border border-blue-100 p-5 animate-in slide-in-from-bottom-5">
      <button 
        onClick={() => setShowPrompt(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full p-1"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="flex items-start">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 mr-4 shadow-lg shadow-blue-500/30">
          <Download className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Install JambPrep</h3>
          <p className="text-gray-600 text-sm mt-1 leading-relaxed">
            {isIOS 
              ? "Install this app on your iPhone: tap the Share button and then 'Add to Home Screen' to study offline." 
              : "Install our app to your device for easy access and offline practice."}
          </p>
          
          {!isIOS && (
            <button 
              onClick={handleInstallClick}
              className="mt-4 bg-blue-600 text-white font-bold py-2 px-6 rounded-xl text-sm shadow-md hover:bg-blue-700 transition w-full"
            >
              Install App
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
