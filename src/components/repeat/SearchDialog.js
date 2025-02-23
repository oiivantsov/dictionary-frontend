import React, { useState, useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import axios from 'axios';

const translations = {
    fi: {
        search: 'Hae',
        word: 'Sana...',
        translation: 'Käännös',
        searchResults: 'Hakutulokset',
        loading: 'Ladataan',
        alertMessage: 'Anna hakusana',
        errorMessage: 'Virhe haettaessa hakutuloksia',
        finLan: 'Suomi',
        rusLang: 'Venäjä',
    },
    ru: {
        search: 'Поиск',
        word: 'Слово...',
        translation: 'Перевод',
        searchResults: 'Результаты поиска',
        loading: 'Загрузка',
        alertMessage: 'Введите слово для поиска',
        errorMessage: 'Ошибка при получении результатов поиска',
        finLan: 'Финский',
        rusLang: 'Русский',
    },
    en: {
        search: 'Search',
        word: 'Word...',
        translation: 'Translation',
        searchResults: 'Search Results',
        loading: 'Loading',
        alertMessage: 'Please enter a search term',
        errorMessage: 'Error fetching search results',
        finLan: 'Finnish',
        rusLang: 'Russian',
    },
};

const SearchDialog = ({ onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('word');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const { language } = useContext(LanguageContext);
    const t = translations[language] || translations.fi;

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            alert(t.alertMessage);
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
            console.error(t.errorMessage, error);
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
                        placeholder={t.word}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="form-control ml-2"
                        value={searchBy}
                        onChange={(e) => setSearchBy(e.target.value)}
                    >
                        <option value="word">{t.finLan}</option>
                        <option value="translation">{t.rusLang}</option>
                    </select>
                </div>

                {loading ? (
                    <div className="loading-indicator">{t.loading}...</div>
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
                    {t.search}
                </button>
            </div>
        </div>
    );
};

export default SearchDialog;
