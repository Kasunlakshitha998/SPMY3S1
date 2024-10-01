import React, { useState, useCallback, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import { translateText } from '../Translator/translateText';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { XIcon } from '@heroicons/react/outline';

const ImageEdite = ({ user, isOpen, onClose, item }) => {
  const [imageBase64, setImageBase64] = useState(item?.image || '');
  const [fromText, setFromText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const navigate = useNavigate();
  const [fromLang, setFromLang] = useState(item?.fromLang || 'en');
  const [toLang, setToLang] = useState(item?.toLang || 'si');

  // Reset state when favorite changes
  useEffect(() => {
    if (item) {
      setImageBase64(item.image || '');
      setFromText(item.text || '');
      setTranslatedText(item.translatedText || '');
      setFromLang(item.fromLang || 'en');
      setToLang(item.toLang || 'si');
    }
  }, [item]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      convertToBase64(file);
    }
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      convertToBase64(file);
    }
  };

  const convertToBase64 = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Clear previous image and text
      setImageBase64(reader.result);
      setFromText('');
      setTranslatedText('');
      extractTextFromImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const extractTextFromImage = (base64Image) => {
    setLoading(true);
    Tesseract.recognize(base64Image, 'eng', { logger: (m) => console.log(m) })
      .then(({ data: { text } }) => {
        setFromText(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to extract text from the image.');
        setLoading(false);
      });
  };

  const handleTranslateImageText = () => {
    translateText(
      fromText,
      fromLang,
      toLang,
      setLoading,
      setError,
      setTranslatedText,
      user
    );
  };

  const currentUserId = Cookies.get('userId');

const handleUpdate = async () => {
  if (!imageBase64) {
    setError('No image selected.');
    return;
  }

  try {
    const response = await axios.put(
      `http://localhost:5050/imageSave/update/${item._id}`,
      {
        user: currentUserId,
        image: imageBase64,
        originalText: fromText,
        translatedText: translatedText,
        createdAt: new Date(),
      }
    );

    console.log(response.data);
    alert('Image updated!');
    onClose();
  } catch (err) {
    console.error(err);
    setError('Failed to update the data.');
  }
};


  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-2/4 p-6 space-y-4">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition duration-300"
          onClick={onClose}
        >
          <XIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Edit Translation
        </h2>

        <div className="p-6 bg-white shadow-md rounded-lg">
          {/* Display current image if available */}
          {imageBase64 && (
            <div className="mb-4">
              <img
                src={imageBase64}
                alt="Selected"
                className="w-40 h-40 object-contain rounded-lg border-spacing-1 border-b-gray-900"
              />
            </div>
          )}

          <div
            className={`border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4 ${
              isDragOver ? 'bg-gray-100 border-blue-500' : 'bg-gray-50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer text-center block text-gray-600 hover:text-gray-800"
            >
              Drag and drop an image here or click to upload
            </label>
          </div>
          {loading && <p>Loading...</p>}

          <textarea
            value={fromText}
            placeholder="Extracted text from image"
            className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none"
            readOnly
          />

          <button
            onClick={handleTranslateImageText}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          >
            Translate Image Text
          </button>

          {translatedText && (
            <div className="mt-4">
              <p className="text-lg font-semibold">Translated Text:</p>
              <p className="mt-2">{translatedText}</p>
            </div>
          )}

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageEdite;
