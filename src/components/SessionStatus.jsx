import React, { useState, useEffect, useContext, useCallback } from 'react';
import { SessionContext } from '../contexts/session-context';
import { getSessionStatus, refreshSession } from '../services/api';
import './SessionStatus.css';

const SessionStatus = () => {
  const { sessionId } = useContext(SessionContext);
  const [status, setStatus] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // useCallback, keyed on sessionId, so the effect below can depend on it honestly.
  // Declaring [sessionId] while calling fetchStatus was a lie the linter caught: it
  // happened to work only because fetchStatus closes over the same sessionId. Without
  // the memo, listing fetchStatus in the deps would rebuild the interval on every
  // render, which is the trap this rule usually springs.
  const fetchStatus = useCallback(async () => {
    if (!sessionId) return;
    try {
      const statusData = await getSessionStatus(sessionId);
      setStatus(statusData);
    } catch (error) {
      console.error('Failed to fetch session status:', error);
    }
  }, [sessionId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshSession(sessionId);
      await fetchStatus();
    } catch (error) {
      console.error('Failed to refresh session:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [fetchStatus]);

  if (!status) return null;

  const isLowTime = status.remaining_minutes && status.remaining_minutes < 10;

  return (
    <div className={`session-status ${isLowTime ? 'warning' : ''}`}>
      <span className="session-info">
        ⏱️ {status.remaining_minutes ? `${Math.round(status.remaining_minutes)}m left` : 'Active'}
      </span>
      <button 
        className="refresh-btn" 
        onClick={handleRefresh}
        disabled={refreshing}
        title="Refresh session"
      >
        {refreshing ? '⏳' : '🔄'}
      </button>
    </div>
  );
};

export default SessionStatus;