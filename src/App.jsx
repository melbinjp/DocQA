import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Upload from './components/Upload';
import Query from './components/Query';
import { SessionContext } from './contexts/session-context';
import LanguageSwitcher from './components/LanguageSwitcher';
import ThemeSwitcher from './components/ThemeSwitcher';
import SessionStatus from './components/SessionStatus';

function App() {
  const { loading } = useContext(SessionContext);
  const { t } = useTranslation();

  if (loading) {
    return <div className="container">{t('session.loading')}</div>;
  }

  // One page, in the order the work actually happens: put a document in, see what
  // is in, ask about it. When documents are active, upload collapses into a compact
  // document bar so the query, answer, and sources take the stage together.
  return (
    <div className="container">
      <header className="header">
        <div className="header-content">
          <div className="header-brand">
            <h1>📄 Chat with a Doc</h1>
          </div>
          <div className="header-controls">
            <SessionStatus />
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="single-page">
        <section id="upload" className="page-section">
          <Upload />
        </section>
        <section id="query" className="page-section">
          <Query />
        </section>
      </main>
    </div>
  );
}

export default App;
