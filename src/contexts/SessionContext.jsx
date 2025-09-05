import React, { createContext, useState, useEffect } from 'react';
import { createSession } from '../services/api';

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSessionUpdate = () => {
    const newSessionId = localStorage.getItem('sessionId');
    console.log('Session context updated with new session ID:', newSessionId);
    setSessionId(newSessionId);
  };

  useEffect(() => {
    // Listener for session updates from the API service
    window.addEventListener('session-updated', handleSessionUpdate);

    const initializeSession = async () => {
      try {
        let storedSessionId = localStorage.getItem('sessionId');
        if (!storedSessionId) {
          console.log('No session ID found. Creating a new one.');
          const newSession = await createSession();
          storedSessionId = newSession.session_id;
          localStorage.setItem('sessionId', storedSessionId);
        }
        setSessionId(storedSessionId);
      } catch (error) {
        console.error('Failed to initialize session:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeSession();

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('session-updated', handleSessionUpdate);
    };
  }, []);

  return (
    <SessionContext.Provider value={{ sessionId, loading, setSessionId }}>
      {children}
    </SessionContext.Provider>
  );
};
