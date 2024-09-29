import React, { useState, useEffect } from 'react';
import { getHistory, deleteHistoryEntry, clearHistory } from '../services/api';
import Sidebar from './Nav/Sidebar';

const History = () => {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const response = await getHistory();
      setHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch history', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteHistoryEntry(id);
      await fetchHistory(); // Re-fetch history after successful deletion
    } catch (error) {
      console.error('Failed to delete entry', error);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearHistory();
      await fetchHistory(); // Re-fetch history after clearing all entries
    } catch (error) {
      console.error('Failed to clear history', error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-100 overflow-auto ml-48">
        <div className="container mx-auto p-4 bg-gray-100 min-h-screen ml-24 w-5/6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Translation History
            </h2>
            <button
              onClick={handleClearAll}
              className="text-red-500 hover:text-red-700 focus:outline-none"
            >
              Clear All
            </button>
          </div>
          <ul className="space-y-4">
            {history.map((entry) => (
              <li
                key={entry._id} // Ensure _id is passed correctly
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex justify-between items-center"
              >
                <div className="text-lg font-semibold text-gray-900">
                  {entry.text}
                </div>
                <div className="text-sm text-gray-600">{`→ ${entry.translatedText}`}</div>
                <div className="text-xs text-gray-500 mt-2">{`${new Date(
                  entry.createdAt
                ).toLocaleString()}`}</div>
                <button
                  onClick={() => handleDelete(entry._id)} // Ensure _id is passed correctly
                  className="ml-4 text-red-500 hover:text-red-700 focus:outline-none"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default History;
