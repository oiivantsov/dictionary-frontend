import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

import EditWord from '../components/general/EditWord';
import Filters from '../components/filter/Filters';
import WordsList from '../components/filter/WordsList';

const FilterWordsPage = () => {

  const [words, setWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null); // Для редактирования слова
  const [newLevel, setNewLevel] = useState(1);
  const [selectedRepeatDate, setSelectedRepeatDate] = useState(new Date().toISOString().split('T')[0]); // Дефолтная сегодняшняя дата
  const [showTopButton, setShowTopButton] = useState(false);
  const [selectedWords, setSelectedWords] = useState([]); // Track selected words to update their level

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

      const response = await axios.get('/api/words/filter', {
        params: filtersWithNulls
      });
      setWords(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке слов:', error);
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
      console.error('Ошибка при обновлении выбранных слов:', error);
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
      <h2>Фильтр</h2>

      <Filters
        fetchFilteredWords={fetchFilteredWords}
        filters={filters}
        setFilters={setFilters}
      />

      {/* Количество найденных слов */}
      <div className="mb-3">
        <h4>Найдено слов: {words.length}</h4>
      </div>

      {selectedWords.length > 0 && (
        <>
          {/* Выбор даты повторения */}
          <div className="form-group mt-3">
            <label className='mb-1'>Новая дата</label>
            <input
              type="date"
              className="form-control"
              value={selectedRepeatDate}
              onChange={(e) => setSelectedRepeatDate(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label className='mb-1' style={{ marginRight: '10px' }}>Новый уровень:</label>
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
            Обновить уровень ({selectedWords.length})
          </button>
        </>
      )
      }


      {/* Список слов */}
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



      {/* Return to Top Button */}
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
            Наверх
          </button>
        )
      }

    </div >
  );
};

export default FilterWordsPage;
