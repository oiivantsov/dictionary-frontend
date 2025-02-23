import React, { createContext, useState, useEffect } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('fi');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang) => {
    if (['fi', 'ru', 'en'].includes(lang)) {
      setLanguage(lang);
      localStorage.setItem('language', lang);
    } else {
      console.error('Unsupported language');
    }
  };

  const toggleLanguage = () => {
    const nextLanguage = language === 'fi' ? 'ru' : language === 'ru' ? 'en' : 'fi';
    setLanguage(nextLanguage);
    localStorage.setItem('language', nextLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};