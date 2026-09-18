import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const languageMap = {
  en: {
    short: 'EN',
    full: 'English',
  },
  es: {
    short: 'ES',
    full: 'Español',
  },
};

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const currentLang = (i18n.language || 'en').split('-')[0];
  const currentInfo = languageMap[currentLang] || languageMap.en;

  return (
    <div className="language-switcher">
      <button className="language-switcher-button" onClick={() => setIsOpen(!isOpen)}>
        <span className="globe-icon">🌐</span>
        {!isOpen && <span className="language-short">{currentInfo.short}</span>}
        {isOpen && <span className="language-full">{currentInfo.full}</span>}
      </button>
      {isOpen && (
        <div className="language-options">
          <button onClick={() => changeLanguage('en')}>English</button>
          <button onClick={() => changeLanguage('es')}>Español</button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
