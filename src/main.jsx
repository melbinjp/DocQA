import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'
import './index.css'
import './i18n';
import { SessionProvider } from './contexts/SessionContext';
import { DocumentProvider } from './contexts/DocumentContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SessionProvider>
      <DocumentProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </DocumentProvider>
    </SessionProvider>
  </React.StrictMode>,
)
