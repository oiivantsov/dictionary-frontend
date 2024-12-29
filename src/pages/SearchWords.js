import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { use } from "react";
import { ClipLoader } from "react-spinners";

axios.defaults.baseURL = 'https://dict-backend.onrender.com';
//  axios.defaults.baseURL = 'http://localhost:8000'; 

const SearchWords = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("word"); // Either 'word' or 'translation'
  const [results, setResults] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [statusMessage, setStatusMessage] = useState("-");
  const [loading, setLoading] = useState(false); // Add loading state

  // Add simple search useEffect to start loading data on page load
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get(`/api/words/search`, {
          params: {
            [searchBy]: "mennä", // Example default search term
          },
        });
        setStatusMessage("Готов к работе!");
      } catch (error) {
        console.error("Error loading data:", error);
        setStatusMessage("Какая-то ошибка при загрузке данных");
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchInitialData();
  }, []); // Empty dependency array to run once on component mount

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert("Please enter a search term");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`/api/words/search`, {
        params: {
          [searchBy]: searchTerm,
        },
      });
      console.log(response);
      if (response.data.length === 0) {
        setStatusMessage("Слово не найдено");
      } else {
        setStatusMessage(""); // Clear status message if results are found
      }
      setResults(response.data);
      setSelectedWord(null); // Clear selected word if a new search is performed
    } catch (error) {
      console.error("Error fetching data:", error);
      setStatusMessage("Произошла ошибка при поиске");
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
    if (window.confirm("Вы уверены, что хотите удалить это слово?")) {
      try {
        await axios.delete(`/api/words/${selectedWord.id}`);
        alert("Слово успешно удалено!");
        setSelectedWord(null); // Return to search results view
        handleSearch(); // Refresh search results after deletion
      } catch (error) {
        console.error("Ошибка при удалении слова:", error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Словарик</h1>

      {/* Search Section */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <div className="form-group d-flex mb-3">
            <input
              type="text"
              className="form-control input-short"
              placeholder={`Search by ${searchBy}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="form-control ml-2"
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              style={{ maxWidth: "150px" }}
            >
              <option value="word">финский</option>
              <option value="translation">русский</option>
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
              Поиск
            </button>
          </div>
          )}
        </div>
      </div>




      {/* Word Detail Section */}
      {selectedWord ? (
        <div className="card p-3">
          <h2 className="card-title">{selectedWord.word}</h2>
          <p><strong>Перевод:</strong> {selectedWord.translation}</p>
          <p><strong>Категория:</strong> {selectedWord.category}</p>
          <p><strong>Вторая категория:</strong> {selectedWord.category2}</p>
          <p><strong>Источник:</strong> {selectedWord.source}</p>
          <p><strong>Синонимы:</strong> {selectedWord.synonyms}</p>
          <p><strong>Примеры:</strong> {selectedWord.example}</p>
          <p><strong>Словообразование:</strong> {selectedWord.word_formation}</p>
          <p><strong>Комментарий:</strong> {selectedWord.comment}</p>
          <p><strong>Уровень:</strong> {selectedWord.level}</p>
          <p><strong>Популярность:</strong> {selectedWord.popularity}</p>
          <p><strong>На повторение:</strong> {selectedWord.repeat_again}</p>
          <p><strong>Дата добавления:</strong> {selectedWord.date_added}</p>
          <p><strong>Последняя дата повторения:</strong> {selectedWord.date_repeated}</p>
          <p><strong>Дни с последнего повторения:</strong> {selectedWord.days_since_last_repeat}</p>
          <p><strong>Топ 10,000:</strong> {selectedWord.frequency}</p>
          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-secondary" onClick={handleBack}>
              Назад к результатам
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Удалить слово
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
            <p className="text-center">{statusMessage || "status message"}</p>
          )}
        </div>
      )}

    </div>
  );
};

export default SearchWords;
