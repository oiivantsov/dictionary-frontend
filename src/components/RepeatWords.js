import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

const RepeatWords = () => {
  const [level, setLevel] = useState(1);
  const [words, setWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null); // Выбранное слово для редактирования
  const [showWord, setShowWord] = useState(false); // Добавляем состояние для переключения между словом и переводом
  const [daysSinceLastRepeat, setDaysSinceLastRepeat] = useState(0); // Days since last repeat

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await axios.get(`/api/words/repeat?level=${level}`);
        setWords(response.data);

        if (response.data.length > 0) {
            const maxDays = response.data
              .map((word) => {
                if (word.dateRepeated) {
                  return dayjs().diff(dayjs(word.dateRepeated), 'day');
                }
                return 0; // Default to 0 if dateRepeated is null
              })
              .reduce((max, current) => Math.max(max, current), 0);
  
            setDaysSinceLastRepeat(maxDays);
          } else {
            setDaysSinceLastRepeat(0);
          }

      } catch (error) {
        console.error('Ошибка при загрузке слов:', error);
      }
    };

    fetchWords();
  }, [level]);

  // Функция для открытия полной карточки слова
  const handleViewWord = (word) => {
    setSelectedWord(word);
  };

  // Функция для возвращения обратно к списку слов
  const handleBackToList = () => {
    setSelectedWord(null);
  };

  // Функция для сохранения изменений слова
  const handleSaveWord = async () => {
    try {
      await axios.put(`/api/words/${selectedWord.id}`, selectedWord);
      alert('Слово успешно сохранено!');
      handleBackToList();
    } catch (error) {
      console.error('Ошибка при сохранении слова:', error);
    }
  };

  // Функция для обновления уровня всех слов
  const handleNextLevel = async () => {
    try {
      await axios.post('/api/words/upgrade', words);
      alert('Слова перенесены на следующий уровень!');
    } catch (error) {
      console.error('Ошибка при обновлении уровня:', error);
    }
  };

  // Функция для переключения между словом и переводом
  const toggleShowWord = () => {
    setShowWord(!showWord);
  };

  return (
    <div className="container mt-5">
      {!selectedWord ? (
        <>
          <h2>Повторение слов — Уровень {level}</h2>
          <p>Максимальное количество дней с последнего повторения: {daysSinceLastRepeat}</p>

          {/* Селектор уровня */}
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="form-control mb-3 level-selector"
          >
            {[...Array(12).keys()].map((lvl) => (
              <option key={lvl + 1} value={lvl + 1}>
                Уровень {lvl + 1}
              </option>
            ))}
          </select>

          {/* Кнопка переключения между словом и переводом */}
          <button onClick={toggleShowWord} className="btn btn-info mb-3">
            {showWord ? 'Показать переводы' : 'Показать слова'}
          </button>

          <ul className="list-group">
            {Array.isArray(words) && words.length > 0 ? (
              words.map((word) => (
                <li key={word.id} className="list-group-item d-flex justify-content-between align-items-center">
                {/* В зависимости от состояния показываем слово или перевод */}
                <p className="mb-0 flex-grow-1 word-text">{showWord ? word.word : word.translation}</p>
                <button className="btn btn-secondary word-button" onClick={() => handleViewWord(word)}>
                    Посмотреть слово
                </button>
                </li>
              ))
            ) : (
              <li className="list-group-item">Нет слов для отображения</li>
            )}
          </ul>

          <button className="btn btn-primary mt-3" onClick={handleNextLevel}>
            Готово — Перенести на следующий уровень
          </button>
        </>
      ) : (
        <div className="card position-relative">
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
            <label>На повторение:</label>
            <input
              type="number"
              className="form-control"
              value={selectedWord.repeatAgain}
              onChange={(e) => setSelectedWord({ ...selectedWord, repeatAgain: e.target.value })}
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
              value={selectedWord.wordFormation}
              onChange={(e) => setSelectedWord({ ...selectedWord, wordFormation: e.target.value })}
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
              value={selectedWord.dateAdded ? dayjs(selectedWord.dateAdded).format('YYYY-MM-DD') : ''}
              onChange={(e) => setSelectedWord({ ...selectedWord, dateAdded: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Дата последнего повторения:</label>
            <input
              type="date"
              className="form-control"
              value={selectedWord.dateRepeated ? dayjs(selectedWord.dateRepeated).format('YYYY-MM-DD') : ''}
              onChange={(e) => setSelectedWord({ ...selectedWord, dateRepeated: e.target.value })}
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
    </div>
  );
};

export default RepeatWords;
