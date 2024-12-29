import React, { useState } from 'react';
import axios from 'axios';

const SearchDialog = ({ onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('word');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            alert('Please enter a search term');
            return;
        }
        try {
            setLoading(true);
            const response = await axios.get(`/api/words/search`, {
                params: {
                    [searchBy]: searchTerm,
                },
            });
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-dialog">
            <div className="dialog-content">
                <button className="close-button" onClick={onClose}>
                    ×
                </button>
                <div className="form-group d-flex mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder={`Слово...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="form-control ml-2"
                        value={searchBy}
                        onChange={(e) => setSearchBy(e.target.value)}
                    >
                        <option value="word">Финский</option>
                        <option value="translation">Русский</option>
                    </select>
                </div>

                {loading ? (
                    <div className="loading-indicator">Загрузка...</div>
                ) : (
                    <ul className="results-list">
                        {results.map((result) => (
                            <li key={result.id} className="result-item">
                                <span className="word">{result.word}</span> - {result.translation}
                            </li>
                        ))}
                    </ul>
                )}

                <button className="btn btn-primary w-50 mt-4" onClick={handleSearch}>
                    Поиск
                </button>
            </div>
        </div>
    );
};

export default SearchDialog;
