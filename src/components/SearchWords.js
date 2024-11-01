import React, { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';  // Importing Bootstrap

axios.defaults.baseURL = 'http://localhost:8080';  // Replace with your actual backend URL if different

const SearchWords = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("word"); // Either 'word' or 'translation'
  const [results, setResults] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert("Please enter a search term");
      return;
    }
    try {
      const response = await axios.get(`/api/words/search`, {
        params: {
          [searchBy]: searchTerm,
        },
      });
      setResults(response.data);
      setSelectedWord(null); // Clear selected word if a new search is performed
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

  const handleWordClick = (word) => {
    setSelectedWord(word);
  };

  const handleBack = () => {
    setSelectedWord(null); // Return to search results view
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

          <div className="form-group text-center mt-3">
            <button className="btn btn-primary w-50" onClick={handleSearch}>
              Поиск
            </button>
          </div>
        </div>
      </div>

      {/* Word Detail Section */}
      {selectedWord ? (
        <div className="card">
          <h2 className="card-title">{selectedWord.word}</h2>
          <p><strong>Перевод:</strong> {selectedWord.translation}</p>
          <p><strong>Категория:</strong> {selectedWord.category}</p>
          <p><strong>Вторая категория:</strong> {selectedWord.category2}</p>
          <p><strong>Источник:</strong> {selectedWord.source}</p>
          <p><strong>Синонимы:</strong> {selectedWord.synonyms}</p>
          <p><strong>Примеры:</strong> {selectedWord.example}</p>
          <p><strong>Словообразование:</strong> {selectedWord.wordFormation}</p>
          <p><strong>Комментарий:</strong> {selectedWord.comment}</p>
          <p><strong>Уровень:</strong> {selectedWord.level}</p>
          <p><strong>Популярность:</strong> {selectedWord.popularity}</p>
          <p><strong>На повторение:</strong> {selectedWord.repeatAgain}</p>
          <p><strong>Дата добавления:</strong> {selectedWord.dateAdded}</p>
          <p><strong>Последняя дата повторения:</strong> {selectedWord.dateRepeated}</p>
          <p><strong>Дни с последнего повторения:</strong> {selectedWord.daysSinceLastRepeat}</p>
          <p><strong>Топ 10,000:</strong> {selectedWord.frequency}</p>
          <button className="btn btn-secondary mt-3" onClick={handleBack}>
            Назад к результатам
          </button>
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
            <p className="text-center">Ничего не найдено</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchWords;
