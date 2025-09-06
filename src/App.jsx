import React, { useContext } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Upload from './components/Upload';
import Query from './components/Query';
import Documents from './components/Documents';
import { SessionContext } from './contexts/SessionContext';
import LanguageSwitcher from './components/LanguageSwitcher';
import ThemeSwitcher from './components/ThemeSwitcher';
import SessionStatus from './components/SessionStatus';

function App() {
  const { sessionId, loading } = useContext(SessionContext);
  const { t } = useTranslation();

  if (loading) {
    return <div className="container">{t('session.loading')}</div>;
  }

  return (
    <div className="container">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>📄 Chat with a Doc</h1>
            <p>Upload documents and chat with them using AI-powered search</p>
          </div>
          <div className="header-controls">
            <SessionStatus />
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      </header>
      <nav>
        <ul>
          <li>
            <NavLink to="/">{t('nav.upload')}</NavLink>
          </li>
          <li>
            <NavLink to="/query">{t('nav.query')}</NavLink>
          </li>
          <li>
            <NavLink to="/documents">{t('nav.documents')}</NavLink>
          </li>
        </ul>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Upload />} />
          <Route path="/query" element={<Query />} />
          <Route path="/documents" element={<Documents />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
