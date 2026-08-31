import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n';
import { SessionProvider } from './contexts/SessionContext.jsx';
import { DocumentProvider } from './contexts/DocumentContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SessionProvider>
      <DocumentProvider>
        <App />
      </DocumentProvider>
    </SessionProvider>
  </React.StrictMode>,
)
