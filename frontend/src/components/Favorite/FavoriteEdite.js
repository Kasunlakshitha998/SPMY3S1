import React, { useState, useEffect } from 'react';
import {
  XIcon,
  ClipboardIcon,
  MicrophoneIcon,
  SwitchHorizontalIcon,
  SpeakerphoneIcon,
} from '@heroicons/react/outline';
import { translateText } from '../Translator/translateText';
import Cookies from 'js-cookie';
import { Filter } from 'bad-words';
import { updateFavorite } from '../../services/api';
import { translateTextPro } from '../Translator/pro/translateTextPro';

const TranslateEdite = ({ isOpen, onClose, favorite }) => {
  const filter = new Filter();
  const age = Cookies.get('age');

  // Initialize state using favorite or defaults
  const [fromText, setFromText] = useState(favorite?.text || '');
  const [translatedText, setTranslatedText] = useState(
    favorite?.translatedText || ''
  );
  const [fromLang, setFromLang] = useState(favorite?.fromLang || 'en');
  const [toLang, setToLang] = useState(favorite?.toLang || 'si');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset state when favorite changes
  useEffect(() => {
    if (favorite) {
      setFromText(favorite.text || '');
      setTranslatedText(favorite.translatedText || '');
      setFromLang(favorite.fromLang || 'en');
      setToLang(favorite.toLang || 'si');
    }
  }, [favorite]);

  // Early return here AFTER hooks are initialized
  if (!isOpen || !favorite) return null;
  const paid = Cookies.get('paid');
  const handleTranslateText = () => {
    if (paid == 'no') {
      translateText(
        fromText,
        fromLang,
        toLang,
        setLoading,
        setError,
        setTranslatedText
      );
    }

    if (paid == 'yes') {
      translateTextPro(
        fromText,
        fromLang,
        toLang,
        setLoading,
        setError,
        setTranslatedText
      );
    }
  };

  const handleLanguageSwap = () => {
    const temp = fromLang;
    setFromLang(toLang);
    setToLang(temp);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText);
    alert('Copied to clipboard!');
  };

  const handleTextChange = (e) => {
    const textN = e.target.value;
    setFromText(textN);
    if (age < 18) {
      if (filter.isProfane(textN)) {
        setError('Inappropriate language detected.');
      } else {
        setError('');
      }
    }
  };

  const handleTextToSpeech = () => {
    const speech = new SpeechSynthesisUtterance(translatedText);
    speech.lang = toLang === 'si' ? 'si-LK' : 'en-US'; // Adjust based on language
    window.speechSynthesis.speak(speech);
  };

  const handleSpeechToText = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Speech Recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = fromLang;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setLoading(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setFromText(transcript);
      setLoading(false);
    };

    recognition.onerror = (event) => {
      setError(`Error occurred in recognition: ${event.error}`);
      setLoading(false);
    };

    recognition.start();
  };

  // Function to add translation to favorites
  const handleUpdateFavorite = async () => {
    if (fromText && translatedText) {
      try {
        await updateFavorite(fromText, translatedText, favorite._id);
        alert('Favorite updated!');
        onClose();
      } catch (error) {
        console.error('Failed to update favorite:', error);
        alert('Failed to update favorite. Please try again.');
      }
    } else {
      alert('Please translate the text before updating favorites.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
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

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <textarea
              value={fromText}
              onChange={handleTextChange}
              placeholder="Enter text here..."
              className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            ></textarea>

            <div className="relative">
              <textarea
                value={translatedText}
                readOnly
                placeholder="Translation appears here..."
                className="w-full h-48 p-4 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 focus:outline-none"
              ></textarea>
              <button
                onClick={copyToClipboard}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition duration-300"
              >
                <ClipboardIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              className="text-gray-600 hover:text-gray-800 transition duration-300"
              onClick={handleSpeechToText}
            >
              <MicrophoneIcon className="h-6 w-6" />
            </button>

            <select
              value={fromLang}
              onChange={(e) => setFromLang(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            >
              <option value="en">English</option>
              <option value="si">Sinhala</option>
            </select>

            <button
              onClick={handleLanguageSwap}
              className="text-gray-600 hover:text-gray-800 transition duration-300"
            >
              <SwitchHorizontalIcon className="h-6 w-6" />
            </button>

            <select
              value={toLang}
              onChange={(e) => setToLang(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            >
              <option value="si">Sinhala</option>
              <option value="en">English</option>
            </select>

            <button
              className="text-gray-600 hover:text-gray-800 transition duration-300"
              onClick={handleTextToSpeech}
            >
              <SpeakerphoneIcon className="h-6 w-6" />
            </button>
          </div>

          <button
            onClick={handleTranslateText}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
            } transition duration-300`}
            disabled={loading}
          >
            {loading ? 'Translating...' : 'Translate Text'}
          </button>

          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            onClick={handleUpdateFavorite}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranslateEdite;
