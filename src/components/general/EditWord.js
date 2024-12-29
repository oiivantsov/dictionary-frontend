import React from "react";
import dayjs from "dayjs";
import axios from "axios";
import { useState } from "react";

import { fetchWordData } from '../../utils/apiUtils';

const EditWord = ({
    selectedWord,
    setSelectedWord,
}) => {

    const [successMessage, setSuccessMessage] = useState('-');

    //back to list
    const handleBackToList = () => {
        setSelectedWord(null);
    };

    // save word to database
    const handleSaveWord = async () => {
        try {
            await axios.put(`/api/words/${selectedWord.id}`, selectedWord);
            alert('Слово успешно сохранено!');
            handleBackToList();
        } catch (error) {
            console.error('Ошибка при сохранении слова:', error);
        }
    };

    if (!selectedWord) return null;

    return (

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

    );
};

export default EditWord;