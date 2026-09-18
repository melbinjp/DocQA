import React, { useState, useContext, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SessionContext } from '../contexts/session-context';
import { DocumentContext } from '../contexts/document-context';
import { ingestFile, ingestUrl, deleteDocument } from '../services/api';
import { 
  NestedCirclesSign, 
  DocSign, 
  FolderSign, 
  LinkSign, 
  IngestSign, 
  OrbitSpinner, 
  CheckSign, 
  CloseSign, 
  AlertSign 
} from './Signs';

const EXAMPLE_URL = 'https://arxiv.org/pdf/1706.03762';
import './Upload.css';

const Upload = () => {
  const { sessionId } = useContext(SessionContext);
  const { 
    documents, 
    addDocument, 
    removeDocument, 
    setPendingCount, 
    setIsIngesting, 
    registerSubmitHandler 
  } = useContext(DocumentContext);
  const { t } = useTranslation();
  const [files, setFiles] = useState([]);
  const [urls, setUrls] = useState([]);
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [processResults, setProcessResults] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [deletingDocs, setDeletingDocs] = useState(new Set());
  const [deleteError, setDeleteError] = useState('');

  const handleDelete = async (docId) => {
    setDeletingDocs(prev => new Set([...prev, docId]));
    setDeleteError('');
    try {
      await deleteDocument(sessionId, docId);
      removeDocument(docId);
    } catch (err) {
      setDeleteError(`Failed to delete document: ${err.message}`);
    } finally {
      setDeletingDocs(prev => {
        const newSet = new Set(prev);
        newSet.delete(docId);
        return newSet;
      });
    }
  };

  const getDisplayName = (doc) => {
    if (doc.name) {
      if (doc.name.startsWith('http')) {
        try {
          const url = new URL(doc.name);
          return url.hostname + url.pathname;
        } catch {
          return doc.name;
        }
      }
      return doc.name;
    }
    return `Document ${doc.doc_id.substring(0, 8)}...`;
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const handleUrlInputChange = (e) => {
    const value = e.target.value;
    setUrlInput(value);
    
    // Parse comma-separated URLs
    const urlList = value.split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0);
    setUrls(urlList);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // A document that is on hand for everyone, so the demo is one click rather than
  // a hunt for a PDF. A real paper with real pages, because the thing worth showing
  // is that an answer names the page it came from.
  const useExampleUrl = () => {
    setUrlInput(EXAMPLE_URL);
    setUrls([EXAMPLE_URL]);
  };

  const removeUrl = (index) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
    setUrlInput(newUrls.join(', '));
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...droppedFiles]);
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

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const processWithRetry = async (processFunc, item, itemName, maxRetries = 2) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Processing ${itemName} (attempt ${attempt}), Session: ${sessionId}`);
        const response = await processFunc();
        return { success: true, response };
      } catch (error) {
        console.error(`Error processing ${itemName} (attempt ${attempt}):`, error);
        
        if (attempt === maxRetries) {
          return { 
            success: false, 
            error: error.response?.data?.detail || error.message 
          };
        }
        
        // Wait before retry (exponential backoff)
        await delay(1000 * attempt);
      }
    }
  };

  const handleSubmit = async () => {
    if (files.length === 0 && urls.length === 0) {
      showMessage(t('upload.selectFilesOrUrls'), 'error');
      return;
    }

    setLoading(true);
    setProcessResults([]);
    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    try {
      // Process files with delay
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          errors.push(`${file.name}: File too large (max 5MB)`);
          errorCount++;
          continue;
        }
        
        const result = await processWithRetry(
          () => ingestFile(sessionId, file),
          file,
          file.name
        );
        
        if (result.success) {
          addDocument({ ...result.response, name: file.name });
          successCount++;
          setProcessResults(prev => [...prev, {
            name: file.name,
            type: 'file',
            status: 'success',
            docId: result.response.doc_id
          }]);
        } else {
          errors.push(`${file.name}: ${result.error}`);
          errorCount++;
          setProcessResults(prev => [...prev, {
            name: file.name,
            type: 'file',
            status: 'error',
            error: result.error
          }]);
        }
        
        // Add delay between requests to avoid rate limiting
        if (i < files.length - 1 || urls.length > 0) {
          await delay(500);
        }
      }

      // Process URLs with delay
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          errors.push(`${url}: Invalid URL format`);
          errorCount++;
          continue;
        }
        
        const result = await processWithRetry(
          () => ingestUrl(sessionId, url),
          url,
          url
        );
        
        if (result.success) {
          addDocument({ ...result.response, name: url });
          successCount++;
          setProcessResults(prev => [...prev, {
            name: url,
            type: 'url',
            status: 'success',
            docId: result.response.doc_id
          }]);
        } else {
          errors.push(`${url}: ${result.error}`);
          errorCount++;
          setProcessResults(prev => [...prev, {
            name: url,
            type: 'url',
            status: 'error',
            error: result.error
          }]);
        }
        
        // Add delay between requests
        if (i < urls.length - 1) {
          await delay(500);
        }
      }

      // Show summary
      if (successCount > 0 && errorCount === 0) {
        showMessage(`All ${successCount} items processed successfully!`, 'success');
      } else if (successCount > 0 && errorCount > 0) {
        showMessage(`${successCount} succeeded, ${errorCount} failed`, 'error');
      } else if (errorCount > 0) {
        showMessage(`All ${errorCount} items failed`, 'error');
      }
      
      // Clear form only if all succeeded
      if (errorCount === 0) {
        setFiles([]);
        setUrls([]);
        setUrlInput('');
        if (successCount > 0) {
          setExpanded(false);
        }
      }
      
    } catch (error) {
      console.error('Unexpected error:', error);
      showMessage(`Unexpected error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (setPendingCount) {
      setPendingCount(files.length + urls.length);
    }
  }, [files.length, urls.length, setPendingCount]);

  useEffect(() => {
    if (setIsIngesting) {
      setIsIngesting(loading);
    }
  }, [loading, setIsIngesting]);

  const handleSubmitRef = useRef(handleSubmit);
  handleSubmitRef.current = handleSubmit;

  useEffect(() => {
    if (registerSubmitHandler) {
      registerSubmitHandler(() => {
        if (handleSubmitRef.current) {
          handleSubmitRef.current();
        }
      });
    }
  }, [registerSubmitHandler]);

  const pendingItemsCount = files.length + urls.length;

  return (
    <div className="document-deck">
      <div className="deck-header">
        <span className="deck-title">
          <NestedCirclesSign size={18} className="deck-concentric-icon" />
          <span>{t('documents.title')} ({documents.length})</span>
          {documents.length === 0 && (
            <span className="deck-step-badge"> • {t('upload.step1Title')}</span>
          )}
        </span>
        {documents.length > 0 && (
          <button 
            type="button"
            className="add-doc-toggle-btn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? t('upload.closeUploadForm') : t('upload.addDocument')}
          </button>
        )}
      </div>

      {deleteError && (
        <div className="status-message show error">
          <AlertSign size={15} /> <span>{deleteError}</span>
        </div>
      )}

      {message && (
        <div className={`status-message show ${messageType}`}>
          {messageType === 'success' && <CheckSign size={15} />}
          {messageType === 'error' && <AlertSign size={15} />}
          <span>{message}</span>
        </div>
      )}

      {/* When documents exist: show document chips */}
      {documents.length > 0 && (
        <div className="doc-chips">
          {documents.map((doc) => (
            <div className="doc-chip" key={doc.doc_id}>
              <DocSign size={13} className="doc-chip-icon" />
              <span className="doc-chip-name" title={doc.name}>{getDisplayName(doc)}</span>
              <span className="doc-chip-badge">{doc.num_chunks || 0} chunks</span>
              <button
                type="button"
                className="doc-chip-delete"
                onClick={() => handleDelete(doc.doc_id)}
                disabled={deletingDocs.has(doc.doc_id)}
                title={t('documents.deleteTitle')}
              >
                {deletingDocs.has(doc.doc_id) ? <OrbitSpinner size={12} /> : <CloseSign size={11} />}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Ingestion Strip: visible when 0 documents OR when expanded is toggled */}
      {(documents.length === 0 || expanded) && (
        <div className="ingestion-deck-body">
          <div className="ingestion-strip">
            {/* File slot */}
            <div 
              className={`deck-dropzone ${isDragOver ? 'dragover' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input 
                type="file" 
                id="fileInput" 
                style={{ display: 'none' }} 
                accept=".pdf,.docx,.txt,.xlsx,.csv,.pptx,.html,.htm,.md"
                multiple
                onChange={handleFileChange}
              />
              <button 
                type="button"
                className="deck-choose-btn" 
                onClick={() => document.getElementById('fileInput').click()}
              >
                <FolderSign size={15} />
                <span>{t('upload.chooseFiles')}</span>
              </button>
              <span className="deck-drop-hint">or drop files</span>
            </div>

            {/* URL slot */}
            <div className="deck-urlzone">
              <input 
                type="text" 
                value={urlInput}
                onChange={handleUrlInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                className="deck-url-input" 
                placeholder={t('upload.urlPlaceholder')}
              />
            </div>
          </div>

          {/* Selected files & URLs pills if pending */}
          {(files.length > 0 || urls.length > 0) && (
            <div className="pending-pills">
              {files.map((file, index) => (
                <div key={index} className="pending-pill file">
                  <DocSign size={13} />
                  <span>{file.name}</span>
                  <button type="button" onClick={() => removeFile(index)} title="Remove">
                    <CloseSign size={11} />
                  </button>
                </div>
              ))}
              {urls.map((url, index) => (
                <div key={index} className="pending-pill url">
                  <LinkSign size={13} />
                  <span>{url}</span>
                  <button type="button" onClick={() => removeUrl(index)} title="Remove">
                    <CloseSign size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Action Row: Demo Link + Submit Button */}
          <div className="deck-footer-row">
            <div className="url-example">
              {t('upload.tryExample')}{' '}
              <button type="button" className="link-button" onClick={useExampleUrl}>
                {t('upload.tryExampleName')}
              </button>
            </div>

            <div className="deck-submit-cluster">
              {pendingItemsCount > 0 && !loading && (
                <span className="deck-ready-hint">
                  {t('upload.readyHint')}
                </span>
              )}
              <button 
                type="button"
                className={`deck-submit-btn ${pendingItemsCount > 0 ? 'ready' : ''}`} 
                onClick={handleSubmit} 
                disabled={loading || pendingItemsCount === 0}
              >
                {loading ? (
                  <>
                    <OrbitSpinner size={14} />
                    <span>{t('upload.processing')}</span>
                  </>
                ) : pendingItemsCount > 0 ? (
                  <>
                    <IngestSign size={14} />
                    <span>{t('upload.ingestProcessCount', { count: pendingItemsCount })} →</span>
                  </>
                ) : (
                  <>
                    <IngestSign size={14} />
                    <span>{t('upload.ingestDocument')}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {processResults.length > 0 && (
            <div className="process-results">
              <h4>{t('upload.results')}</h4>
              {processResults.map((result, index) => (
                <div key={index} className={`result-item ${result.status}`}>
                  <div className="result-info">
                    <span className="result-icon">
                      {result.status === 'success' ? <CheckSign size={14} /> : <CloseSign size={14} />}
                    </span>
                    <span className="result-name">{result.name}</span>
                    <span className="result-type">({result.type})</span>
                  </div>
                  {result.status === 'success' && (
                    <span className="result-doc-id">ID: {result.docId}</span>
                  )}
                  {result.status === 'error' && (
                    <span className="result-error">{result.error}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Upload;