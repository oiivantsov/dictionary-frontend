import React from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../../context/LanguageContext';
import { useContext } from 'react';

const translations = {
  fi: {
    dictionary: "Sanakirja",
    search: "Hae sanoja",
    filter: "Suodatin",
    repeat: "Toista sanoja",
    statistics: "Tilastot",
  },
  ru: {
    dictionary: "Словарик",
    search: "Поиск слов",
    filter: "Фильтр",
    repeat: "Повторение слов",
    statistics: "Статистика",
  },
  en: {
    dictionary: "Dictionary",
    search: "Search Words",
    filter: "Filter",
    repeat: "Repeat Words",
    statistics: "Statistics",
  },
  
}

const Navbar = () => {

  const { language } = React.useContext(LanguageContext);
  const t = translations[language] || translations.fi;

  return (
    <div className="dropdown">
      <button className="dropdown-button">
        <div className="burger-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
      <div className="dropdown-content">
        <Link to="/">{t.dictionary}</Link>
        <Link to="/add-word">{t.search}</Link>
        <Link to="/search">{t.filter}</Link>
        <Link to="/repeat-words">{t.repeat}</Link>
        <Link to="/statistics">{t.statistics}</Link>
      </div>
    </div>
  );
};

export default Navbar;
