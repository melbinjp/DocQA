import React, { useState, useEffect } from 'react';
import { ThemeSign } from './Signs';
import './ThemeSwitcher.css';

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState('system');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [theme]);

  const applyTheme = (selectedTheme) => {
    if (selectedTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', systemTheme);
    } else {
      document.documentElement.setAttribute('data-theme', selectedTheme);
    }
  };

  const toggleTheme = () => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const oppositeTheme = systemTheme === 'dark' ? 'light' : 'dark';
    
    const newTheme = theme === 'system' ? oppositeTheme : 'system';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  return (
    <button className="theme-toggle" onClick={toggleTheme} title={`Theme: ${theme}`}>
      <ThemeSign theme={theme} size={15} />
    </button>
  );
};

export default ThemeSwitcher;