import React from "react";
import dayjs from "dayjs";
import axios from "axios";
import { useState, useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";

import { fetchWordData } from '../../utils/apiUtils';

const translations = {
    fi: {
        back: "Takaisin",
        editWord: "Muokkaa sanaa",
        searchEngWiki: "Hae engl. Wiki",
        searchFiWiki: "Hae suom. Wiki",
        searchSlang: "Hae slangi",
        saveSuccessMessage: "Sana tallennettu onnistuneesti!",
        word: "Sana",
        translation: "Käännös",
        category: "Kategoria",
        category2: "Toinen kategoria",
        source: "Lähde",
        popularity: "Suosio",
        repeat: "Toista uudelleen",
        comment: "Kommentti",
        examples: "Esimerkit",
        synonyms: "Synonyymit",
        wordFormation: "Sananmuodostus",
        frequency: "Top 10,000",
        dateAdded: "Lisäyspäivämäärä",
        dateRepeated: "Viimeisin toistopäivä",
        saveUpdates: "Tallenna muutokset",
        error: "Virhe tallennettaessa sanaa:",
    },

    ru: {
        back: "Назад",
        editWord: "Редактировать слово",
        searchEng: "Поиск англ. Wiki",
        searchFi: "Поиск фин. Wiki",
        searchSlang: "Поиск сленга",
        saveSuccessMessage: "Слово успешно сохранено!",
        word: "Финское слово",
        translation: "Перевод",
        category: "Категория",
        category2: "Категория 2",
        source: "Источник",
        popularity: "Популярность",
        repeat: "На повторение",
        comment: "Комментарий",
        examples: "Примеры",
        synonyms: "Синонимы",
        wordFormation: "Словообразование",
        frequency: "Топ 10,000",
        dateAdded: "Дата добавления",
        dateRepeated: "Дата последнего повторения",
        saveUpdates: "Сохранить изменения",
        error: "Ошибка при сохранении слова:",
    },
    en: {
        back: "Back",
        editWord: "Edit word",
        searchEngWiki: "Search Eng. Wiki",
        searchFiWiki: "Search Fin. Wiki",
        searchSlang: "Search Slang",
        successMessage: "Word successfully saved!",
        word: "Finnish word",
        translation: "Translation",
        category: "Category",
        category2: "Category 2",
        source: "Source",
        popularity: "Popularity",
        repeat: "Repeat again",
        comment: "Comment",
        examples: "Examples",
        synonyms: "Synonyms",
        wordFormation: "Word formation",
        frequency: "Top 10,000",
        dateAdded: "Date added",
        dateRepeated: "Date repeated",
        saveUpdates: "Save updates",
        error: "Error saving word:",
    },
};



const EditWord = ({
    selectedWord,
    setSelectedWord,
}) => {

    const [successMessage, setSuccessMessage] = useState('-');
    const { language } = useContext(LanguageContext);
    const t = translations[language] || translations.fi;

    //back to list
    const handleBackToList = () => {
        setSelectedWord(null);
    };

    // save word to database
    const handleSaveWord = async () => {
        try {
            await axios.put(`/api/words/${selectedWord.id}`, selectedWord);
            alert(t.saveSuccessMessage);
            handleBackToList();
        } catch (error) {
            console.error(t.error, error);
        }
    };

    if (!selectedWord) return null;

    return (

        <div className="card position-relative">
            <button className="btn btn-secondary back-top-right" onClick={handleBackToList}>
                {t.back}
            </button>
            <h2>{t.editWord}</h2>

            <div className="d-flex justify-content-around mb-3 mt-3">
                <button
                    onClick={() =>
                        fetchWordData(selectedWord.word, 'eng', setSelectedWord, setSuccessMessage)
                    }
                    className="btn btn-info"
                    disabled={!selectedWord.word}
                >
                    {t.searchEngWiki}
                </button>
                <button
                    onClick={() =>
                        fetchWordData(selectedWord.word, 'fi', setSelectedWord, setSuccessMessage)
                    }
                    className="btn btn-info"
                    disabled={!selectedWord.word}
                >
                    {t.searchFiWiki}
                </button>
                <button
                    onClick={() =>
                        fetchWordData(selectedWord.word, 'slang', setSelectedWord, setSuccessMessage)
                    }
                    className="btn btn-info"
                    disabled={!selectedWord.word}
                >
                    {t.searchSlang}
                </button>
            </div>

            {successMessage && <p className="status-text mt-3">{successMessage}</p>}

            <div className="form-group mb-section">
                <label>{t.word}:</label>
                <input
                    type="text"
                    className="form-control"
                    value={selectedWord.word}
                    onChange={(e) => setSelectedWord({ ...selectedWord, word: e.target.value })}
                />
            </div>
            <div className="form-group mb-section">
                <label>{t.translation}:</label>
                <textarea
                    className="form-control"
                    rows="4"
                    value={selectedWord.translation}
                    onChange={(e) => setSelectedWord({ ...selectedWord, translation: e.target.value })}
                />
            </div>
            <div className="form-group mb-section">
                <label>{t.category}:</label>
                <input
                    type="text"
                    className="form-control"
                    value={selectedWord.category}
                    onChange={(e) => setSelectedWord({ ...selectedWord, category: e.target.value })}
                />
            </div>
            <div className="form-group mb-section">
                <label>{t.category2}:</label>
                <input
                    type="text"
                    className="form-control"
                    value={selectedWord.category2}
                    onChange={(e) => setSelectedWord({ ...selectedWord, category2: e.target.value })}
                />
            </div>
            <div className="form-group mb-section">
                <label>{t.source}:</label>
                <input
                    type="text"
                    className="form-control"
                    value={selectedWord.source}
                    onChange={(e) => setSelectedWord({ ...selectedWord, source: e.target.value })}
                />
            </div>
            <div className="form-group mb-section">
                <label>{t.popularity}:</label>
                <input
                    type="number"
                    className="form-control"
                    value={selectedWord.popularity}
                    onChange={(e) => setSelectedWord({ ...selectedWord, popularity: e.target.value })}
                />
            </div>
            <div className="form-group mb-section">
                <label>{t.repeat}:</label>
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
                <label>{t.comment}:</label>
                <textarea
                    className="form-control"
                    rows="4"
                    value={selectedWord.comment}
                    onChange={(e) => setSelectedWord({ ...selectedWord, comment: e.target.value })}
                />
            </div>
            <div className="form-group mb-section">
                <label>{t.examples}:</label>
                <textarea
                    className="form-control"
                    rows="5" // Увеличиваем высоту текстового поля
                    value={selectedWord.example}
                    onChange={(e) => setSelectedWord({ ...selectedWord, example: e.target.value })}
                />
            </div>
            <div className="form-group mb-section">
                <label>{t.synonyms}:</label>
                <textarea
                    className="form-control"
                    value={selectedWord.synonyms}
                    onChange={(e) => setSelectedWord({ ...selectedWord, synonyms: e.target.value })}
                />
            </div>
            <div className="form-group mb-section">
                <label>{t.wordFormation}:</label>
                <textarea
                    className="form-control"
                    value={selectedWord.word_formation}
                    onChange={(e) => setSelectedWord({ ...selectedWord, word_formation: e.target.value })}
                />
            </div>
            <div className="form-group mb-section">
                <label>{t.frequency}:</label>
                <input
                    type="number"
                    className="form-control"
                    value={selectedWord.frequency}
                    onChange={(e) => setSelectedWord({ ...selectedWord, frequency: e.target.value })}
                />
            </div>
            <div className="form-group mb-section">
                <label>{t.dateAdded}:</label>
                <input
                    type="date"
                    className="form-control mb-section"
                    value={selectedWord.date_added ? dayjs(selectedWord.date_added).format('YYYY-MM-DD') : ''}
                    onChange={(e) => setSelectedWord({ ...selectedWord, date_added: e.target.value })}
                />
            </div>
            <div className="form-group mb-section">
                <label>{t.dateRepeated}:</label>
                <input
                    type="date"
                    className="form-control"
                    value={selectedWord.date_repeated ? dayjs(selectedWord.date_repeated).format('YYYY-MM-DD') : ''}
                    onChange={(e) => setSelectedWord({ ...selectedWord, date_repeated: e.target.value })}
                />
            </div>
            <button className="btn btn-success mt-3" onClick={handleSaveWord}>
                {t.saveUpdates}
            </button>
            <button className="btn btn-secondary mt-3" onClick={handleBackToList}>
                {t.back}
            </button>
        </div>

    );
};

export default EditWord;