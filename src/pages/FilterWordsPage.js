import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

import EditWord from '../components/general/EditWord';
import Filters from '../components/filter/Filters';
import WordsList from '../components/filter/WordsList';
import { LanguageContext } from '../context/LanguageContext';

const translations = {
  fi: {
    filter: "Suodatin",
    wordsFound: "Löydettyjä sanoja",
    newDate: "Uusi päivämäärä",
    newLevel: "Uusi taso",
    updateLevel: "Päivitä taso",
    updateLevelCount: (count) => `Päivitä taso (${count})`,
    scrollTop: "Takaisin ylös",
    errorLoadingWords: "Virhe sanojen lataamisessa",
    errorUpdatingWords: "Virhe päivitettäessä valittuja sanoja",
    editWord: "Muokkaa sanaa",
  },
  ru: {
    filter: "Фильтр",
    wordsFound: "Найдено слов",
    newDate: "Новая дата",
    newLevel: "Новый уровень",
    updateLevel: "Обновить уровень",
    updateLevelCount: (count) => `Обновить уровень (${count})`,
    scrollTop: "Наверх",
    errorLoadingWords: "Ошибка при загрузке слов",
    errorUpdatingWords: "Ошибка при обновлении выбранных слов",
    editWord: "Редактировать слово",
  },
  en: {
    filter: "Filter",
    wordsFound: "Words found",
    newDate: "New date",
    newLevel: "New level",
    updateLevel: "Update level",
    updateLevelCount: (count) => `Update level (${count})`,
    scrollTop: "Scroll to top",
    errorLoadingWords: "Error loading words",
    errorUpdatingWords: "Error updating selected words",
    editWord: "Edit word",
  },
};

const FilterWordsPage = () => {

  const [words, setWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null); // Для редактирования слова
  const [newLevel, setNewLevel] = useState(1);
  const [selectedRepeatDate, setSelectedRepeatDate] = useState(new Date().toISOString().split('T')[0]); // Дефолтная сегодняшняя дата
  const [showTopButton, setShowTopButton] = useState(false);
  const [selectedWords, setSelectedWords] = useState([]); // Track selected words to update their level
  const { language } = useContext(LanguageContext);
  const t = translations[language] || translations.fi;

  const [filters, setFilters] = useState({
    daysSinceLastRepeat: '',
    level: '',
    popularity: '',
    frequency: '',
    source: '',
    category1: '',
    category2: '',
    repeatAgain: ''
  });

  const fetchFilteredWords = async () => {
    try {
      const filtersWithNulls = Object.fromEntries(
        Object.entries(filters).map(([key, value]) => [key, value === '' ? null : value])
      );

      const response = await axios.get('/fi/api/words/filter', {
        params: filtersWithNulls
      });
      setWords(response.data);
    } catch (error) {
      console.error(t.errorLoadingWords, error);
    }
  };

  const handleUpdateSelectedWords = async () => {
    try {
      const ids = selectedWords.map((word) => word.id);
      const payload = {
        ids,
        level: newLevel, // Set your desired level
        date_repeated: selectedRepeatDate,
      };

      console.log(payload);

      await axios.post('/api/words/bulk-update-level', payload);

      fetchFilteredWords(); // Refresh the list after update
      setSelectedWords([]); // Clear selected words
    } catch (error) {
      console.error(t.errorUpdatingWords, error);
    }
  };


  const handleEditWord = (word) => {
    console.log(word)
    setSelectedWord(word);
  };

  const handleScroll = () => {
    if (window.scrollY > 200) {
      setShowTopButton(true);
    } else {
      setShowTopButton(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <div className="container mt-5">
      <h2>{t.filter}</h2>

      <Filters
        fetchFilteredWords={fetchFilteredWords}
        filters={filters}
        setFilters={setFilters}
      />

      <div className="mb-3">
        <h4>{t.wordsFound}: {words.length}</h4>
      </div>

      {selectedWords.length > 0 && (
        <>
          <div className="form-group mt-3">
            <label className='mb-1'>{t.newDate}</label>
            <input
              type="date"
              className="form-control"
              value={selectedRepeatDate}
              onChange={(e) => setSelectedRepeatDate(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label className='mb-1' style={{ marginRight: '10px' }}>{t.newLevel}:</label>
            <select
              value={newLevel}
              onChange={(e) => setNewLevel(parseInt(e.target.value, 10))}
              className="level-selector"
            >
              {[...Array(13).keys()].map((lvl) => {
                return (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                );
              })}
            </select>
          </div>

          <button
            className="btn btn-warning mb-3 mt-3"
            onClick={handleUpdateSelectedWords}
          >
            {t.updateLevel} ({selectedWords.length})
          </button>
        </>
      )
      }


      {
        !selectedWord ? (

          <WordsList
            words={words}
            selectedWords={selectedWords}
            setSelectedWords={setSelectedWords}
            handleEditWord={handleEditWord}
          />

        ) : (
          <EditWord
            selectedWord={selectedWord}
            setSelectedWord={setSelectedWord}
          />
        )
      }


      {
        showTopButton && (
          <button
            className="btn btn-primary return-to-top"
            onClick={scrollToTop}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 1000
            }}
          >
            {t.scrollTop}
          </button>
        )
      }

    </div >
  );
};

export default FilterWordsPage;
