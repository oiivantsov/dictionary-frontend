import React, { useState, useContext } from 'react';
import axios from 'axios';
import { fetchWordData } from '../utils/apiUtils';
import { LanguageContext } from '../context/LanguageContext';

const translations = {
  fi: {
    wordFoundMessage: "Sana löytyi!",
    successMessage: "Sana lisätty onnistuneesti!",
    notFountMessage: "Sanaa ei löytynyt sanakirjasta!",
    updateMessage: "Sana päivitetty onnistuneesti!",
    checkError: "Virhe sanan tarkistuksessa!",
    alreadyExistsMessage: "Sana on jo olemassa sanakirjassa!",
    addWord: "Lisää uusi sana",
    editWord: "Muokkaa sanaa",
    enterWord: "Syötä suomen sana",
    checkWord: "Tarkista sanakirjasta",
    clearFields: "Tyhjennä kaikki kentät",
    searchEngWiki: "Hae engl. Wiki",
    searchFiWiki: "Hae suom. Wiki",
    searchSlang: "Hae slangi",
    saveWord: "Tallenna sana",
    updateWord: "Päivitä sana",
    translation: "Käännös",
    category: "Kategoria",
    secondCategory: "Toinen kategoria",
    level: "Taso",
    popularity: "Suosio",
    dateAdded: "Lisäyspäivämäärä",
    comment: "Kommentti",
    examples: "Esimerkit",
    source: "Lähde",
    forReview: "Toistettavaksi",
    synonyms: "Synonyymit",
    wordFormation: "Sanamuodostus",
  },
  ru: {
    wordFoundMessage: "Слово найдено!",
    successMessage: "Слово успешно добавлено!",
    notFountMessage: "Слова нет в словаре!",
    updateMessage: "Слово успешно обновлено!",
    checkError: "Ошибка при проверке слова!",
    alreadyExistsMessage: "Слово уже существует в словаре!",
    saveError: "Ошибка при сохранении слова!",
    addWord: "Добавить новое слово",
    editWord: "Редактировать слово",
    enterWord: "Введите финское слово",
    checkWord: "Проверить наличие в словаре",
    clearFields: "Очистить все поля",
    searchEngWiki: "Поиск англ. Wiki",
    searchFiWiki: "Поиск фин. Wiki",
    searchSlang: "Поиск сленг",
    saveWord: "Добавить слово",
    updateWord: "Изменить слово",
    translation: "Перевод",
    category: "Категория",
    secondCategory: "Вторая категория",
    level: "Уровень",
    popularity: "Популярность",
    dateAdded: "Дата добавления",
    comment: "Комментарий",
    examples: "Примеры",
    source: "Источник",
    forReview: "На повторение",
    synonyms: "Синонимы",
    wordFormation: "Словообразование",
  },
  en: {
    wordFoundMessage: "Word found!",
    successMessage: "Word successfully added!",
    notFountMessage: "Word not found in the dictionary!",
    updateMessage: "Word successfully updated!",
    addSuccessMessage: "Word successfully added!",
    checkError: "Error checking the word!",
    alreadyExistsMessage: "Word already exists in the dictionary!",
    addWord: "Add New Word",
    editWord: "Edit Word",
    enterWord: "Enter Finnish Word",
    checkWord: "Check in Dictionary",
    clearFields: "Clear All Fields",
    searchEngWiki: "Search Eng. Wiki",
    searchFiWiki: "Search Fin. Wiki",
    searchSlang: "Search Slang",
    saveWord: "Save Word",
    updateWord: "Update Word",
    translation: "Translation",
    category: "Category",
    secondCategory: "Second Category",
    level: "Level",
    popularity: "Popularity",
    dateAdded: "Date Added",
    comment: "Comment",
    examples: "Examples",
    source: "Source",
    forReview: "For Review",
    synonyms: "Synonyms",
    wordFormation: "Word Formation",
  }
};

