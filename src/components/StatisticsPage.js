import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StatisticsPage = () => {
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get('/api/words/stats');
        setStatistics(response.data);
      } catch (error) {
        console.error('Ошибка при получении статистики:', error);
      }
    };

    fetchStatistics();
  }, []);

  if (!statistics) {
    return <div>Загрузка статистики...</div>;
  }

  const allDays = statistics.allDays || [];
  const distribution = statistics.distribution || {};
  const sortedDays = Array.isArray(allDays) ? allDays.sort((a, b) => a - b) : [];

  return (
    <div className="container mt-5">
      <h2>Общая статистика</h2>

      <p>Всего слов в словаре: {statistics.totalWords}</p>
      <p>Изучено слов: {statistics.studiedWords}</p>

      <h3>Распределение слов по уровням и дням с последнего повторения</h3>
      <div style={{ overflowX: 'auto' }}>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Количество дней</th>
              {[...Array(12).keys()].map(level => (
                <th key={level + 1}>Ур. {level + 1}</th>
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
                <td colSpan="13">Нет данных для отображения</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatisticsPage;
