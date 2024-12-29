import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

import Slider from 'react-slick'; // For carousel view
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EditWord from '../components/general/EditWord';
import SearchDialog from '../components/repeat/SearchDialog';
import DaysDialog from '../components/repeat/DaysDialog';
import FloatingSearchButton from '../components/repeat/FloatingSearchButton';
import { InfinitySpin } from 'react-loader-spinner';


const RepeatWords = () => {
  const [level, setLevel] = useState(1);
  const [words, setWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null); // Выбранное слово для редактирования
  const [daysSinceLastRepeat, setDaysSinceLastRepeat] = useState(0); // Days since last repeat
  const [levelDays, setLevelDays] = useState([]); // Days for each level  
  const [customDate, setCustomDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [globalShowTranslation, setGlobalShowTranslation] = useState(true);

  const [isCarouselView, setIsCarouselView] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [isSearchDialogOpen, setSearchDialogOpen] = useState(false);
  const [isDaysDialogOpen, setDaysDialogOpen] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0); // just to refresh the page
  const [loading, setLoading] = useState(true);
  const [loadingLevelUp, setLoadingLevelUp] = useState(false);

  // Fetch words on page load and when level changes
  useEffect(() => {
    const fetchWords = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/words/repeat?level=${level}`);

        // Fetch level days
        const response1 = await axios.get(`/api/words/level-days`);
        const levelDaysMap = Array(12).fill("-"); // Default to "-"
        response1.data.forEach(([level, days]) => {
          levelDaysMap[level - 1] = days; // Map level to index (level - 1)
        });
        setLevelDays(levelDaysMap);

        setLoading(false);

        // Initialize each word with a `showTranslation` property
        const wordsWithToggle = response.data.map((word) => ({
          ...word,
          showTranslation: globalShowTranslation
        }));

        setWords(wordsWithToggle);
        setDaysSinceLastRepeat(wordsWithToggle.length > 0 ? wordsWithToggle[0].dayssincelastrepeat : 0);

      } catch (error) {
        console.error('Ошибка при загрузке слов:', error);
      }
    };

    setCurrentSlide(0); // Reset the current slide index
    fetchWords();

  }, [level, refreshKey]);

  // apply filter for days since last repeat
  const fetchWordsDaysFilter = async (days) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/words/repeat?level=${level}&days_since_last_repeat=${days}`);
      setLoading(false);

      if (response.data.length > 0) {

        const wordsWithToggle = response.data.map((word) => ({
          ...word,
          showTranslation: globalShowTranslation
        }));

        setWords(wordsWithToggle);
        setDaysSinceLastRepeat(days);
      } else {
        alert('Нет слов для отображения');
      }
    } catch (error) {
      console.error('Ошибка при загрузке слов:', error);
    }
  };

  // Toggle word visibility
  const toggleWordVisibility = (id) => {
    setWords(words.map((word) =>
      word.id === id ? { ...word, showTranslation: !word.showTranslation, textType: 'word' } : word
    ));
  };

  // Toggle all words visibility
  const toggleAllWordsVisibility = () => {
    setGlobalShowTranslation(!globalShowTranslation);
    setWords(words.map((word) => ({
      ...word,
      showTranslation: !globalShowTranslation
    })));
  };

  // next level
  const handleNextLevel = async () => {
    setLoadingLevelUp(true);
    try {
      const updatedWords = {
        level,
        daysSinceLastRepeat,
        date_repeated: customDate
      };
      await axios.post(`/api/words/upgrade`, updatedWords);
      setLoadingLevelUp(false);
      alert('Слова перенесены на следующий уровень!');

      // Refresh page
      setRefreshKey((prevKey) => prevKey + 1);

    } catch (error) {
      console.error('Ошибка при обновлении уровня:', error);
    }
  };

  // Custom arrow for carousel
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

  // Carousel settings
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
          {/* Info about days and level */}
          <h2>Уровень {level}</h2>
          {loading ? (
            <div className="loading-container-small">
              <InfinitySpin width="200" color="#4fa94d" />
            </div>
          ) : (
            <>
              <div className="statistics-container">
                <div className="statistics-item">
                  <h5>Дней</h5>
                  <p>{daysSinceLastRepeat}</p>
                </div>
                <div className="statistics-item">
                  <h5>Слов</h5>
                  <p>{words.length}</p>
                </div>
              </div>
            </>
          )}

          {/* Level Selector with Next Button */}
          <div className="level-selector-container">
            <select
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value, 10))}
              className="level-selector"
            >
              {[...Array(12).keys()].map((lvl) => {
                const days = levelDays[lvl] !== undefined ? levelDays[lvl] : "-";
                return (
                  <option key={lvl + 1} value={lvl + 1}>
                    Уровень {lvl + 1} ({days})
                  </option>
                );
              })}
            </select>

            <button
              className="btn btn-secondary show-days-button"
              onClick={() => setDaysDialogOpen(true)}
            >
              +
            </button>



            <button
              className="next-level-button"
              onClick={() => setLevel((prevLevel) => (Number(prevLevel) < 12 ? Number(prevLevel) + 1 : 1))}
            >
              &#8250;
            </button>
          </div>


          {/* Buttons to set words/translations and carousel/list */}
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

          {loading ? (
            <div className="loading-container-average">
              <InfinitySpin width="200" color="#4fa94d" />
            </div>
          ) : (
            // Display words in a list or carousel
            <>
              {!isCarouselView ? (
                // List view
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
                // Carousel view
                <Slider
                  {...settings}
                  arrows={Array.isArray(words) && words.length > 0}
                >
                  {Array.isArray(words) && words.length > 0 ? (
                    words.map((word, index) => (
                      <div key={word.id} className="carousel-card">

                        {/* Content Type Label */}
                        <div
                          className="content-label"
                          style={{
                            color: word.showTranslation
                              ? '#007bff' // Blue for translation
                              : word.textType === 'comment'
                                ? '#17a2b8' // Info color for comment
                                : word.textType === 'example'
                                  ? '#ffc107' // Warning color for example
                                  : '#28a745', // Green for word
                          }}
                        >
                          {'●'}
                        </div>

                        {/* Scrollable Text Block */}
                        <div
                          className={`text-block ${!word.showTranslation && word.textType !== 'comment' && word.textType !== 'example'
                            ? 'centered-text'
                            : ''
                            }`}
                          onClick={() =>
                            setWords(
                              words.map((w) =>
                                w.id === word.id
                                  ? { ...w, showTranslation: !w.showTranslation, textType: 'word' } // Reset textType to 'word'
                                  : w
                              )
                            )
                          }
                        >
                          <p
                            className={`text ${!word.showTranslation && word.textType !== 'comment' && word.textType !== 'example'
                              ? 'large-text'
                              : ''
                              }`}
                          >
                            {word.showTranslation
                              ? word.translation
                              : word.textType === 'comment'
                                ? word.comment || 'Нет комментариев'
                                : word.textType === 'example'
                                  ? word.example || 'Нет примеров'
                                  : word.word}
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

                          <button
                            className="btn btn-info word-button"
                            onClick={() =>
                              setWords(
                                words.map((w) =>
                                  w.id === word.id
                                    ? { ...w, showTranslation: false, textType: 'comment' }
                                    : w
                                )
                              )
                            }
                          >
                            Коммент
                          </button>
                          <button
                            className="btn btn-warning word-button"
                            onClick={() =>
                              setWords(
                                words.map((w) =>
                                  w.id === word.id
                                    ? { ...w, showTranslation: false, textType: 'example' }
                                    : w
                                )
                              )
                            }
                          >
                            Примеры
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
            </>
          )}

          {/* Level Up Button */}
          <div className="level-up-block d-flex align-items-center mt-3">
            <button className="btn btn-primary" onClick={handleNextLevel} disabled={loadingLevelUp}>
              {loadingLevelUp ? (
                <span className="loading-dots">
                  Loading<span>.</span><span>.</span><span>.</span>
                </span>
              ) : (
                "Level up!"
              )}
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
        <EditWord
          selectedWord={selectedWord}
          setSelectedWord={setSelectedWord}
        />
      )}

      <div>
        {/* Floating Search Button */}
        <FloatingSearchButton onClick={() => setSearchDialogOpen(true)} />

        {/* Dialog */}
        {isSearchDialogOpen && (
          <SearchDialog onClose={() => setSearchDialogOpen(false)} />
        )}
      </div>

      <DaysDialog
        isOpen={isDaysDialogOpen}
        onClose={() => setDaysDialogOpen(false)}
        onApply={fetchWordsDaysFilter}
      />

    </div>
  );
};

export default RepeatWords;