const AddWordForm = () => {
  const [word, setWord] = useState('');
  const [wordData, setWordData] = useState({
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('-');
  const { language } = useContext(LanguageContext);
  const t = translations[language] || translations.fi;

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

  const checkIfWordExists = async () => {
    try {
      const response = await axios.get(`/api/words/is`, {
        params: {
          word: word
        }
      });

      if (response.data.length > 0) {
        setSuccessMessage(t.wordFoundMessage);
        setWordData(response.data[0]); 
        setIsEditMode(true);
      } else {
        setIsEditMode(false);
        setSuccessMessage(t.notFountMessage);
      }
    } catch (error) {
      console.error(t.checkError, error);
    }
  };

  const handleFetchWordData = (source) => {
    fetchWordData(word, source, setWordData, setSuccessMessage);
  };

  const handleSaveWord = async () => {
    const wordDataWithWord = { ...wordData, word };
    try {
      if (isEditMode) {
        await axios.put(`/api/words/${wordData.id}`, wordData);
        clearFields();
        setSuccessMessage(t.updateMessage);
      } else {
        await axios.post('/api/words', wordDataWithWord);
        clearFields();
        setSuccessMessage(t.successMessage);
      }

    } catch (error) {
      if (error.response && error.response.status === 409) {
        setSuccessMessage(t.alreadyExistsMessage);
      } else {
        console.error(t.saveError, error);
        setSuccessMessage(t.saveError);
      }
    }
  };


  const isWordEmpty = word.trim() === '';

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-center mb-2">
        <h2>{isEditMode ? t.editWord : t.addWord}</h2>
      </div>
      <div className="form-group input-short position-relative">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          className="form-control"
          placeholder={t.enterWord}
          style={{ paddingRight: '30px' }}
        />

        <div className="d-flex justify-content-center mt-2">
          <div className="d-flex justify-content-center mt-2">
            <button
              onClick={checkIfWordExists}
              className="btn btn-warning mx-2" // Added btn-lg for size and mx-2 for spacing
              disabled={isWordEmpty}
            >
              {t.checkWord}
            </button>

            <button
              onClick={clearFields}
              className="btn btn-secondary mx-2" // Added btn-lg for size and mx-2 for spacing
            >
              {t.clearFields}
            </button>
          </div>

        </div>
      </div>

      {successMessage && <p className="status-text mt-3">{successMessage}</p>}

      <div className="button-container">
        <button
          onClick={() => handleFetchWordData('eng')}
          className="btn btn-info action-button"
          disabled={isWordEmpty}
        >
          {t.searchEngWiki}
        </button>
        <button
          onClick={() => handleFetchWordData('fi')}
          className="btn btn-info action-button"
          disabled={isWordEmpty}
        >
          {t.searchFiWiki}
        </button>
        <button
          onClick={() => handleFetchWordData('slang')}
          className="btn btn-info action-button"
          disabled={isWordEmpty}
        >
          {t.searchSlang}
        </button>
      </div>



      {/* Render form fields for word data (as in your original code) */}

      <div className="fields-container">

        <div className="form-group">
          <label>{t.translation}:</label>
          <textarea
            value={wordData.translation ?? ""}
            onChange={(e) => setWordData({ ...wordData, translation: e.target.value || null })}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>{t.category}:</label>
          <input
            type="text"
            value={wordData.category ?? ""}
            onChange={(e) => setWordData({ ...wordData, category: e.target.value || null })}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>{t.secondCategory}:</label> {/* Новое поле */}
          <input
            type="text"
            value={wordData.category2 ?? ""}
            onChange={(e) => setWordData({ ...wordData, category2: e.target.value || null })}
            className="form-control"
          />
        </div>



        <div className="form-group">
          <label>{t.level}:</label>
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
          <label>{t.popularity}:</label>
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
          <label>{t.dateAdded}:</label>
          <input
            type="date"
            value={wordData.date_added ?? ""}
            onChange={(e) => setWordData({ ...wordData, date_added: e.target.value || null })}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>{t.comment}:</label>
          <textarea
            value={wordData.comment ?? ""}
            onChange={(e) => setWordData({ ...wordData, comment: e.target.value || null })}
            className="form-control"
            style={{ height: "150px" }} // Adjust the height as desired
          />
        </div>

        <div className="form-group">
          <label>{t.examples}:</label>
          <textarea
            value={wordData.example ?? ""}
            onChange={(e) => setWordData({ ...wordData, example: e.target.value || null })}
            className="form-control"
            style={{ height: "150px" }} // Adjust the height as desired
          />
        </div>




        <div className="form-group">
          <label>{t.source}:</label> {/* Новое поле */}
          <input
            type="text"
            value={wordData.source ?? ""}
            onChange={(e) => setWordData({ ...wordData, source: e.target.value || null })}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>{t.forReview}:</label> {/* Новое поле */}
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
          <label>{t.synonyms}:</label>
          <textarea
            value={wordData.synonyms ?? ""}
            onChange={(e) => setWordData({ ...wordData, synonyms: e.target.value || null })}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>{t.wordFormation}:</label>
          <textarea
            value={wordData.word_formation ?? ""}
            onChange={(e) => setWordData({ ...wordData, word_formation: e.target.value || null })}
            className="form-control"
          />
        </div>

      </div>

      {successMessage && <p className="status-text mt-3">{successMessage}</p>}

      <div className="d-flex justify-content-center mt-2">
        <button className="btn btn-success mt-3" onClick={handleSaveWord} disabled={isWordEmpty}>
          {isEditMode ? t.updateWord : t.saveWord}
        </button>
      </div>

    </div>
  );
};

export default AddWordForm;
