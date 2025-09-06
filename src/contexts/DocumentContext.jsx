import React, { useState } from 'react';
import { DocumentContext } from './documentContext.js';

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);

  const addDocument = (doc) => {
    setDocuments((prevDocs) => [...prevDocs, doc]);
  };

  const removeDocument = (docId) => {
    setDocuments((prevDocs) => prevDocs.filter((doc) => doc.doc_id !== docId));
  };

  return (
    <DocumentContext.Provider value={{ documents, addDocument, removeDocument }}>
      {children}
    </DocumentContext.Provider>
  );
};
