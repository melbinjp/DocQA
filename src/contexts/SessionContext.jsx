import React, { createContext, useState, useEffect } from 'react';
import { createSession } from '../services/api';

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        let storedSessionId = localStorage.getItem('sessionId');
        if (!storedSessionId) {
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
  }, []);

  return (
    <SessionContext.Provider value={{ sessionId, loading }}>
      {children}
    </SessionContext.Provider>
  );
};
