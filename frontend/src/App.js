import React, { useState } from 'react';
import './App.css';
import Timer from './components/Timer';
import FocusMode from './components/FocusMode';
import DidYouKnow from './components/DidYouKnow';
// import SessionHistory from './components/SessionHistory';
import FocusModeManager from './components/FocusModeManager';
import InstallPrompt from './components/InstallPrompt';
import OfflineIndicator from './components/OfflineIndicator';

function App() {
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const [setSessionHistoryKey] = useState(0);
  const [isTestingOffline, setIsTestingOffline] = useState(false);


  const refreshSessions = () => {
    setSessionHistoryKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">
        {/* <h1 className="text-2xl font-bold text-center mb-8">Focus Timer</h1> */}
        {process.env.NODE_ENV === 'development' && (
          <button
            onClick={() => setIsTestingOffline(!isTestingOffline)}
            className="mb-4 px-3 py-1 text-sm bg-gray-200 rounded"
          >
            {isTestingOffline ? 'Disable' : 'Enable'} Offline Testing
          </button>
        )}
        <Timer 
          onSessionComplete={refreshSessions}
          onFocusModeChange={setIsFocusModeActive}
        />
        <OfflineIndicator />
        <div className="mt-8">
          <DidYouKnow />
          <FocusMode />
          <InstallPrompt />
        </div>
        <FocusModeManager isActive={isFocusModeActive} />
      </div>
    </div>
  );
}

export default App;


