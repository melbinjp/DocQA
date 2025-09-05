import React from 'react';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'ja', label: '日本語' },
    { value: 'ko', label: '한국어' },
    { value: 'zh', label: '中文' },
  ];

  const currentLanguage = languages.find(lang => lang.value === i18n.language);

  const changeLanguage = (selectedOption) => {
    i18n.changeLanguage(selectedOption.value);
  };

  return (
    <Select
      value={currentLanguage}
      onChange={changeLanguage}
      options={languages}
      isSearchable={true}
      placeholder="Select a language..."
    />
  );
};

export default LanguageSwitcher;
