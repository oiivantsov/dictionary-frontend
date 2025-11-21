import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { use } from "react";
import { ClipLoader } from "react-spinners";
import { LanguageContext } from '../context/LanguageContext';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const translations = {
  fi: {
    title: "Sanakirja",
    searchBy: "Hae sanalla",
    searchPlaceholder: "Etsi sanalla tai käännöksellä",
    searchButton: "Etsi",
    searchWord: "Suomi",
    searchTranslation: "Venäjä",
    statusReady: "Valmis!",
    statusNotFound: "Sanaa ei löytynyt",
    statusError: "Tapahtui virhe haussa",
    backButton: "Takaisin tuloksiin",
    deleteButton: "Poista sana",
    deleteConfirm: "Oletko varma, että haluat poistaa sanan?",
    translation: "Käännös",
    category: "Kategoria",
    secondCategory: "Toinen kategoria",
    source: "Lähde",
    synonyms: "Synonyymit",
    examples: "Esimerkit",
    wordFormation: "Sanamuodostus",
    comment: "Kommentti",
    level: "Taso",
    popularity: "Suosio",
    forReview: "Toistettavaksi",
    dateAdded: "Lisäyspäivämäärä",
    lastReviewDate: "Viimeisin toistopäivä",
    daysSinceLastReview: "Päiviä viimeisestä toistosta",
    top10000: "Top 10,000",
  },
  ru: {
    title: "Словарик",
    searchBy: "Поиск по слову",
    searchPlaceholder: "Искать по слову или переводу",
    searchButton: "Поиск",
    searchWord: "финский",
    searchTranslation: "русский",
    statusReady: "Готов к работе!",
    statusNotFound: "Слово не найдено",
    statusError: "Произошла ошибка при поиске",
    backButton: "Назад к результатам",
    deleteButton: "Удалить слово",
    deleteConfirm: "Вы уверены, что хотите удалить это слово?",
    translation: "Перевод",
    category: "Категория",
    secondCategory: "Вторая категория",
    source: "Источник",
    synonyms: "Синонимы",
    examples: "Примеры",
    wordFormation: "Словообразование",
    comment: "Комментарий",
    level: "Уровень",
    popularity: "Популярность",
    forReview: "На повторение",
    dateAdded: "Дата добавления",
    lastReviewDate: "Последняя дата повторения",
    daysSinceLastReview: "Дни с последнего повторения",
    top10000: "Топ 10,000",
  },
  en: {
    title: "Dictionary",
    searchBy: "Search by word",
    searchPlaceholder: "Search by word or translation",
    searchButton: "Search",
    searchWord: "Finnish",
    searchTranslation: "Russian",
    statusReady: "Ready!",
    statusNotFound: "Word not found",
    statusError: "An error occurred during search",
    backButton: "Back to results",
    deleteButton: "Delete word",
    deleteConfirm: "Are you sure you want to delete this word?",
    translation: "Translation",
    category: "Category",
    secondCategory: "Second Category",
    source: "Source",
    synonyms: "Synonyms",
    examples: "Examples",
    wordFormation: "Word Formation",
    comment: "Comment",
    level: "Level",
    popularity: "Popularity",
    forReview: "For Review",
    dateAdded: "Date Added",
    lastReviewDate: "Last Review Date",
    daysSinceLastReview: "Days Since Last Review",
    top10000: "Top 10,000",
  },
};

const SearchWords = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("word"); // Either 'word' or 'translation'
  const [results, setResults] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [statusMessage, setStatusMessage] = useState("-");
  const [loading, setLoading] = useState(false); // Add loading state
  const { language } = useContext(LanguageContext);
  const t = translations[language] || translations.fi;

  // Add simple search useEffect to start loading data on page load
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get(`/fi/api/words/search`, {
          params: {
            [searchBy]: "mennä", // Example default search term
          },
        });
        setStatusMessage(""); // Reset status message
      } catch (error) {
        console.error("Error loading data:", error);
        setStatusMessage(t.statusError);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchInitialData();
  }, [language]); // Empty dependency array to run once on component mount

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert(t.searchPlaceholder);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`/api/words/search`, { params: { [searchBy]: searchTerm } });
      setResults(response.data);
      setStatusMessage(response.data.length === 0 ? t.statusNotFound : "");
      setSelectedWord(null);
    } catch (error) {
      setStatusMessage(t.statusError);
    } finally {
      setLoading(false);
    }
  };

  const handleWordClick = (word) => {
    console.log(word);
    setSelectedWord(word);
    setStatusMessage("-");
  };

  const handleBack = () => {
    setSelectedWord(null); // Return to search results view
  };

  const handleDelete = async () => {
    if (window.confirm(t.deleteConfirm)) {
      try {
        await axios.delete(`/fi/api/words/${selectedWord.id}`);
        alert(t.deleteButton);
        setSelectedWord(null);
        handleSearch();
      } catch (error) {
        console.error(t.statusError, error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">{t.title}</h1>

      {/* Search Section */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <div className="form-group d-flex mb-3">
            <input
              type="text"
              className="form-control input-short"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="form-control ml-2"
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              style={{ maxWidth: "150px" }}
            >
              <option value="word">{t.searchWord}</option>
              <option value="translation">{t.searchTranslation}</option>
            </select>
          </div>

          {/* Show Loading Indicator */}
          {loading ? (
            <div className="d-flex justify-content-center my-3">
              <ClipLoader color="#007bff" size={50} />
            </div>
          ) : (

          <div className="form-group text-center mt-3">
            <button className="btn btn-primary w-50" onClick={handleSearch}>
              {t.searchButton}
            </button>
          </div>
          )}
        </div>
      </div>




      {/* Word Detail Section */}
      {selectedWord ? (
        <div className="card p-3">
          <h2 className="card-title">{selectedWord.word}</h2>
          <p><strong>{t.translation}:</strong> {selectedWord.translation}</p>
          <p><strong>{t.category}:</strong> {selectedWord.category}</p>
          <p><strong>{t.secondCategory}:</strong> {selectedWord.category2}</p>
          <p><strong>{t.source}:</strong> {selectedWord.source}</p>
          <p><strong>{t.synonyms}:</strong> {selectedWord.synonyms}</p>
          <p><strong>{t.examples}:</strong> {selectedWord.example}</p>
          <p><strong>{t.wordFormation}:</strong> {selectedWord.word_formation}</p>
          <p><strong>{t.comment}:</strong> {selectedWord.comment}</p>
          <p><strong>{t.level}:</strong> {selectedWord.level}</p>
          <p><strong>{t.popularity}:</strong> {selectedWord.popularity}</p>
          <p><strong>{t.forReview}:</strong> {selectedWord.repeat_again}</p>
          <p><strong>{t.dateAdded}:</strong> {selectedWord.date_added}</p>
          <p><strong>{t.lastReviewDate}:</strong> {selectedWord.date_repeated}</p>
          <p><strong>{t.daysSinceLastReview}:</strong> {selectedWord.days_since_last_repeat}</p>
          <p><strong>{t.top10000}:</strong> {selectedWord.frequency}</p>
          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-secondary" onClick={handleBack}>
              {t.backButton}
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              {t.deleteButton}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          {/* Results Section */}
          {results.length > 0 ? (
            <div className="list-group">
              {results.map((word) => (
                <button
                  key={word.id}
                  className="list-group-item list-group-item-action mb-2"
                  onClick={() => handleWordClick(word)}
                >
                  <strong>{word.word}</strong> - {word.translation}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center">{statusMessage}</p>
          )}
        </div>
      )}

    </div>
  );
};

export default SearchWords;
