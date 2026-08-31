import React, { useState, useEffect, useContext } from 'react';
import { DocumentContext } from './document-context';
import { SessionContext } from './session-context';

const STORAGE_KEY = 'docqa-documents';

export const DocumentProvider = ({ children }) => {
  const { sessionId } = useContext(SessionContext);
  const [documents, setDocuments] = useState([]);

  // Documents are stored against the session they were ingested into, because
  // that is the only session they exist in.
  //
  // Before this, the list was persisted on its own. Server sessions expire after
  // fifteen minutes, so reopening the app showed documents that were gone: the
  // sidebar listed a PDF with its chunk count, and asking about it returned
  // "No relevant information found" or a raw "User session not found". The list
  // outlived the thing it described, which is the worst kind of stale UI because
  // it looks like it is working.
  useEffect(() => {
    if (!sessionId) return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setDocuments([]);
      return;
    }
    try {
      const parsed = JSON.parse(saved);
      // Anything without a matching sessionId belongs to a session that is gone,
      // including the older un-keyed array format.
      if (parsed && parsed.sessionId === sessionId && Array.isArray(parsed.documents)) {
        setDocuments(parsed.documents);
      } else {
        setDocuments([]);
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      setDocuments([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [sessionId]);

  const saveToStorage = (docs) => {
    if (!sessionId) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ sessionId, documents: docs }));
  };

  const addDocument = (doc) => {
    const newDocs = [...documents, doc];
    setDocuments(newDocs);
    saveToStorage(newDocs);
  };

  const removeDocument = (docId) => {
    const newDocs = documents.filter((doc) => doc.doc_id !== docId);
    setDocuments(newDocs);
    saveToStorage(newDocs);
  };

  return (
    <DocumentContext.Provider value={{ documents, addDocument, removeDocument }}>
      {children}
    </DocumentContext.Provider>
  );
};
