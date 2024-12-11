import { saveSession, getSessions } from './db';

const API_URL = 'http://localhost:8000/api';

export const api = {
  async createSession(sessionData) {
    try {
      const response = await fetch(`${API_URL}/sessions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData)
      });
      return response.json();
    } catch (error) {
      // If offline, save to IndexedDB
      return saveSession(sessionData);
    }
  },

  async updateSession(sessionId, sessionData) {
    try {
      const response = await fetch(`${API_URL}/sessions/${sessionId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData)
      });
      return response.json();
    } catch (error) {
      // Handle offline case if needed
      console.error('Error updating session:', error);
      return null;
    }
  },

  async getSessions() {
    try {
      const response = await fetch(`${API_URL}/sessions/`);
      return response.json();
    } catch (error) {
      // If offline, get from IndexedDB
      return getSessions();
    }
  }
};