import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { fetchWordData } from '../apiUtils';
import Slider from 'react-slick'; // For carousel view
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const RepeatWords = () => {
  const [level, setLevel] = useState(1);
  const [words, setWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null); // Выбранное слово для редактирования
  const [daysSinceLastRepeat, setDaysSinceLastRepeat] = useState(0); // Days since last repeat
  const [customDate, setCustomDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [globalShowTranslation, setGlobalShowTranslation] = useState(true);
  const [successMessage, setSuccessMessage] = useState('-');
  const [isCarouselView, setIsCarouselView] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await axios.get(`/api/words/repeat?level=${level}`);

        // Initialize each word with a `showTranslation` property
        const wordsWithToggle = response.data.map((word) => ({
          ...word,
          showTranslation: globalShowTranslation
        }));


        setWords(wordsWithToggle);

        if (wordsWithToggle.length > 0) {
          const maxDays = wordsWithToggle
            .map((word) => word.date_repeated ? dayjs().diff(dayjs(word.date_repeated), 'day') : 0)
            .reduce((max, current) => Math.max(max, current), 0);

          setDaysSinceLastRepeat(maxDays);
        } else {
          setCurrentSlide(0);
          setDaysSinceLastRepeat(0);
        }

      } catch (error) {
        console.error('Ошибка при загрузке слов:', error);
      }
    };


    setCurrentSlide(0); // Reset the current slide index
    fetchWords();
  }, [level, globalShowTranslation]);

  const toggleWordVisibility = (id) => {
    setWords(words.map((word) =>
      word.id === id ? { ...word, showTranslation: !word.showTranslation } : word
    ));
  };

  const toggleAllWordsVisibility = () => {
    setGlobalShowTranslation(!globalShowTranslation);
    setWords(words.map((word) => ({
      ...word,
      showTranslation: !globalShowTranslation
    })));
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
      const updatedWords = {
        level,
        daysSinceLastRepeat,
        date_repeated: customDate
      };
      console.log(updatedWords)
      await axios.post(`/api/words/upgrade`, updatedWords);
      alert('Слова перенесены на следующий уровень!');
    } catch (error) {
      console.error('Ошибка при обновлении уровня:', error);
    }
  };

  const CustomArrow = ({ className, style, onClick }) => (
    <div
      className={className}
      style={{
        ...style,
        display: 'block',
        background: 'gray',
        width: '60px', // Adjust the width
        height: '60px', // Adjust the height
        borderRadius: '50%', // Optional: Make it circular
        fontSize: '20px', // Increase the font size
        margin: '-10px -10px 30px 10px', // Add some margin
      }}
      onClick={onClick}
    />
  );


  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    // autoplay: true,
    // autoplaySpeed: 5000,
    initialSlide: currentSlide,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    nextArrow: <CustomArrow />,
    prevArrow: <CustomArrow />,
    customPaging: (i) => (
      <div
        style={{
          width: "100%",
          height: "5px", // Adjust height to make it look like a bar
          background: "gray", // Default bar color
          margin: "0 2px", // Space between bars
          transition: "background 0.3s", // Smooth transition
        }}
      />
    )
  };


  return (
    <div className="container mt-5">
      {!selectedWord ? (
        <>
          <h2>Уровень {level}</h2>
          <p>Дней с даты повторения: {daysSinceLastRepeat}</p>
          <p>Слов: {words.length}</p>

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

          {/* Button to toggle all cards between words and translations */}
          <div className="d-flex justify-content-between mb-3">
            <button onClick={toggleAllWordsVisibility} className="btn btn-info">
              {globalShowTranslation ? 'Показать слова' : 'Показать переводы'}
            </button>
            <button
              onClick={() => setIsCarouselView(!isCarouselView)}
              className="btn btn-secondary"
            >
              {isCarouselView ? 'Список' : 'Карусель'}
            </button>
          </div>

          {!isCarouselView ? (
            <ul className="list-group">
              {Array.isArray(words) && words.length > 0 ? (
                words.map((word) => (
                  <li key={word.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {/* В зависимости от состояния показываем слово или перевод */}
                    <p className="mb-0 flex-grow-1 word-text">
                      {word.showTranslation ? word.translation : word.word}
                    </p>
                    <div className="d-flex flex-column align-items-start">
                      <button
                        className="btn btn-primary word-button mb-2"
                        style={{ width: '100px' }} // Фиксированная ширина кнопки
                        onClick={() => toggleWordVisibility(word.id)}
                      >
                        {word.showTranslation ? 'Слово' : 'Перевод'}
                      </button>
                      <button
                        className="btn btn-success word-button"
                        style={{ width: '100px' }} // Фиксированная ширина кнопки
                        onClick={() => setSelectedWord(word)}
                      >
                        Детали
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <li className="list-group-item">Нет слов для отображения</li>
              )}
            </ul>
          ) : (
            <Slider {...settings}>
              {Array.isArray(words) && words.length > 0 ? (
                words.map((word, index) => (
                  <div key={word.id} className="carousel-card">
                    {/* Scrollable Text Block */}
                    <div
                      className={`text-block ${!word.showTranslation ? 'centered-text' : ''}`}
                      onClick={() => toggleWordVisibility(word.id)}
                    >
                      <p className={`text ${!word.showTranslation ? 'large-text' : ''}`}>
                        {word.showTranslation ? word.translation : word.word}
                      </p>
                    </div>

                    {/* Button Block */}
                    <div className="button-block">
                      <button
                        className="btn btn-primary word-button"
                        onClick={() => toggleWordVisibility(word.id)}
                      >
                        {word.showTranslation ? 'Слово' : 'Перевод'}
                      </button>
                      <button
                        className="btn btn-success word-button"
                        onClick={() => setSelectedWord(word)}
                      >
                        Детали
                      </button>

                    </div>

                    {/* Word Number */}
                    <div className="word-number">
                      {index + 1}/{words.length}
                    </div>
                  </div>
                ))
              ) : (
                <div className="list-group-item">Нет слов для отображения</div>
              )}
            </Slider>
          )}

          <div className="level-up-block d-flex align-items-center mt-3">
            <button className="btn btn-primary" onClick={handleNextLevel}>
              Level up!
            </button>
            <input
              type="date"
              id="customDate"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="form-control mx-2"
              style={{ width: '150px' }} // Shorten the width of the date input
            />

          </div>


        </>
      ) : (
        <div className="card position-relative">
          <button className="btn btn-secondary back-top-right" onClick={handleBackToList}>
            Назад
          </button>
          <h2>Редактировать слово</h2>

          <div className="d-flex justify-content-around mb-3 mt-3">
            <button
              onClick={() =>
                fetchWordData(selectedWord.word, 'eng', setSelectedWord, setSuccessMessage)
              }
              className="btn btn-info"
              disabled={!selectedWord.word}
            >
              Поиск англ. Wiki
            </button>
            <button
              onClick={() =>
                fetchWordData(selectedWord.word, 'fi', setSelectedWord, setSuccessMessage)
              }
              className="btn btn-info"
              disabled={!selectedWord.word}
            >
              Поиск фин. Wiki
            </button>
            <button
              onClick={() =>
                fetchWordData(selectedWord.word, 'slang', setSelectedWord, setSuccessMessage)
              }
              className="btn btn-info"
              disabled={!selectedWord.word}
            >
              Поиск сленг
            </button>
          </div>

          {successMessage && <p className="status-text mt-3">{successMessage}</p>}

          <div className="form-group mb-section">
            <label>Финское слово:</label>
            <input
              type="text"
              className="form-control"
              value={selectedWord.word}
              onChange={(e) => setSelectedWord({ ...selectedWord, word: e.target.value })}
            />
          </div>
          <div className="form-group mb-section">
            <label>Перевод:</label>
            <textarea
              className="form-control"
              rows="4"
              value={selectedWord.translation}
              onChange={(e) => setSelectedWord({ ...selectedWord, translation: e.target.value })}
            />
          </div>
          <div className="form-group mb-section">
            <label>Категория:</label>
            <input
              type="text"
              className="form-control"
              value={selectedWord.category}
              onChange={(e) => setSelectedWord({ ...selectedWord, category: e.target.value })}
            />
          </div>
          <div className="form-group mb-section">
            <label>Категория 2:</label>
            <input
              type="text"
              className="form-control"
              value={selectedWord.category2}
              onChange={(e) => setSelectedWord({ ...selectedWord, category2: e.target.value })}
            />
          </div>
          <div className="form-group mb-section">
            <label>Источник:</label>
            <input
              type="text"
              className="form-control"
              value={selectedWord.source}
              onChange={(e) => setSelectedWord({ ...selectedWord, source: e.target.value })}
            />
          </div>
          <div className="form-group mb-section">
            <label>Популярность:</label>
            <input
              type="number"
              className="form-control"
              value={selectedWord.popularity}
              onChange={(e) => setSelectedWord({ ...selectedWord, popularity: e.target.value })}
            />
          </div>
          <div className="form-group mb-section">
            <label>На повторение:</label>
            <select
              className="form-control"
              value={selectedWord.repeat_again}
              onChange={(e) => setSelectedWord({ ...selectedWord, repeat_again: e.target.value })}
            >
              <option value=""></option>
              <option value="1">1</option>
            </select>
          </div>
          <div className="form-group mb-section">
            <label>Комментарий:</label>
            <textarea
              className="form-control"
              rows="4"
              value={selectedWord.comment}
              onChange={(e) => setSelectedWord({ ...selectedWord, comment: e.target.value })}
            />
          </div>
          <div className="form-group mb-section">
            <label>Примеры:</label>
            <textarea
              className="form-control"
              rows="5" // Увеличиваем высоту текстового поля
              value={selectedWord.example}
              onChange={(e) => setSelectedWord({ ...selectedWord, example: e.target.value })}
            />
          </div>
          <div className="form-group mb-section">
            <label>Синонимы:</label>
            <textarea
              className="form-control"
              value={selectedWord.synonyms}
              onChange={(e) => setSelectedWord({ ...selectedWord, synonyms: e.target.value })}
            />
          </div>
          <div className="form-group mb-section">
            <label>Словообразование:</label>
            <textarea
              className="form-control"
              value={selectedWord.word_formation}
              onChange={(e) => setSelectedWord({ ...selectedWord, word_formation: e.target.value })}
            />
          </div>
          <div className="form-group mb-section">
            <label>Частота:</label>
            <input
              type="number"
              className="form-control"
              value={selectedWord.frequency}
              onChange={(e) => setSelectedWord({ ...selectedWord, frequency: e.target.value })}
            />
          </div>
          <div className="form-group mb-section">
            <label>Дата добавления:</label>
            <input
              type="date"
              className="form-control mb-section"
              value={selectedWord.date_added ? dayjs(selectedWord.date_added).format('YYYY-MM-DD') : ''}
              onChange={(e) => setSelectedWord({ ...selectedWord, date_added: e.target.value })}
            />
          </div>
          <div className="form-group mb-section">
            <label>Дата последнего повторения:</label>
            <input
              type="date"
              className="form-control"
              value={selectedWord.date_repeated ? dayjs(selectedWord.date_repeated).format('YYYY-MM-DD') : ''}
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
    </div>
  );
};

export default RepeatWords;
