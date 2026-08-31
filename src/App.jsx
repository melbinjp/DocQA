import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Upload from './components/Upload';
import Query from './components/Query';
import Documents from './components/Documents';
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
  // is in, ask about it. The three tabs described one workflow as three places,
  // which meant the answer and the document it came from could never be on screen
  // together. Nothing was gained by hiding two thirds of a three-step task.
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

      <main className="single-page">
        <section id="upload" className="page-section">
          <Upload />
        </section>
        <section id="documents" className="page-section">
          <Documents />
        </section>
        <section id="query" className="page-section">
          <Query />
        </section>
      </main>
    </div>
  );
}

export default App;
