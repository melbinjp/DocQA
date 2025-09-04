import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SessionContext } from '../contexts/SessionContext';
import { DocumentContext } from '../contexts/DocumentContext';
import { deleteDocument } from '../services/api';
import './Documents.css';

const Documents = () => {
  const { sessionId } = useContext(SessionContext);
  const { documents, removeDocument } = useContext(DocumentContext);
  const { t } = useTranslation();
  const [error, setError] = useState('');

  const handleDelete = async (docId) => {
    try {
      await deleteDocument(sessionId, docId);
      removeDocument(docId);
    } catch (err) {
      setError(t('documents.error', { message: err.message }));
    }
  };

  return (
    <div className="documents-section">
      <h2>{t('documents.title')}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {documents.length === 0 ? (
        <p>{t('documents.noDocuments')}</p>
      ) : (
        <ul className="documents-list">
          {documents.map((doc) => (
            <li className="document-item" key={doc.doc_id}>
              <span>{doc.name} (ID: {doc.doc_id})</span>
              <button onClick={() => handleDelete(doc.doc_id)}>{t('documents.delete')}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Documents;
