import { useState, useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";

const translations = {
    fi: {
        daysSinceLastRepeat: "Päivät viimeisestä toistosta",
        level: "Taso",
        popularity: "Suosio",
        frequency: "Frekvenssi",
        source: "Lähde",
        category1: "Kategoria 1",
        category2: "Kategoria 2",
        repeatAgain: "Toista uudelleen",
        filtersApply: "Käytä suodattimia",
        showFilters: "Näytä suodattimet",
        hideFilters: "Piilota suodattimet",
    },
    ru: {
        daysSinceLastRepeat: "Дни с последнего повторения",
        level: "Уровень",
        popularity: "Популярность",
        frequency: "Частота",
        source: "Источник",
        category1: "Категория 1",
        category2: "Категория 2",
        repeatAgain: "Повторить снова",
        filtersApply: "Применить фильтры",
        showFilters: "Показать фильтры",
        hideFilters: "Скрыть фильтры",
    },
    en: {
        daysSinceLastRepeat: "Days since last repeat",
        level: "Level",
        popularity: "Popularity",
        frequency: "Frequency",
        source: "Source",
        category1: "Category 1",
        category2: "Category 2",
        repeatAgain: "Repeat again",
        filtersApply: "Apply filters",
        showFilters: "Show filters",
        hideFilters: "Hide filters",
    },
};

const Filters = (
    {
        fetchFilteredWords,
        filters,
        setFilters
    }
) => {

    const { language } = useContext(LanguageContext);
    const t = translations[language] || translations.fi;

    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (

        <div className="fields-container mb-3">

            <button
                className="btn btn-secondary mb-3"
                onClick={toggleCollapse}
            >
                {isCollapsed ? t.showFilters : t.hideFilters}
            </button>


            {!isCollapsed && (

                <div className="filter-page-fields">

                    <div className="form-group">
                        <label htmlFor="daysSinceLastRepeat">{t.daysSinceLastRepeat}:</label>
                        <input
                            type="number"
                            id="daysSinceLastRepeat"
                            name="daysSinceLastRepeat"
                            value={filters.daysSinceLastRepeat}
                            onChange={handleFilterChange}
                            className="form-control mb-2"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="level">{t.level}:</label>
                        <input
                            type="number"
                            id="level"
                            name="level"
                            value={filters.level}
                            onChange={handleFilterChange}
                            className="form-control mb-2"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="popularity">{t.popularity}:</label>
                        <input
                            type="number"
                            id="popularity"
                            name="popularity"
                            value={filters.popularity}
                            onChange={handleFilterChange}
                            className="form-control mb-2"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="frequency">{t.frequency}:</label>
                        <input
                            type="number"
                            id="frequency"
                            name="frequency"
                            value={filters.frequency}
                            onChange={handleFilterChange}
                            className="form-control mb-2"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="source">{t.source}:</label>
                        <input
                            type="text"
                            id="source"
                            name="source"
                            value={filters.source}
                            onChange={handleFilterChange}
                            className="form-control mb-2"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category1">{t.category1}:</label>
                        <input
                            type="text"
                            id="category1"
                            name="category1"
                            value={filters.category1}
                            onChange={handleFilterChange}
                            className="form-control mb-2"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category2">{t.category2}:</label>
                        <input
                            type="text"
                            id="category2"
                            name="category2"
                            value={filters.category2}
                            onChange={handleFilterChange}
                            className="form-control mb-2"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="repeatAgain">{t.repeatAgain}:</label>
                        <input
                            type="number"
                            id="repeatAgain"
                            name="repeatAgain"
                            value={filters.repeatAgain}
                            onChange={handleFilterChange}
                            className="form-control mb-2"
                        />
                    </div>

                    <div className="d-flex mt-3 gap-3">

                        <button className="btn btn-primary" onClick={fetchFilteredWords}>
                            {t.filtersApply}
                        </button>


                        <button
                            className="btn btn-secondary"
                            onClick={toggleCollapse}
                        >
                            {isCollapsed ? t.showFilters : '↑↑↑'}
                        </button>
                    </div>
                </div>

            )}




        </div>

    );

};

export default Filters;