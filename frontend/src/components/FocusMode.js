import React from 'react';
import { Brain } from 'lucide-react';

function FocusMode() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="flex items-center gap-2 text-gray-600">
        <Brain size={18} />
        <span className="text-sm font-medium">Focused Mode Will:</span>
      </div>
      <div className="text-sm text-gray-500 mt-1">
        Block notifications • Pause messages • Allow only emergency calls
      </div>
    </div>
  );
}

export default FocusMode;