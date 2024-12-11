import React from 'react';
import { X } from 'lucide-react';

function DidYouKnow() {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 relative">
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <X size={16} />
      </button>
      <div className="text-sm font-medium mb-1">Did you know?</div>
      <div className="text-sm text-gray-500">
        It takes about 23 minutes to regain deep focus after an interruption
      </div>
    </div>
  );
}

export default DidYouKnow;