import { useState } from "react";

const Filters = (
    {
        fetchFilteredWords,
        filters,
        setFilters
    }
) => {

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
                {isCollapsed ? 'Показать фильтры' : 'Скрыть фильтры'}
            </button>


            {!isCollapsed && (

                <div className="filter-page-fields">

                    <div className="form-group">
                        <label htmlFor="daysSinceLastRepeat">Дни с последнего повторения:</label>
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
                        <label htmlFor="level">Уровень:</label>
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
                        <label htmlFor="popularity">Популярность:</label>
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
                        <label htmlFor="frequency">Частота:</label>
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
                        <label htmlFor="source">Источник:</label>
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
                        <label htmlFor="category1">Категория 1:</label>
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
                        <label htmlFor="category2">Категория 2:</label>
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
                        <label htmlFor="repeatAgain">Вернуть на повторение:</label>
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
                            Применить фильтры
                        </button>


                        <button
                            className="btn btn-secondary"
                            onClick={toggleCollapse}
                        >
                            {isCollapsed ? 'Показать фильтры' : '↑↑↑'}
                        </button>
                    </div>
                </div>

            )}




        </div>

    );

};

export default Filters;