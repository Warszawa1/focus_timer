import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { api } from '../api';

function SessionHistory() {
  const [sessions, setSessions] = useState([]);

  const fetchSessions = async () => {
    try {
      const data = await api.getSessions();
      setSessions(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mt-8">
      <h2 className="font-medium mb-4">Previous Sessions</h2>
      <div className="space-y-3">
        {sessions.map((session) => (
          <div key={session.id} className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              <span>{session.title}</span>
            </div>
            <span className="text-gray-500">
              Today at {formatTime(session.start_time)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SessionHistory;