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

  const handleQuery = async (question = q) => {
    if (!question) {
      setError(t('query.placeholder'));
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    setQ(question); // Set the input to the question being asked

    try {
      const response = await query(sessionId, question);
      setResult(response);
    } catch (err) {
      setError(t('query.error', { message: err.message }));
    } finally {
      setLoading(false);
    }
  };

  const exampleQuestions = [
    "What is the main topic of the document?",
    "Summarize the key findings.",
    "What are the main conclusions?",
  ];

  return (
    <div className="query-container">
      <div className="query-input-area">
        <textarea
          value={q}
          onChange={handleQueryChange}
          placeholder={t('query.placeholder')}
          rows="4"
          className="query-textarea"
        />
        <button onClick={() => handleQuery()} disabled={loading || !q} className="query-button">
          {loading ? t('query.searching') : t('query.submit')}
        </button>
      </div>

      <div className="example-questions">
        <h3>{t('query.examples')}</h3>
        <ul>
          {exampleQuestions.map((question, index) => (
            <li key={index} onClick={() => handleQuery(question)}>
              {question}
            </li>
          ))}
        </ul>
      </div>

      {loading && <div className="loader">{t('query.searching')}</div>}
      {error && <div className="error-message">{error}</div>}

      {result && (
        <div className="result-section card">
          <h3>{t('query.answer')}</h3>
          <p>{result.answer}</p>
          {result.sources && result.sources.length > 0 && (
            <div className="sources-section">
              <h4>{t('query.sources')}</h4>
              <ul className="sources-list">
                {result.sources.map((source, index) => (
                  <li key={index} className="source-item">
                    <p className="source-text">"{source.text}"</p>
                    <p className="source-meta">
                      (Confidence: {source.score.toFixed(2)}, Document: {source.doc_id})
                    </p>
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
