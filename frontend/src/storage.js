export const storage = {
    saveSession(session) {
      const sessions = this.getSessions();
      sessions.push(session);
      localStorage.setItem('focus-sessions', JSON.stringify(sessions));
    },
  
    getSessions() {
      const sessions = localStorage.getItem('focus-sessions');
      return sessions ? JSON.parse(sessions) : [];
    },
  
    clearSessions() {
      localStorage.setItem('focus-sessions', JSON.stringify([]));
    }
  };