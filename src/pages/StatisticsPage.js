import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ClipLoader } from "react-spinners";
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const translations = {
  fi: {
    statistics: "Tilastot",
    totalWords: "Sanakirjan sanat yhteensä",
    studiedWords: "Opitut sanat",
    loadingStats: "Tilastojen lataaminen...",
    daysCount: "Päivien lukumäärä",
    level: "Taso",
    noData: "Ei näytettäviä tietoja",
    error: "Virhe haettaessa tilastoja:",
    levelShort: "Taso"
  },
  ru: {
    statistics: "Статистика",
    totalWords: "Всего слов в словаре",
    studiedWords: "Изучено слов",
    loadingStats: "Загрузка статистики...",
    daysCount: "Количество дней",
    level: "Уровень",
    noData: "Нет данных для отображения",
    error: "Ошибка при получении статистики:",
    levelShort: "Ур."
  },
  en: {
    statistics: "Statistics",
    totalWords: "Total words in dictionary",
    studiedWords: "Words studied",
    loadingStats: "Loading statistics...",
    daysCount: "Number of days",
    level: "Level",
    noData: "No data to display",
    error: "Error fetching statistics:",
    levelShort: "Lvl"
  }
};

const StatisticsPage = () => {
  const [statistics, setStatistics] = useState(null);

  const { language } = useContext(LanguageContext);
  const t = translations[language] || translations.fi;

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('/api/words/stats');
        setStatistics(response.data);
      } catch (error) {
        console.error(t.error, error);
      }
    };

    fetchStatistics();
  }, []);

  if (!statistics) {
    return (
      <div className="loading-container">
        <ClipLoader size={35} color={"#555"} className="spinner" />
        <span>{t.loadingStats}</span>
      </div>
    );
  }

  const allDays = statistics.allDays || [];
  const distribution = statistics.distribution || {};
  const sortedDays = Array.isArray(allDays) ? allDays.sort((a, b) => a - b) : [];
  const uniqueValues = ['1,4', '8', '16', '33', '42', '51', '71', '100', '123', '123', '200', '300'];

  return (
    <div className="container mt-5">
      <h2></h2>

      <div className="statistics-container">
        <div className="statistics-item">
          <h5>{t.totalWords}</h5>
          <p>{statistics.totalWords}</p>
        </div>
        <div className="statistics-item">
          <h5>{t.studiedWords}</h5>
          <p>{statistics.studiedWords}</p>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="table table-dark-theme">
          <thead>
            <tr>
              <th>{t.daysCount}</th>
              {[...Array(12).keys()].map(level => (
                <th key={level + 1}>
                  {t.levelShort} {level + 1} <span style={{ fontWeight: 'normal' }}> | {uniqueValues[level]}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedDays.length > 0 ? (
              sortedDays.map(days => (
                <tr key={days}>
                  <td>{days}</td>
                  {[...Array(12).keys()].map(level => (
                    <td key={level + 1}>
                      {(distribution[level + 1] && distribution[level + 1][days]) || ''}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13">{t.noData}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatisticsPage;
