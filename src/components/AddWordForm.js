import React, { useState } from 'react';
import axios from 'axios';

const AddWordForm = () => {
  const [word, setWord] = useState('');
  const [wordData, setWordData] = useState({
    date_added: new Date().toISOString().split('T')[0],  // Автоматическая дата
    date_repeated: null,
    level: 0,  // Уровень по умолчанию 0
    translation: null,
    category: null,
    category2: null,
    source: null,
    popularity: 3,
    repeat_again: null,
    comment: null,
    example: null,
    synonyms: null,
    word_formation: null,
    frequency: null
  });
  const [isEditMode, setIsEditMode] = useState(false);  // Режим редактирования
  const [successMessage, setSuccessMessage] = useState('');

  // Очистка всех полей
  const clearFields = () => {
    setWordData({
      date_added: new Date().toISOString().split('T')[0],
      date_repeated: null,
      level: 0,
      translation: null,
      category: null,
      category2: null,
      source: null,
      popularity: 3,
      repeat_again: null,
      comment: null,
      example: null,
      synonyms: null,
      word_formation: null,
      frequency: null
    });
  };

  // Проверка, есть ли слово в базе данных
  const checkIfWordExists = async () => {
    clearFields();  // Очищаем все поля перед проверкой
    try {
      const response = await axios.get(`/api/words/is`, {
        params: {
          word: word
        }
      });

      if (response.data.length > 0) {
        alert('Слово найдено!');
        setWordData(response.data[0]);  // Если слово найдено, заполняем данные
        setIsEditMode(true);  // Включаем режим редактирования
      } else {
        setIsEditMode(false);  // Если слово не найдено, это режим добавления
        alert('Слова нет в словаре.');
      }
    } catch (error) {
      console.error('Ошибка при проверке слова:', error);
    }
  };

  // Автоматическая загрузка данных (выбор между англ. Wiki, фин. Wiki или обе)
  const fetchWordData = async (source) => {
    try {
      const response = await axios.get(`/api/fetch-word?word=${word}`);
      const autoFilledData = response.data;
      
      setWordData((prevData) => ({
        ...prevData,
      
        // Данные из англоязычной Wiki
        translation: source.includes('eng') 
          ? (prevData.translation ? prevData.translation + '\n' : '') + (autoFilledData.eng_data?.definitions || '') 
          : prevData.translation,
        
        category: source.includes('eng') 
          ? (prevData.category ? prevData.category + '\n' : '') + (autoFilledData.eng_data?.PoS || '') 
          : prevData.category,
        
        synonyms: source.includes('eng') 
          ? (prevData.synonyms ? prevData.synonyms + '\n' : '') + (autoFilledData.eng_data?.synonyms || '') 
          : prevData.synonyms,
        
        example: source.includes('eng') 
          ? (prevData.example ? prevData.example + '\n' : '') + (autoFilledData.eng_data?.examples || '') 
          : prevData.example,
        
        word_formation: source.includes('eng') 
          ? (prevData.word_formation ? prevData.word_formation + '\n' : '') + (autoFilledData.eng_data?.etymology || '') 
          : prevData.word_formation,
      
        // Данные из финской Wiki
        comment: source.includes('fi') 
          ? (prevData.comment ? prevData.comment + '\n' : '') + (autoFilledData.fi_data?.definitions || '') 
          : prevData.comment,
        
        example: source.includes('fi') 
          ? (prevData.example ? prevData.example + '\n' : '') + (autoFilledData.fi_data?.examples || '') 
          : prevData.example
      }));
      
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  };

  const handleSaveWord = async () => {
    const wordDataWithWord = { ...wordData, word }; // Добавляем слово в wordData
    try {
      if (isEditMode) {
        console.log(wordData)
        await axios.put(`/api/words/${wordData.id}`, wordData);
        alert('Слово успешно обновлено!');
        setSuccessMessage('Слово успешно обновлено!');
      } else {
        console.log(wordDataWithWord)
        await axios.post('/api/words', wordDataWithWord);
        alert('Слово успешно добавлено!');
        setSuccessMessage('Слово успешно добавлено!');
      }
      setWord('');
      clearFields();
    } catch (error) {
      console.error('Ошибка при сохранении слова:', error);
    }
  };

  const isWordEmpty = word.trim() === '';

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-center mb-2">
        <h2>{isEditMode ? 'Редактировать слово' : 'Добавить новое слово'}</h2>
      </div>
      <div className="form-group input-short">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="form-control"
          placeholder="Введите финское слово"
        />
        <div className="d-flex justify-content-center mt-2">
            <button 
                onClick={checkIfWordExists} 
                className="btn btn-warning mt-2"
                disabled={isWordEmpty}
            >
            Проверить наличие в словаре
            </button>
        </div>
      </div>

      <div className="d-flex justify-content-around mb-3 mt-3">
        <button 
          onClick={() => fetchWordData('eng')} 
          className="btn btn-info"
          disabled={isWordEmpty}  // Деактивируем, если слово пустое
        >
          Поиск англ. Wiki
        </button>
        <button 
          onClick={() => fetchWordData('fi')} 
          className="btn btn-info"
          disabled={isWordEmpty}  // Деактивируем, если слово пустое
        >
          Поиск фин. Wiki
        </button>
      </div>

      <div className="form-group">
        <label>Перевод на русский:</label>
        <textarea
          value={wordData.translation}
          onChange={(e) => setWordData({ ...wordData, translation: e.target.value })}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Категория:</label>
        <input
          type="text"
          value={wordData.category}
          onChange={(e) => setWordData({ ...wordData, category: e.target.value })}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Категория 2:</label> {/* Новое поле */}
        <input
          type="text"
          value={wordData.category2}
          onChange={(e) => setWordData({ ...wordData, category2: e.target.value })}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Источник:</label> {/* Новое поле */}
        <input
          type="text"
          value={wordData.source}
          onChange={(e) => setWordData({ ...wordData, source: e.target.value })}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Уровень:</label>
        <input
          type="number"
          value={wordData.level}
          onChange={(e) => setWordData({ ...wordData, level: e.target.value })}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Популярность:</label>
        <input
          type="number"
          value={wordData.popularity}
          onChange={(e) => {
            const newValue = e.target.value ? parseInt(e.target.value, 10) : null;
            setWordData({ ...wordData, popularity: newValue })
          }}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>На повторение:</label> {/* Новое поле */}
        <input
          type="number"
          value={wordData.repeat_again}
          onChange={(e) => {
            const newValue = e.target.value ? parseInt(e.target.value, 10) : null;
            setWordData({ ...wordData, repeat_again: newValue })
          }}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Дата добавления:</label>
        <input
          type="date"
          value={wordData.date_added}
          onChange={(e) => setWordData({ ...wordData, date_added: e.target.value })}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Комментарий:</label>
        <textarea
          value={wordData.comment}
          onChange={(e) => setWordData({ ...wordData, comment: e.target.value })}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Синонимы:</label>
        <textarea
          value={wordData.synonyms}
          onChange={(e) => setWordData({ ...wordData, synonyms: e.target.value })}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Примеры:</label>
        <textarea
          value={wordData.example}
          onChange={(e) => setWordData({ ...wordData, example: e.target.value })}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Словообразование:</label>
        <textarea
          value={wordData.word_formation}
          onChange={(e) => setWordData({ ...wordData, word_formation: e.target.value })}
          className="form-control"
        />
      </div>

      <div className="d-flex justify-content-center mt-2">
        <button className="btn btn-success mt-3" onClick={handleSaveWord} disabled={isWordEmpty}>
            {isEditMode ? 'Изменить слово' : 'Добавить слово'}
        </button>
      </div>
      {successMessage && <p className="text-success mt-3">{successMessage}</p>}
    </div>
  );
};

export default AddWordForm;
