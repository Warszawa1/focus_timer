import React, { useState, useEffect } from 'react';

function InstallPrompt() {
    const [installPrompt, setInstallPrompt] = useState(null);
    const [dismissed, setDismissed] = useState(false);
  
    useEffect(() => {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        setInstallPrompt(e);
      });
    }, []);
  
    const handleInstallClick = () => {
      if (installPrompt) {
        installPrompt.prompt();
        installPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          }
          setInstallPrompt(null);
        });
      }
    };
  
    if (!installPrompt || dismissed) return null;
  
    return (
      <div className="fixed bottom-4 left-4 right-4 max-w-sm mx-auto bg-white border border-purple-200 p-3 rounded-lg shadow-sm flex items-center justify-between">
        <p className="text-sm text-gray-600">Install app for offline use</p>
        <div className="flex gap-2">
          <button 
            onClick={() => setDismissed(true)}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            Not now
          </button>
          <button 
            onClick={handleInstallClick}
            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            Install
          </button>
        </div>
      </div>
    );
  }

export default InstallPrompt;