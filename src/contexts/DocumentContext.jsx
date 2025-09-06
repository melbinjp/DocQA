import React, { useState, createContext } from 'react';

export const DocumentContext = createContext();

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
