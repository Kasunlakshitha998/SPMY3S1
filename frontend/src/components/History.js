import React, { useState, useEffect } from 'react';
import { getHistory, deleteHistoryEntry, clearHistory } from '../services/api';
import Sidebar from './Nav/Sidebar';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/solid';

const History = ({ handleLogout }) => {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarks, setBookmarks] = useState({});
  const [showColorPicker, setShowColorPicker] = useState({});
  const navigate = useNavigate();

  const currentUserId = Cookies.get('userId');
  const userid = Cookies.get('userId');
  const colors = ['red', 'blue', 'green', 'yellow', 'purple']; // Available bookmark colors

  // Mapping of color classes for Tailwind CSS
  const colorClasses = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
  };

  const fetchHistory = async () => {
    try {
      const response = await getHistory();
      const userHistory = response.data.filter(
        (entry) => entry.user === currentUserId
      );
      setHistory(userHistory);
    } catch (error) {
      console.error('Failed to fetch history', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [currentUserId]);

  const handleEdit = (entry) => {
    navigate('/', { state: { initialText: entry.text } });
  };

  const handleDelete = async (id) => {
    try {
      await deleteHistoryEntry(id);
      await fetchHistory();
    } catch (error) {
      console.error('Failed to delete entry', error);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearHistory(currentUserId);
      await fetchHistory();
    } catch (error) {
      console.error('Failed to clear history', error);
    }
  };

  const filteredHistory = history.filter((entry) =>
    (entry.text && entry.text.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (entry.translatedText && entry.translatedText.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  const handleBookmark = (id, color) => {
    setBookmarks((prev) => ({
      ...prev,
      [id]: color,
    }));

    setShowColorPicker((prev) => ({
      ...prev,
      [id]: false,
    }));
  };

  const toggleColorPicker = (id) => {
    setShowColorPicker((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="flex h-screen">
      <Sidebar handleLogout={handleLogout} />
      <div className="flex-1 p-8 bg-gray-100 overflow-auto ml-48 mt-16">
        <div className="container mx-auto p-4 bg-gray-100 min-h-screen ml-24 w-5/6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Translation History</h2>
            <button
              onClick={handleClearAll}
              className="text-red-500 hover:text-red-700 focus:outline-none"
            >
              Clear All
            </button>
          </div>

          <input
            type="text"
            placeholder="Search history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 p-2 border rounded w-full"
          />

          <ul className="space-y-4">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((entry) => (
                <li
                  key={entry._id}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-start"
                >
                  {/* Bookmark Section - Moved to the beginning */}
                  <div className="flex items-center space-x-2 mr-4">
                    {/* Show the color picker if it is visible */}
                    {showColorPicker[entry._id] ? (
                      colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleBookmark(entry._id, color)} // Set bookmark color
                          className={`h-5 w-5 rounded-full ${colorClasses[color]} hover:bg-${color}-700 focus:outline-none`}
                        />
                      ))
                    ) : (
                      <div
                        className={`h-5 w-5 rounded-full ${
                          bookmarks[entry._id] ? colorClasses[bookmarks[entry._id]] : 'bg-gray-300'
                        }`}
                        onClick={() => toggleColorPicker(entry._id)} // Show the color picker when clicked
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {entry.text}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(entry)}
                          className="text-blue-500 hover:text-blue-700 focus:outline-none"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(entry._id)}
                          className="ml-4 text-red-500 hover:text-red-700 focus:outline-none"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">{`→ ${entry.translatedText}`}</div>
                    <div className="text-xs text-gray-500 mt-2">{`${new Date(
                      entry.createdAt
                    ).toLocaleString()}`}</div>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-gray-600">No history found for this user.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default History;
