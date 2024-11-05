import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

axios.defaults.baseURL = 'https://dict-backend.onrender.com';

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
      alert('Слово добавлено на изучение!');
      fetchFilteredWords(); // Обновляем список после изменений
    } catch (error) {
      console.error('Ошибка при добавлении слова на изучение:', error);
    }
  };

  const handleEditWord = (word) => {
    console.log(word)
    setSelectedWord(word);
  };

  const handleSaveWord = async () => {
    try {
      await axios.put(`/api/words/${selectedWord.id}`, selectedWord);
      alert('Слово успешно сохранено!');
      setSelectedWord(null);
      fetchFilteredWords();
    } catch (error) {
      console.error('Ошибка при сохранении слова:', error);
    }
  };

  const handleBackToList = () => {
    setSelectedWord(null);
  };

  return (
    <div className="container mt-5">
      <h2>Поиск слов по фильтрам</h2>

      {/* Форма фильтров */}
      <div className="filters mb-3">
        <div className="form-group">
          <label htmlFor="daysSinceLastRepeat">Количество дней с последнего повторения:</label>
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
                    <button className="btn btn-success mr-2" onClick={() => handleAddToStudy(word)}>
                      Добавить на изучение
                    </button>
                    <button className="btn btn-secondary" onClick={() => handleEditWord(word)}>
                      Редактировать
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Нет слов для отображения</p>
          )}
        </div>
      ) : (
        <div className="card mt-5 position-relative">
          <button className="btn btn-secondary back-top-right" onClick={handleBackToList}>
            Назад
          </button>
          <h2>Редактировать слово</h2>
          <div className="form-group">
            <label>Финское слово:</label>
            <input
              type="text"
              className="form-control"
              value={selectedWord.word}
              onChange={(e) => setSelectedWord({ ...selectedWord, word: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Перевод:</label>
            <textarea
              className="form-control"
              value={selectedWord.translation}
              onChange={(e) => setSelectedWord({ ...selectedWord, translation: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Категория:</label>
            <input
              type="text"
              className="form-control"
              value={selectedWord.category}
              onChange={(e) => setSelectedWord({ ...selectedWord, category: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Категория 2:</label>
            <input
              type="text"
              className="form-control"
              value={selectedWord.category2}
              onChange={(e) => setSelectedWord({ ...selectedWord, category2: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Источник:</label>
            <input
              type="text"
              className="form-control"
              value={selectedWord.source}
              onChange={(e) => setSelectedWord({ ...selectedWord, source: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Популярность:</label>
            <input
              type="number"
              className="form-control"
              value={selectedWord.popularity}
              onChange={(e) => setSelectedWord({ ...selectedWord, popularity: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Вернуть на повторение:</label>
            <input
              type="number"
              className="form-control"
              value={selectedWord.repeat_again}
              onChange={(e) => setSelectedWord({ ...selectedWord, repeat_again: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Комментарий:</label>
            <textarea
              className="form-control"
              value={selectedWord.comment}
              onChange={(e) => setSelectedWord({ ...selectedWord, comment: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Примеры:</label>
            <textarea
              className="form-control"
              value={selectedWord.example}
              onChange={(e) => setSelectedWord({ ...selectedWord, example: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Синонимы:</label>
            <textarea
              className="form-control"
              value={selectedWord.synonyms}
              onChange={(e) => setSelectedWord({ ...selectedWord, synonyms: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Словообразование:</label>
            <textarea
              className="form-control"
              value={selectedWord.word_formation}
              onChange={(e) => setSelectedWord({ ...selectedWord, word_formation: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Частота:</label>
            <input
              type="number"
              className="form-control"
              value={selectedWord.frequency}
              onChange={(e) => setSelectedWord({ ...selectedWord, frequency: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Дата добавления:</label>
            <input
              type="date"
              className="form-control"
              value={selectedWord.date_added}
              onChange={(e) => setSelectedWord({ ...selectedWord, date_added: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Дата последнего повторения:</label>
            <input
              type="date"
              className="form-control"
              value={selectedWord.date_repeated}
              onChange={(e) => setSelectedWord({ ...selectedWord, date_repeated: e.target.value })}
            />
          </div>
          <button className="btn btn-success mt-3" onClick={handleSaveWord}>
            Сохранить изменения
          </button>
          <button className="btn btn-secondary mt-3" onClick={handleBackToList}>
            Назад
          </button>
        </div>
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
