import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SearchWords from './pages/SearchWords';
import AddWordForm from './pages/AddWordForm';
import RepeatWords from './pages/RepeatWords';
import StatisticsPage from './pages/StatisticsPage';
import FilterWordsPage from './pages/FilterWordsPage';
import Navbar from './components/general/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { LanguageProvider, LanguageContext } from './context/LanguageContext';

const App = () => {
  return (
    <LanguageProvider> {/* ✅ Wrap the entire App in LanguageProvider */}
      <AppContent /> {/* ✅ Move context-dependent logic inside this new component */}
    </LanguageProvider>
  );
};

// ✅ New component where `useContext` is safely used inside `LanguageProvider`
const AppContent = () => {
  const [theme, setTheme] = useState('dark');
  const { language, setLanguage } = useContext(LanguageContext); // Now it's inside `LanguageProvider`

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Router>
      <div className={`App ${theme}`}>
        <div className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </div>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="language-toggle"
        >
          <option value="fi">FI</option>
          <option value="ru">RU</option>
          <option value="en">EN</option>
        </select>

        <Navbar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<SearchWords />} />
            <Route path="/add-word" element={<AddWordForm />} />
            <Route path="/search" element={<FilterWordsPage />} />
            <Route path="/repeat-words" element={<RepeatWords />} />
            <Route path="/statistics" element={<StatisticsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;