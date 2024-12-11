import React, { useEffect } from 'react';

function FocusModeManager({ isActive }) {
    useEffect(() => {
      if (isActive) {
        // Request notification permissions
        if ('Notification' in window) {
          Notification.requestPermission();
        }
  
        // Register service worker for notification blocking
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/service-worker.js');
        }
      }
    }, [isActive]);
  
    return null;
  }
  
  export default FocusModeManager;