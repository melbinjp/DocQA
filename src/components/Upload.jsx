import React, { useState, useContext } from 'react';
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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleFileUpload = async () => {
    if (!file) {
      setMessage(t('upload.selectFile'));
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const response = await ingestFile(sessionId, file);
      addDocument({ ...response, name: file.name });
      setMessage(t('upload.successFile', { docId: response.doc_id }));
    } catch (error) {
      setMessage(t('upload.errorFile', { message: error.message }));
    } finally {
      setLoading(false);
    }
  };

  const handleUrlUpload = async () => {
    if (!url) {
      setMessage(t('upload.enterUrl'));
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const response = await ingestUrl(sessionId, url);
      addDocument({ ...response, name: url });
      setMessage(t('upload.successUrl', { docId: response.doc_id }));
    } catch (error) {
      setMessage(t('upload.errorUrl', { message: error.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-section">
      <h2>{t('upload.title')}</h2>
      <div className="upload-card">
        <h3>{t('upload.fileTitle')}</h3>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleFileUpload} disabled={loading}>
          {loading ? t('upload.uploading') : t('upload.uploadButton')}
        </button>
      </div>
      <div className="upload-card">
        <h3>{t('upload.urlTitle')}</h3>
        <input
          type="text"
          value={url}
          onChange={handleUrlChange}
          placeholder={t('upload.enterUrl')}
        />
        <button onClick={handleUrlUpload} disabled={loading}>
          {loading ? t('upload.ingesting') : t('upload.ingestButton')}
        </button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Upload;
