import React, { useState, useEffect } from 'react';

function InstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null);

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

  if (!installPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-purple-600 text-white p-4 rounded-lg shadow-lg">
      <p className="mb-2">Install Focus Timer for better experience!</p>
      <button 
        onClick={handleInstallClick}
        className="bg-white text-purple-600 px-4 py-2 rounded"
      >
        Install
      </button>
    </div>
  );
}

export default InstallPrompt;