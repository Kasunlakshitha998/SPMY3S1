import React, { useState, useEffect } from 'react';
import { getHistory } from '../services/api';

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getHistory();
        setHistory(response.data);
      } catch (error) {
        console.error('Failed to fetch history', error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div>
      <h2>Translation History</h2>
      <ul>
        {history.map((entry, index) => (
          <li key={index}>
            {entry.text} → {entry.translatedText} @{entry.createdAt}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
