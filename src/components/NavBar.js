import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
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
        <Link to="/">Поиск слов</Link>
        <Link to="/add-word">Добавить слово</Link>
        <Link to="/search">Фильтр</Link>
        <Link to="/repeat-words">Повторение слов</Link>
        <Link to="/statistics">Статистика</Link>
      </div>
    </div>
  );
};

export default Navbar;
