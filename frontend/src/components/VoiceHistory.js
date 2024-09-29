import React, { useState, useEffect } from 'react';
import { getvoiceHistory, deletevoiceHistoryEntry, clearvoiceHistory } from '../services/api';
import Sidebar from './Nav/Sidebar';

const VoiceHistory = () => {
  const [voicehistory, setvoiceHistory] = useState([]);

  const fetchvoiceHistory = async () => {
    try {
      const response = await getvoiceHistory();
      setvoiceHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch voice history', error);
    }
  };

  useEffect(() => {
    fetchvoiceHistory();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deletevoiceHistoryEntry(id);
      await fetchvoiceHistory(); // Re-fetch voice history after successful deletion
    } catch (error) {
      console.error('Failed to delete entry', error);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearvoiceHistory();
      await fetchvoiceHistory(); // Re-fetch voice history after clearing all entries
    } catch (error) {
      console.error('Failed to clear voice history', error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-200 overflow-auto ml-64">
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg min-h-screen">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Voice Translations
            </h2>
           
          </div>
          <ul className="space-y-6">
            {voicehistory.map((entry) => (
              <li
                key={entry._id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col space-y-2"
              >
                <div className="text-lg font-semibold text-gray-900">
                  {entry.text}
                </div>
                <div className="text-sm text-gray-600">{`→ ${entry.translatedText}`}</div>
                <div className="text-xs text-gray-500">{`${new Date(entry.createdAt).toLocaleString()}`}</div>
                <button
                  onClick={() => handleDelete(entry._id)}
                  className="self-end bg-red-500 text-white font-medium py-1 px-3 rounded-lg hover:bg-red-600 transition duration-300"
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

export default VoiceHistory;
