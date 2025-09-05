import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { SessionContext } from '../contexts/SessionContext';
import { query } from '../services/api';
import './Query.css';

const Query = () => {
  const { sessionId } = useContext(SessionContext);
  const { t } = useTranslation();
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleQueryChange = (e) => {
    setQ(e.target.value);
  };

  const handleQuery = async () => {
    if (!q) {
      setError(t('query.placeholder'));
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await query(sessionId, q);
      setResult(response);
    } catch (err) {
      setError(t('query.error', { message: err.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="query-section">
      <h2>{t('query.title')}</h2>
      <textarea
        value={q}
        onChange={handleQueryChange}
        placeholder={t('query.placeholder')}
        rows="4"
      />
      <button onClick={handleQuery} disabled={loading}>
        {loading ? t('query.searching') : t('query.submit')}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && (
        <div className="result-section">
          <h3>{t('query.answer')}</h3>
          <p>{result.answer}</p>
          {result.sources && result.sources.length > 0 && (
            <div>
              <h4>{t('query.sources')}</h4>
              <ul className="sources-list">
                {result.sources.map((source, index) => (
                  <li key={index}>
                    <p><strong>Source Text:</strong> {source.text}</p>
                    <p><em>(Confidence Score: {source.score.toFixed(2)}, Document ID: {source.doc_id})</em></p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Query;
