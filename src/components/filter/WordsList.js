import React from "react";
import { LanguageContext } from '../../context/LanguageContext';
import { useContext } from 'react';

const translations = {
    fi: {
        selectAll: "Valitse kaikki",
        deselectAll: "Poista valinta",
        editWord: "Muokkaa",
        noWords: "Ei sanoja näytettäväksi"
    },
    ru: {
        selectAll: "Выбрать все",
        deselectAll: "Снять выделение",
        editWord: "Редактировать",
        noWords: "Нет слов для отображения"
    },
    en: {
        selectAll: "Select all",
        deselectAll: "Deselect all",
        editWord: "Edit",
        noWords: "No words to display"
    }
};


const WordsList = (
    {
        words,
        selectedWords,
        setSelectedWords,
        handleEditWord
    }
) => {

    const { language } = useContext(LanguageContext);
    const t = translations[language] || translations.fi;

    const handleCheckboxChange = (word, checked) => {
        if (checked) {
            setSelectedWords((prev) => [...prev, word]);
        } else {
            setSelectedWords((prev) => prev.filter((w) => w.id !== word.id));
        }
    };

    const handleSelectAll = () => {
        if (selectedWords.length === words.length) {
            setSelectedWords([]);
        } else {
            setSelectedWords(words);
        }
    };

    return (

        <>

            {/* Select All Button */}
            {words.length > 0 && (
                <div className="d-flex justify-content-end align-items-center mb-3">

                    <label htmlFor="select-all" className="form-check-label me-2">
                        {selectedWords.length === words.length
                            ? t.deselectAll
                            : t.selectAll}
                    </label>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="select-all"
                        checked={selectedWords.length === words.length}
                        onChange={(e) => {
                            if (e.target.checked) {
                                setSelectedWords(words); // Select all
                            } else {
                                setSelectedWords([]); // Deselect all
                            }
                        }}
                    />

                </div>
            )}


            <div className="row">

                {words.length > 0 ? (
                    words.map((word) => (
                        <div key={word.id} className="filter-page-col col-md-4 mb-3">
                            <div className="filter-page-card card h-100">
                                <div className="filter-page-card-body card-body d-flex flex-column">
                                    <div className="filter-page-header d-flex align-items-center mb-2">
                                        <input
                                            className="filter-page-checkbox form-check-input me-2"
                                            type="checkbox"
                                            id={`checkbox-${word.id}`}
                                            checked={selectedWords.some((w) => w.id === word.id)}
                                            onChange={(e) => handleCheckboxChange(word, e.target.checked)}
                                        />
                                        <h5 className="filter-page-title card-title mb-0">{word.word}</h5>
                                    </div>
                                    <p className="filter-page-text card-text mb-3">{word.translation}</p>
                                    <div className="filter-page-button-container mt-auto d-flex justify-content-between">
                                        <button
                                            className="filter-page-edit-btn btn btn-secondary"
                                            onClick={() => handleEditWord(word)}
                                        >
                                            {t.editWord}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>{t.noWords}</p>
                )}
            </div>

        </>

    );

};

export default WordsList;