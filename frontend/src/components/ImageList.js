import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Nav/Sidebar';
import Cookies from 'js-cookie';

function ImageList({ handleLogout }) {
  const [savedItems, setSavedItems] = useState([]);

  const currentUserId = Cookies.get('userId');

  // Fetch saved items
  useEffect(() => {
    const fetchSavedItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/imageSave/');
        const saveItem = response.data.filter(
          (entry) => entry.user === currentUserId
        );
        setSavedItems(saveItem);
      } catch (err) {
        console.error('Failed to fetch saved items', err);
      }
    };

    fetchSavedItems();
  }, []);

  // Handle delete item
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/imageSave/delete/${id}`); // Adjust URL to match your backend route
      // Update the state after deleting an item by filtering it out of the savedItems
      setSavedItems(savedItems.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Failed to delete item', err);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar handleLogout={handleLogout} />

      <div className="flex-1 p-8 bg-gray-100 overflow-auto ml-10">
        <div className="space-y-4 w-9/12 ml-60">
          {savedItems.map((item) => (
            <div
              key={item._id}
              className="p-4 border border-gray-300 rounded-lg shadow-md"
            >
              <div className="mb-4 w-52 border-r-black m-5">
                <img
                  src={`${item.image}`}
                  alt="Saved"
                  className="h-50 w-50 rounded-lg"
                />
              </div>
              <div className="mb-2">
                <p className="font-bold">Original Text:</p>
                <p>{item.originalText}</p>
              </div>
              <div>
                <p className="font-bold">Translated Text:</p>
                <p>{item.translatedText}</p>
              </div>
              <button
                onClick={() => handleDelete(item._id)}
                className="mt-4 text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImageList;
