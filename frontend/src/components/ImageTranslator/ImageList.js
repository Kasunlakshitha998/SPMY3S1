import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Nav/Sidebar';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImageEdite from './ImageEdite';

function ImageList({ handleLogout }) {
  const [savedItems, setSavedItems] = useState([]);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const currentUserId = Cookies.get('userId');
  const [selectedItem, setSelectedItem] = useState(null);

  const handleCardClick = (item) => {
    setSelectedItem(item); // Set the clicked card's data
    setIsPopUpOpen(true); // Open the popup
  };

  const handleClosePopup = () => {
    setIsPopUpOpen(false); // Close the popup
    fetchSavedItems();
    setSelectedItem(null);
  };

  const fetchSavedItems = async () => {
    try {
      const response = await axios.get('http://localhost:5050/imageSave/');
      const saveItem = response.data.filter(
        (entry) => entry.user === currentUserId
      );
      setSavedItems(saveItem);
    } catch (err) {
      console.error('Failed to fetch saved items', err);
    }
  };

  // Fetch saved items
  useEffect(() => {
    fetchSavedItems();
  }, []);

  // Handle delete item
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/imageSave/delete/${id}`); // Adjust URL to match your backend route
      // Update the state after deleting an item by filtering it out of the savedItems
      setSavedItems(savedItems.filter((item) => item._id !== id));

      toast.success('Delete successfully!', {
        position: 'top-right',
        autoClose: 3000, // Auto close after 3 seconds
      });
    } catch (err) {
      console.error('Failed to delete item', err);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar handleLogout={handleLogout} />

      <div className="flex-1 p-8 bg-gray-100 overflow-auto ml-10 mt-16">
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
              <div className="flex space-x-4 right-0">
                <button
                  onClick={() => handleCardClick(item)}
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ImageEdite
        isOpen={isPopUpOpen}
        onClose={handleClosePopup}
        item={selectedItem}
      />

      <ToastContainer />
    </div>
  );
}

export default ImageList;
