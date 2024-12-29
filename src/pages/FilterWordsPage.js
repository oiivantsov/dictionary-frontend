import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

import EditWord from '../components/general/EditWord';

const FilterWordsPage = () => {
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
  const [words, setWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null); // Для редактирования слова
  const [selectedRepeatDate, setSelectedRepeatDate] = useState(new Date().toISOString().split('T')[0]); // Дефолтная сегодняшняя дата

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

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

  const handleAddToStudy = async (word) => {
    try {
      const updatedWord = { ...word, level: 1, date_repeated: selectedRepeatDate };
      await axios.put(`/api/words/${word.id}`, updatedWord);
      fetchFilteredWords(); // Обновляем список после изменений
    } catch (error) {
      console.error('Ошибка при добавлении слова на изучение:', error);
    }
  };

  const handleEditWord = (word) => {
    console.log(word)
    setSelectedWord(word);
  };

  return (
    <div className="container mt-5">
      <h2>Фильтр</h2>

      {/* Форма фильтров */}
      <div className="fields-container mb-3">
        <div className="form-group">
          <label htmlFor="daysSinceLastRepeat">Дни с последнего повторения:</label>
          <input
            type="number"
            id="daysSinceLastRepeat"
            name="daysSinceLastRepeat"
            value={filters.daysSinceLastRepeat}
            onChange={handleFilterChange}
            className="form-control mb-2"
          />
        </div>

        <div className="form-group">
          <label htmlFor="level">Уровень:</label>
          <input
            type="number"
            id="level"
            name="level"
            value={filters.level}
            onChange={handleFilterChange}
            className="form-control mb-2"
          />
        </div>

        <div className="form-group">
          <label htmlFor="popularity">Популярность:</label>
          <input
            type="number"
            id="popularity"
            name="popularity"
            value={filters.popularity}
            onChange={handleFilterChange}
            className="form-control mb-2"
          />
        </div>

        <div className="form-group">
          <label htmlFor="frequency">Частота:</label>
          <input
            type="number"
            id="frequency"
            name="frequency"
            value={filters.frequency}
            onChange={handleFilterChange}
            className="form-control mb-2"
          />
        </div>

        <div className="form-group">
          <label htmlFor="source">Источник:</label>
          <input
            type="text"
            id="source"
            name="source"
            value={filters.source}
            onChange={handleFilterChange}
            className="form-control mb-2"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category1">Категория 1:</label>
          <input
            type="text"
            id="category1"
            name="category1"
            value={filters.category1}
            onChange={handleFilterChange}
            className="form-control mb-2"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category2">Категория 2:</label>
          <input
            type="text"
            id="category2"
            name="category2"
            value={filters.category2}
            onChange={handleFilterChange}
            className="form-control mb-2"
          />
        </div>

        <div className="form-group">
          <label htmlFor="repeatAgain">Вернуть на повторение:</label>
          <input
            type="number"
            id="repeatAgain"
            name="repeatAgain"
            value={filters.repeatAgain}
            onChange={handleFilterChange}
            className="form-control mb-2"
          />
        </div>

        <button className="btn btn-primary mt-3" onClick={fetchFilteredWords}>
          Применить фильтры
        </button>
      </div>

      {/* Количество найденных слов */}
      <div className="mb-3">
        <h4>Найдено слов: {words.length}</h4>
      </div>

      {/* Список слов */}
      {!selectedWord ? (
        <div className="row">
          {words.length > 0 ? (
            words.map((word) => (
              <div key={word.id} className="col-md-4 mb-3">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{word.word}</h5>
                    <p className="card-text">{word.translation}</p>
                    <div className="button-container">
                      <button
                        className="btn btn-success action-button"
                        onClick={() => handleAddToStudy(word)}
                      >
                        Учить
                      </button>
                      <button
                        className="btn btn-secondary action-button"
                        onClick={() => handleEditWord(word)}
                      >
                        Редактировать
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Нет слов для отображения</p>
          )}
        </div>
      ) : (
        <EditWord
          selectedWord={selectedWord}
          setSelectedWord={setSelectedWord}
        />
      )}

      {/* Выбор даты повторения */}
      <div className="form-group mt-3">
        <label>Выберите дату повторения:</label>
        <input
          type="date"
          className="form-control"
          value={selectedRepeatDate}
          onChange={(e) => setSelectedRepeatDate(e.target.value)}
        />
      </div>
    </div>
  );
};

export default FilterWordsPage;
