// src/components/ImageList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Nav/Sidebar';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImageEdite from './ImageEdite';
import { jsPDF } from 'jspdf'; // Import jsPDF
import NotoSansSinhala from '../fonts/NotoSansSinhala'; // Import the custom Sinhala font

function ImageList({ handleLogout }) {
  const [savedItems, setSavedItems] = useState([]);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const currentUserId = Cookies.get('userId');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setIsLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5050/imageSave/');
      const saveItem = response.data.filter(
        (entry) => entry.user === currentUserId
      );
      setSavedItems(saveItem);
    } catch (err) {
      console.error('Failed to fetch saved items', err);
      setError('Failed to fetch saved items');
      toast.error('Failed to fetch saved items');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch saved items on component mount
  useEffect(() => {
    fetchSavedItems();
  }, []);

  // Handle delete item
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5050/imageSave/delete/${id}`); // Adjust URL to match your backend route
      // Update the state after deleting an item by filtering it out of the savedItems
      setSavedItems(savedItems.filter((item) => item._id !== id));

      toast.success('Deleted successfully!', {
        position: 'top-right',
        autoClose: 3000, // Auto close after 3 seconds
      });
    } catch (err) {
      console.error('Failed to delete item', err);
      toast.error('Failed to delete item');
    }
  };

  // Define filtered items based on search term
  const filteredItems = savedItems.filter((item) => {
    const translatedTextMatch = item.translatedText
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return translatedTextMatch;
  });

  // Function to fetch image as base64
  const fetchImageAsBase64 = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl, { mode: 'cors' });
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result); // This will be a base64 encoded string
        };
        reader.onerror = () => {
          reject('Failed to convert image to base64');
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error fetching image:', error);
      return null;
    }
  };

  // Generate PDF report with images and translated Sinhala text only
  const generatePDFReport = async () => {
    const doc = new jsPDF();

    // Add the custom Sinhala font to jsPDF
    doc.addFileToVFS('NotoSansSinhala-Regular.ttf', NotoSansSinhala);
    doc.addFont('NotoSansSinhala-Regular.ttf', 'NotoSansSinhala', 'normal');
    doc.setFont('NotoSansSinhala'); // Set the font to the custom Sinhala font

    // Title
    doc.setFontSize(22);
    doc.text('Image List Report', 14, 22);

    // Author and Date
    doc.setFontSize(12);
    
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 38);

    // Section for Images and Translated Text
    doc.setFontSize(16);
    doc.text('Images and Translated Text', 14, 48);

    let verticalOffset = 58; // Y-axis offset for the images and text

    for (const item of filteredItems) {
      if (verticalOffset > 270) { // Check if we need to add a new page
        doc.addPage();
        verticalOffset = 20; // Reset vertical offset
      }

      // Fetch the image as base64
      const imgData = await fetchImageAsBase64(item.image);
      if (imgData) {
        doc.addImage(imgData, 'JPEG', 14, verticalOffset, 40, 40); // Adjust dimensions as needed
      }

      // Translated Text (Sinhala)
      doc.setFontSize(14);
      doc.text('Translated Text:', 60, verticalOffset + 10);
      doc.setFontSize(12);
      doc.text(item.translatedText, 60, verticalOffset + 16, { maxWidth: 130 });

      // Update vertical offset for the next item
      verticalOffset += 50;
    }

    // Save the PDF
    doc.save('ImageList_Report.pdf');
  };

  return (
    <div className="flex h-screen">
      <Sidebar handleLogout={handleLogout} />

      <div className="flex-1 p-8 bg-gray-100 overflow-auto ml-10 mt-16">
        <div className="space-y-4 w-9/12 ml-60">
          {/* Search Bar */}
          <div className="mb-4 flex items-center">
            <input
              type="text"
              placeholder="Search by Translated Text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="ml-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Clear
              </button>
            )}
          </div>

          {/* Loading and Error States */}
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
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
                <div>
                  <p className="font-bold">Translated Text:</p>
                  <p>{item.translatedText}</p>
                </div>
                <div className="flex space-x-4 mt-4">
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
            ))
          ) : (
            <p>No items found matching your search.</p>
          )}

          {/* Button to Generate PDF Report */}
          <button
            onClick={generatePDFReport}
            className="mt-4 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition duration-300"
          >
            Generate PDF Report
          </button>
        </div>
      </div>

      <ImageEdite
        isOpen={isPopUpOpen}
        onClose={handleClosePopup}
        item={selectedItem}
        onEditSuccess={fetchSavedItems} // Optional: To refresh list after edit
      />

      <ToastContainer />
    </div>
  );
}

export default ImageList;
