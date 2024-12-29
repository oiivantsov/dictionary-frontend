import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SearchWords from './pages/SearchWords';
import AddWordForm from './pages/AddWordForm';
import RepeatWords from './pages/RepeatWords';
import StatisticsPage from './pages/StatisticsPage';
import FilterWordsPage from './pages/FilterWordsPage';
import Navbar from './components/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Router>
      <div className={`App ${theme}`}>
        <div className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </div>

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
