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
  const [successMessage, setSuccessMessage] = useState('-');

  // Очистка всех полей
  const clearFields = () => {
    setWord('');
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
    setSuccessMessage('-');
    setIsEditMode(false);
  };

  // Проверка, есть ли слово в базе данных
  const checkIfWordExists = async () => {
    // clearFields();  // Очищаем все поля перед проверкой
    try {
      const response = await axios.get(`/api/words/is`, {
        params: {
          word: word
        }
      });

      if (response.data.length > 0) {
        setSuccessMessage('Слово найдено!');
        setWordData(response.data[0]);  // Если слово найдено, заполняем данные
        setIsEditMode(true);  // Включаем режим редактирования
      } else {
        setIsEditMode(false);  // Если слово не найдено, это режим добавления
        setSuccessMessage('Слова нет в словаре!');
      }
    } catch (error) {
      console.error('Ошибка при проверке слова:', error);
    }
  };

  // Автоматическая загрузка данных (поиск по англ. или фин. Wiki)
  const fetchWordData = async (source) => {
    try {
      const response = await axios.get(`/api/fetch-word-${source}`, {
        params: { word }
      });
      const autoFilledData = response.data;

      console.log('autoFilledData:', autoFilledData);

      setWordData((prevData) => ({
        ...prevData,
        ...(source === 'eng'
          ? {
            translation: (prevData.translation ? prevData.translation + '\n' : '') + (autoFilledData.eng_data?.definitions || ''),
            category: (prevData.category ? prevData.category + '\n' : '') + (autoFilledData.eng_data?.PoS || ''),
            synonyms: (prevData.synonyms ? prevData.synonyms + '\n' : '') + (autoFilledData.eng_data?.synonyms || ''),
            example: (prevData.example ? prevData.example + '\n' : '') + (autoFilledData.eng_data?.examples || ''),
            word_formation: (prevData.word_formation ? prevData.word_formation + '\n' : '') + (autoFilledData.eng_data?.etymology || '')
          }
          : source === 'fi'
            ? {
              comment: (prevData.comment ? prevData.comment + '\n' : '') + (autoFilledData.fi_data?.definitions || ''),
              example: (prevData.example ? prevData.example + '\n' : '') + (autoFilledData.fi_data?.examples || '')
            }
            : {
              // Handling slang data
              comment: (prevData.comment ? prevData.comment + '\n' : '') + (autoFilledData.slang_data?.description || ''),
              example: (prevData.example ? prevData.example + '\n' : '') + (autoFilledData.slang_data?.example || '')
            })
      }));

      setSuccessMessage(
        source === 'eng' && autoFilledData.eng_data?.error ? 'Слово не найдено в английской Wiki' :
          source === 'fi' && autoFilledData.fi_data.definitions === '' ? 'Слово не найдено в финской Wiki' :
            source === 'slang' && autoFilledData.slang_data.word === 'n/a' ? 'Слово не найдено в сленговом словаре' :
              source === 'eng' ? 'Данные успешно загружены из английской Wiki' :
                source === 'fi' ? 'Данные успешно загружены из финской Wiki' :
                  source === 'slang' ? 'Данные успешно загружены из сленгового словаря' :
                    'Данные успешно загружены'
      );


    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  };

  const handleSaveWord = async () => {
    const wordDataWithWord = { ...wordData, word }; // Add the word to wordData
    try {
      if (isEditMode) {
        await axios.put(`/api/words/${wordData.id}`, wordData);
        clearFields();
        setSuccessMessage('Слово успешно обновлено!');
      } else {
        await axios.post('/api/words', wordDataWithWord);
        clearFields();
        setSuccessMessage('Слово успешно добавлено!');
      }

    } catch (error) {
      if (error.response && error.response.status === 409) {
        setSuccessMessage('Слово уже существует в словаре!');
      } else {
        console.error('Ошибка при сохранении слова:', error);
        setSuccessMessage('Произошла ошибка при сохранении слова.');
      }
    }
  };


  const isWordEmpty = word.trim() === '';

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-center mb-2">
        <h2>{isEditMode ? 'Редактировать слово' : 'Добавить новое слово'}</h2>
      </div>
      <div className="form-group input-short position-relative">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="form-control"
          placeholder="Введите финское слово"
          style={{ paddingRight: '30px' }}
        />
        <button
          onClick={() => setWord('')}
          className="btn-clear"
          style={{
            position: 'absolute',
            right: '10px',
            top: '20%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#aaa',
            fontSize: '18px',
          }}
        >
          &times;
        </button>
        <div className="d-flex justify-content-center mt-2">
          <div className="d-flex justify-content-center mt-2">
            <button
              onClick={checkIfWordExists}
              className="btn btn-warning mx-2" // Added btn-lg for size and mx-2 for spacing
              disabled={isWordEmpty}
            >
              Проверить наличие в словаре
            </button>

            <button
              onClick={clearFields}
              className="btn btn-secondary mx-2" // Added btn-lg for size and mx-2 for spacing
            >
              Очистить все поля
            </button>
          </div>

        </div>
      </div>

      {successMessage && <p className="status-text mt-3">{successMessage}</p>}

      <div className="d-flex justify-content-around mb-3 mt-3">
        <button
          onClick={() => fetchWordData('eng')}
          className="btn btn-info"
          disabled={isWordEmpty}
        >
          Поиск англ. Wiki
        </button>
        <button
          onClick={() => fetchWordData('fi')}
          className="btn btn-info"
          disabled={isWordEmpty}
        >
          Поиск фин. Wiki
        </button>
        <button
          onClick={() => fetchWordData('slang')}
          className="btn btn-info"
          disabled={isWordEmpty}
        >
          Поиск сленг
        </button>
      </div>



      {/* Render form fields for word data (as in your original code) */}

      <div className="form-group">
        <label>Перевод на русский:</label>
        <textarea
          value={wordData.translation ?? ""}
          onChange={(e) => setWordData({ ...wordData, translation: e.target.value || null })}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Категория:</label>
        <input
          type="text"
          value={wordData.category ?? ""}
          onChange={(e) => setWordData({ ...wordData, category: e.target.value || null })}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Категория 2:</label> {/* Новое поле */}
        <input
          type="text"
          value={wordData.category2 ?? ""}
          onChange={(e) => setWordData({ ...wordData, category2: e.target.value || null })}
          className="form-control"
        />
      </div>



      <div className="form-group">
        <label>Уровень:</label>
        <input
          type="number"
          value={wordData.level ?? ""}
          onChange={(e) => {
            const newValue = e.target.value ? parseInt(e.target.value, 10) : null;
            setWordData({ ...wordData, level: newValue });
          }}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Популярность:</label>
        <input
          type="number"
          value={wordData.popularity ?? ""}
          onChange={(e) => {
            const newValue = e.target.value ? parseInt(e.target.value, 10) : null;
            setWordData({ ...wordData, popularity: newValue });
          }}
          className="form-control"
        />
      </div>



      <div className="form-group">
        <label>Дата добавления:</label>
        <input
          type="date"
          value={wordData.date_added ?? ""}
          onChange={(e) => setWordData({ ...wordData, date_added: e.target.value || null })}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Комментарий:</label>
        <textarea
          value={wordData.comment ?? ""}
          onChange={(e) => setWordData({ ...wordData, comment: e.target.value || null })}
          className="form-control"
          style={{ height: "150px" }} // Adjust the height as desired
        />
      </div>

      <div className="form-group">
        <label>Примеры:</label>
        <textarea
          value={wordData.example ?? ""}
          onChange={(e) => setWordData({ ...wordData, example: e.target.value || null })}
          className="form-control"
          style={{ height: "150px" }} // Adjust the height as desired
        />
      </div>




      <div className="form-group">
        <label>Источник:</label> {/* Новое поле */}
        <input
          type="text"
          value={wordData.source ?? ""}
          onChange={(e) => setWordData({ ...wordData, source: e.target.value || null })}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>На повторение:</label> {/* Новое поле */}
        <input
          type="number"
          value={wordData.repeat_again ?? ""}
          onChange={(e) => {
            const newValue = e.target.value ? parseInt(e.target.value, 10) : null;
            setWordData({ ...wordData, repeat_again: newValue });
          }}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Синонимы:</label>
        <textarea
          value={wordData.synonyms ?? ""}
          onChange={(e) => setWordData({ ...wordData, synonyms: e.target.value || null })}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Словообразование:</label>
        <textarea
          value={wordData.word_formation ?? ""}
          onChange={(e) => setWordData({ ...wordData, word_formation: e.target.value || null })}
          className="form-control"
        />
      </div>

      {successMessage && <p className="status-text mt-3">{successMessage}</p>}

      <div className="d-flex justify-content-center mt-2">
        <button className="btn btn-success mt-3" onClick={handleSaveWord} disabled={isWordEmpty}>
          {isEditMode ? 'Изменить слово' : 'Добавить слово'}
        </button>
      </div>

    </div>
  );
};

export default AddWordForm;
