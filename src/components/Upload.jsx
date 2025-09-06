import React, { useState, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { SessionContext } from '../contexts/SessionContext';
import { DocumentContext } from '../contexts/DocumentContext';
import { ingestFile, ingestUrl } from '../services/api';
import './Upload.css';

const Upload = () => {
  const { sessionId } = useContext(SessionContext);
  const { addDocument } = useContext(DocumentContext);
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUrl('');
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    setFile(null);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setUrl('');
      e.dataTransfer.clearData();
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleSubmit = async () => {
    if (!file && !url) {
      setMessage(t('upload.selectFileOrUrl'));
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      let response;
      if (file) {
        response = await ingestFile(sessionId, file);
        addDocument({ ...response, name: file.name });
        setMessage(t('upload.successFile', { docId: response.doc_id }));
      } else {
        response = await ingestUrl(sessionId, url);
        addDocument({ ...response, name: url });
        setMessage(t('upload.successUrl', { docId: response.doc_id }));
      }
    } catch (error) {
      setMessage(t('upload.error', { message: error.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-section">
      <h2>{t('upload.title')}</h2>
      <div
        className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input type="file" id="file-upload" onChange={handleFileChange} style={{ display: 'none' }} />
        <label htmlFor="file-upload" className="upload-label">
          <p>{t('upload.dragAndDrop')}</p>
          <p>{file ? file.name : t('upload.orClick')}</p>
        </label>
        <p>{t('upload.or')}</p>
        <input
          type="text"
          value={url}
          onChange={handleUrlChange}
          placeholder={t('upload.enterUrl')}
          className="url-input"
        />
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? t('upload.processing') : t('upload.submit')}
        </button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};
